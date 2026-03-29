import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/resend'
import {
  newDeliverableEmail,
  approvalStatusEmail,
  welcomeEmail,
} from '@/lib/email-templates'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { type, deliverableId, newStatus } = body

  // Load client + branding
  const { data: client } = await supabase
    .from('clients')
    .select('id, name, email, brand_logo_url, brand_primary_color, brand_name')
    .eq('email', user.email)
    .single()

  if (!client?.email) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexus.ziggytechcreative.com'
  const branding = {
    agencyName: client.brand_name ?? 'ZiggyNexus',
    primaryColor: client.brand_primary_color ?? '#10b981',
    logoUrl: client.brand_logo_url,
  }

  let html = ''
  let subject = ''

  if (type === 'welcome') {
    subject = `Welcome to your ${branding.agencyName} portal`
    html = welcomeEmail({ branding, clientName: client.name, portalUrl: siteUrl })
  }

  if (type === 'new_deliverable' && deliverableId) {
    const { data: deliverable } = await supabase
      .from('deliverables')
      .select('title, type')
      .eq('id', deliverableId)
      .single()

    if (!deliverable) {
      return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 })
    }

    subject = `New deliverable ready for your review — ${deliverable.title}`
    html = newDeliverableEmail({
      branding,
      clientName: client.name,
      deliverableTitle: deliverable.title,
      deliverableType: deliverable.type,
      portalUrl: siteUrl,
    })
  }

  if (type === 'approval_status' && deliverableId && newStatus) {
    const { data: deliverable } = await supabase
      .from('deliverables')
      .select('title, type')
      .eq('id', deliverableId)
      .single()

    if (!deliverable) {
      return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 })
    }

    const statusLabels: Record<string, string> = {
      approved: 'Approved',
      changes_requested: 'Changes Requested',
      rejected: 'Rejected',
    }
    subject = `${deliverable.title} — ${statusLabels[newStatus] ?? newStatus}`
    html = approvalStatusEmail({
      branding,
      clientName: client.name,
      deliverableTitle: deliverable.title,
      deliverableType: deliverable.type,
      newStatus,
      portalUrl: siteUrl,
    })
  }

  if (!html || !subject) {
    return NextResponse.json({ error: 'Unknown email type or missing params' }, { status: 400 })
  }

  const { data, error } = await resend.emails.send({
    from: `${branding.agencyName} <${FROM_EMAIL}>`,
    to: client.email,
    subject,
    html,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data?.id })
}
