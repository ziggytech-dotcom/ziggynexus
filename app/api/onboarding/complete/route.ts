import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { welcomeEmail } from '@/lib/email-templates'

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

  // Send branded welcome email
  const { data: client } = await supabase
    .from('clients')
    .select('name, brand_name, brand_primary_color, brand_logo_url')
    .eq('email', user.email)
    .single()

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
