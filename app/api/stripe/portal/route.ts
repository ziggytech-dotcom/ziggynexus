// Create a Stripe Billing Portal session for the authenticated client
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-03-25.dahlia',
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get client's Stripe customer ID from any of their invoices
  const { data: invoice } = await supabase
    .from('invoices')
    .select('stripe_customer_id')
    .eq('client_id', (await supabase
      .from('clients')
      .select('id')
      .eq('email', user.email)
      .single()
    ).data?.id ?? '')
    .not('stripe_customer_id', 'is', null)
    .limit(1)
    .single()

  if (!invoice?.stripe_customer_id) {
    return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.ziggynexus.com'

  const session = await stripe.billingPortal.sessions.create({
    customer: invoice.stripe_customer_id,
    return_url: `${siteUrl}/invoices`,
  })

  return NextResponse.json({ url: session.url })
}
