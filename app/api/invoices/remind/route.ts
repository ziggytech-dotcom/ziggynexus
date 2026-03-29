// Payment reminder API — called by a cron job or manually
// Sends reminder emails for invoices that are 3, 7, or 14 days overdue
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { invoiceReminderEmail } from '@/lib/email-templates'

// Simple auth: require a secret header so this can't be called publicly
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('x-reminder-secret')
  return authHeader === process.env.REMINDER_SECRET || process.env.NODE_ENV === 'development'
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find overdue open invoices that haven't had their reminders sent
  const { data: overdueInvoices, error: fetchError } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (
        name,
        email,
        brand_logo_url,
        brand_primary_color,
        brand_name
      )
    `)
    .eq('status', 'open')
    .not('due_date', 'is', null)
    .lt('due_date', today.toISOString().split('T')[0])

  if (fetchError) {
    console.error('Error fetching overdue invoices:', fetchError)
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexus.ziggytechcreative.com'
  const results: { invoiceId: string; reminderType: string; sent: boolean }[] = []

  for (const invoice of overdueInvoices ?? []) {
    const client = invoice.clients as {
      name: string
      email: string
      brand_logo_url: string | null
      brand_primary_color: string | null
      brand_name: string | null
    } | null

    if (!client?.email) continue

    const dueDate = new Date(invoice.due_date)
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

    const branding = {
      agencyName: client.brand_name ?? 'ZiggyNexus',
      primaryColor: client.brand_primary_color ?? '#10b981',
      logoUrl: client.brand_logo_url,
    }

    const amountDue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency?.toUpperCase() ?? 'USD',
    }).format(invoice.amount_cents / 100)

    const formattedDueDate = new Date(invoice.due_date).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    })

    // 14-day reminder
    if (daysOverdue >= 14 && !invoice.reminder_14d_sent_at) {
      const html = invoiceReminderEmail({
        branding,
        clientName: client.name,
        invoiceNumber: invoice.invoice_number ?? invoice.id.slice(0, 8).toUpperCase(),
        amountDue,
        dueDate: formattedDueDate,
        daysOverdue,
        portalUrl: siteUrl,
      })

      const { error } = await resend.emails.send({
        from: `${branding.agencyName} <${FROM_EMAIL}>`,
        to: client.email,
        subject: `[Action Required] Invoice ${invoice.invoice_number ?? ''} is ${daysOverdue} days overdue`,
        html,
      })

      if (!error) {
        await supabase
          .from('invoices')
          .update({ reminder_14d_sent_at: new Date().toISOString() })
          .eq('id', invoice.id)
        results.push({ invoiceId: invoice.id, reminderType: '14d', sent: true })
      } else {
        results.push({ invoiceId: invoice.id, reminderType: '14d', sent: false })
      }
    }
    // 7-day reminder (only if 14d not yet triggered)
    else if (daysOverdue >= 7 && !invoice.reminder_7d_sent_at) {
      const html = invoiceReminderEmail({
        branding,
        clientName: client.name,
        invoiceNumber: invoice.invoice_number ?? invoice.id.slice(0, 8).toUpperCase(),
        amountDue,
        dueDate: formattedDueDate,
        daysOverdue,
        portalUrl: siteUrl,
      })

      const { error } = await resend.emails.send({
        from: `${branding.agencyName} <${FROM_EMAIL}>`,
        to: client.email,
        subject: `Payment Reminder: Invoice ${invoice.invoice_number ?? ''} is ${daysOverdue} days overdue`,
        html,
      })

      if (!error) {
        await supabase
          .from('invoices')
          .update({ reminder_7d_sent_at: new Date().toISOString() })
          .eq('id', invoice.id)
        results.push({ invoiceId: invoice.id, reminderType: '7d', sent: true })
      } else {
        results.push({ invoiceId: invoice.id, reminderType: '7d', sent: false })
      }
    }
    // 3-day reminder
    else if (daysOverdue >= 3 && !invoice.reminder_3d_sent_at) {
      const html = invoiceReminderEmail({
        branding,
        clientName: client.name,
        invoiceNumber: invoice.invoice_number ?? invoice.id.slice(0, 8).toUpperCase(),
        amountDue,
        dueDate: formattedDueDate,
        daysOverdue,
        portalUrl: siteUrl,
      })

      const { error } = await resend.emails.send({
        from: `${branding.agencyName} <${FROM_EMAIL}>`,
        to: client.email,
        subject: `Friendly reminder: Invoice ${invoice.invoice_number ?? ''} was due ${daysOverdue} days ago`,
        html,
      })

      if (!error) {
        await supabase
          .from('invoices')
          .update({ reminder_3d_sent_at: new Date().toISOString() })
          .eq('id', invoice.id)
        results.push({ invoiceId: invoice.id, reminderType: '3d', sent: true })
      } else {
        results.push({ invoiceId: invoice.id, reminderType: '3d', sent: false })
      }
    }
  }

  const sent = results.filter((r) => r.sent).length
  return NextResponse.json({
    processed: overdueInvoices?.length ?? 0,
    remindersSent: sent,
    results,
  })
}
