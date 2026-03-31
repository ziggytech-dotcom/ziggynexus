import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import dns from 'dns/promises'

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

  const { clientId } = await request.json() as { clientId: string }
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  const { data: client } = await supabase
    .from('clients')
    .select('custom_domain')
    .eq('id', clientId)
    .single()

  if (!client?.custom_domain) {
    return NextResponse.json({ error: 'No custom domain set for this client' }, { status: 400 })
  }

  const primaryHost = (process.env.NEXT_PUBLIC_SITE_URL ?? 'app.ziggynexus.com')
    .replace(/^https?:\/\//, '')
    .split('/')[0]

  let verified = false
  let resolvedCname = ''

  try {
    const addresses = await dns.resolveCname(client.custom_domain)
    resolvedCname = addresses[0] ?? ''
    // Accept if CNAME resolves to our primary host (strip trailing dot)
    verified = resolvedCname.replace(/\.$/, '') === primaryHost
  } catch {
    // DNS lookup failed — domain not configured or doesn't exist
    verified = false
  }

  await supabase
    .from('clients')
    .update({ custom_domain_verified: verified })
    .eq('id', clientId)

  return NextResponse.json({ verified, resolvedCname, expected: primaryHost })
}
