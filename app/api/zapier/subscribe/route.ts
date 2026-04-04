export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_EVENT_TYPES = [
  'client.added',
  'deliverable.approved',
  'deliverable.rejected',
  'invoice.viewed',
  'message.received',
]

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

  const body = await request.json() as {
    workspace_id: string
    event_type: string
    target_url: string
    secret?: string
  }

  const { workspace_id, event_type, target_url, secret } = body

  if (!workspace_id || !event_type || !target_url) {
    return NextResponse.json({ error: 'workspace_id, event_type, and target_url are required.' }, { status: 400 })
  }

  if (!VALID_EVENT_TYPES.includes(event_type)) {
    return NextResponse.json(
      { error: `Invalid event_type. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('zapier_subscriptions')
    .insert({ workspace_id, event_type, target_url, secret: secret ?? null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, subscription: data })
}
