import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { newDeliverableEmail } from '@/lib/email-templates'

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)
  if (adminEmails.length > 0 && !adminEmails.includes(user.email ?? '')) return null
  return user
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const user = await assertAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json() as {
    clientId: string
    title: string
    description?: string
    type: 'brand_asset' | 'website' | 'social' | 'report' | 'video'
    fileUrl?: string
    previewUrl?: string
    notes?: string
    notifyClient?: boolean
  }

  const { clientId, title, description, type, fileUrl, previewUrl, notes, notifyClient = true } = body

  if (!clientId || !title || !type) {
    return NextResponse.json({ error: 'clientId, title, and type are required.' }, { status: 400 })
  }

  // Fetch client + branding for email
  const { data: client } = await supabase
    .from('clients')
    .select('id, name, email, brand_name, brand_primary_color, brand_logo_url')
    .eq('id', clientId)
    .single()

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  // Insert deliverable
  const { data: deliverable, error: insertError } = await supabase
    .from('deliverables')
    .insert({
      client_id: clientId,
      title,
      description: description ?? null,
      type,
      status: 'pending_review',
      file_url: fileUrl || null,
      preview_url: previewUrl || null,
      notes: notes ?? null,
      version: 1,
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Also insert initial version record
  await supabase.from('deliverable_versions').insert({
    deliverable_id: deliverable.id,
    version: 1,
    file_url: fileUrl || null,
    preview_url: previewUrl || null,
    notes: notes ?? null,
    created_by: user.email,
  })

  // Notify client via email
  if (notifyClient && client.email) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexus.ziggytechcreative.com'
    const branding = {
      agencyName: client.brand_name ?? 'ZiggyNexus',
      primaryColor: client.brand_primary_color ?? '#10b981',
      logoUrl: client.brand_logo_url,
    }

    const html = newDeliverableEmail({
      branding,
      clientName: client.name,
      deliverableTitle: title,
      deliverableType: type,
      portalUrl: siteUrl,
    })

    await resend.emails.send({
      from: `${branding.agencyName} <${FROM_EMAIL}>`,
      to: client.email,
      subject: `New deliverable ready for your review — ${title}`,
      html,
    }).catch((err: unknown) => {
      console.error('Failed to send deliverable notification:', err)
    })
  }

  return NextResponse.json({ success: true, deliverable })
}
