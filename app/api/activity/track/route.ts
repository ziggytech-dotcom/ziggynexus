export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { workspaceActivityEmail } from '@/lib/email-templates'
import { triggerZapierWebhook } from '@/lib/zapier'

const WORKSPACE_EMAIL = process.env.WORKSPACE_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? ''
const ADMIN_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.ziggynexus.com'

const EVENT_DESCRIPTIONS: Record<string, (data: Record<string, unknown>, clientName: string) => string> = {
  file_viewed: (d, n) => `${n} viewed "${d.article_title ?? d.file_name ?? 'a file'}" in their portal.`,
  deliverable_viewed: (d, n) => `${n} opened deliverable "${d.deliverable_title ?? ''}" for review.`,
  payment_made: (d, n) => `${n} completed a payment${d.amount ? ` of ${d.amount}` : ''}.`,
  message_sent: (d, n) => `${n} sent a message: "${String(d.message ?? '').slice(0, 120)}"`,
  upload_completed: (d, n) => `${n} uploaded a file: "${d.file_name ?? 'unknown'}".`,
  approval_submitted: (d, n) => `${n} submitted an approval decision ("${d.status ?? ''}") on "${d.deliverable_title ?? ''}".`,
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { eventType, eventData = {} } = body as {
    eventType: string
    eventData: Record<string, unknown>
  }

  if (!eventType) {
    return NextResponse.json({ error: 'eventType required' }, { status: 400 })
  }

  // Resolve client record
  const { data: client } = await supabase
    .from('clients')
    .select('id, name, brand_name, brand_primary_color, brand_logo_url')
    .eq('email', user.email)
    .single()

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  // Insert activity record
  const { error: insertError } = await supabase
    .from('portal_activity')
    .insert({
      client_id: client.id,
      event_type: eventType,
      event_data: eventData,
      user_email: user.email,
      workspace_notified: false,
    })

  if (insertError) {
    console.error('Activity insert error:', insertError)
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 })
  }

  // Fire Zapier webhooks for mapped event types (non-blocking)
  if (eventType === 'file_viewed') {
    triggerZapierWebhook(client.id, 'invoice.viewed', { event_data: eventData, client_id: client.id })
  } else if (eventType === 'message_sent') {
    triggerZapierWebhook(client.id, 'message.received', { event_data: eventData, client_id: client.id })
  }

  // Notify workspace via email (fire-and-forget; do not fail the request if email fails)
  if (WORKSPACE_EMAIL) {
    const branding = {
      agencyName: client.brand_name ?? 'ZiggyNexus',
      primaryColor: client.brand_primary_color ?? '#10b981',
      logoUrl: client.brand_logo_url,
    }
    const descFn = EVENT_DESCRIPTIONS[eventType]
    const description = descFn
      ? descFn(eventData, client.name)
      : `${client.name} performed action: ${eventType}`

    const html = workspaceActivityEmail({
      branding,
      clientName: client.name,
      eventType,
      eventDescription: description,
      portalAdminUrl: `${ADMIN_URL}/admin`,
      occurredAt: new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
      }),
    })

    resend.emails.send({
      from: `${branding.agencyName} Portal <${FROM_EMAIL}>`,
      to: WORKSPACE_EMAIL,
      subject: `[Portal] ${client.name} — ${eventType.replace(/_/g, ' ')}`,
      html,
    }).then(async () => {
      // Mark as notified
      await supabase
        .from('portal_activity')
        .update({ workspace_notified: true })
        .eq('client_id', client.id)
        .eq('workspace_notified', false)
    }).catch((err: unknown) => {
      console.error('Workspace notification email failed:', err)
    })
  }

  return NextResponse.json({ success: true })
}
