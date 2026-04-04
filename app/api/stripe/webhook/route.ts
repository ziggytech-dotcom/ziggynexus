export const dynamic = 'force-dynamic';
// Stripe webhook handler &mdash; syncs invoice events to Supabase
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' as any })

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'invoice.created': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id

      // Find client by Stripe customer ID
      const { data: clientInvoice } = await supabase
        .from('invoices')
        .select('client_id')
        .eq('stripe_customer_id', customerId)
        .limit(1)
        .single()

      if (clientInvoice) {
        // In Stripe API 2026+, subscription reference is via invoice.parent
        const parentSub = invoice.parent?.type === 'subscription_details'
          ? (invoice.parent as { type: string; subscription_details?: { subscription: string } }).subscription_details?.subscription ?? null
          : null

        await supabase.from('invoices').upsert({
          stripe_invoice_id: invoice.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: parentSub,
          client_id: clientInvoice.client_id,
          amount_cents: invoice.amount_due,
          currency: invoice.currency,
          status: invoice.status ?? 'draft',
          due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString().split('T')[0] : null,
          description: invoice.description ?? `Invoice ${invoice.number}`,
          invoice_number: invoice.number,
          recurring: !!parentSub,
          recurring_interval: null,
        }, { onConflict: 'stripe_invoice_id' })
      }
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('stripe_invoice_id', invoice.id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await supabase
        .from('invoices')
        .update({ status: 'open' })
        .eq('stripe_invoice_id', invoice.id)
      break
    }

    case 'invoice.voided': {
      const invoice = event.data.object as Stripe.Invoice
      await supabase
        .from('invoices')
        .update({ status: 'void' })
        .eq('stripe_invoice_id', invoice.id)
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const interval = sub.items.data[0]?.plan.interval ?? null
      const intervalMap: Record<string, string> = {
        month: 'monthly',
        quarter: 'quarterly',
        year: 'annually',
      }

      await supabase
        .from('invoices')
        .update({ recurring_interval: interval ? (intervalMap[interval] ?? interval) : null })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    default:
      // Unhandled event type &mdash; safe to ignore
      break
  }

  return NextResponse.json({ received: true })
}
