import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)
  if (adminEmails.length > 0 && !adminEmails.includes(user.email ?? '')) return null
  return user
}

export async function GET() {
  const supabase = await createClient()
  const user = await assertAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, name, email, custom_domain, custom_domain_verified')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ clients })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const user = await assertAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { clientId, domain } = await request.json() as {
    clientId: string
    domain: string | null
  }

  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  // Validate domain format (basic)
  if (domain) {
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 })
    }
  }

  const { error } = await supabase
    .from('clients')
    .update({
      custom_domain: domain ?? null,
      custom_domain_verified: false, // reset verification on change
    })
    .eq('id', clientId)

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'That domain is already in use by another client.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
