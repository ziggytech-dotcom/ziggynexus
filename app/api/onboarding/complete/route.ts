import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { welcomeEmail } from '@/lib/email-templates'
import { upsertSharedContact } from '@/lib/sharedContacts'
import { triggerZapierWebhook } from '@/lib/zapier'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as {
    company?: string
    phone?: string
    notes?: string
  }

  const { error: updateErr } = await supabase
    .from('clients')
    .update({
      company: body.company || undefined,
      phone: body.phone || undefined,
      onboarding_completed: true,
      notes: body.notes || undefined,
    })
    .eq('email', user.email)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  // Fetch client with branding for welcome email + shared contacts sync
  const { data: client } = await supabase
    .from('clients')
    .select('id, name, email, phone, company, brand_name, brand_primary_color, brand_logo_url')
    .eq('email', user.email)
    .single()

  // Fire Zapier client.added webhook (non-blocking)
  if (client) {
    triggerZapierWebhook(client.id as string, 'client.added', { client })
  }

  // Sync to shared_contacts (best-effort, fire-and-forget)
  if (client) {
    const nameParts = (client.name || '').trim().split(' ')
    void upsertSharedContact(
      {
        first_name: nameParts[0] || null,
        last_name: nameParts.slice(1).join(' ') || null,
        email: (client.email as string | null) ?? user.email,
        phone: (client.phone as string | null) ?? body.phone ?? null,
        company: (client.company as string | null) ?? body.company ?? null,
      },
      client.id as string,
    )
  }

  if (client && resend) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.ziggynexus.com'
    const branding = {
      agencyName: client.brand_name ?? 'ZiggyNexus',
      primaryColor: client.brand_primary_color ?? '#10b981',
      logoUrl: client.brand_logo_url,
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Welcome to your ${branding.agencyName} portal`,
      html: welcomeEmail({ branding, clientName: client.name, portalUrl: siteUrl }),
    }).catch(() => { /* non-fatal — don't block onboarding completion */ })
  }

  return NextResponse.json({ success: true })
}
