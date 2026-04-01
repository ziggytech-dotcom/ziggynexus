import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { triggerZapierWebhook } from '@/lib/zapier'

function isAuthorized(request: Request): boolean {
  const key = request.headers.get('x-api-key')
  return key === process.env.ZAPIER_API_KEY || process.env.NODE_ENV === 'development'
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as {
    name: string
    email?: string
    company?: string
    phone?: string
    package?: string
  }

  const { name, email, company, phone } = body

  if (!name) {
    return NextResponse.json({ error: 'name is required.' }, { status: 400 })
  }

  // Generate a slug from the name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Date.now().toString(36)

  const admin = createAdminClient()
  const { data: client, error } = await admin
    .from('clients')
    .insert({
      name,
      slug,
      email: email ?? null,
      company: company ?? null,
      phone: phone ?? null,
      package: body.package ?? 'starter',
      status: 'active',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fire Zapier webhook for client.added (non-blocking)
  triggerZapierWebhook(client.id, 'client.added', { client })

  return NextResponse.json({ success: true, client })
}
