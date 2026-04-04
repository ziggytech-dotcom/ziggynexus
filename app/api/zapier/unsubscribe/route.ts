export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)
  if (adminEmails.length > 0 && !adminEmails.includes(user.email ?? '')) return null
  return user
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const user = await assertAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json() as { id?: string; target_url?: string }
  const { id, target_url } = body

  if (!id && !target_url) {
    return NextResponse.json({ error: 'Provide id or target_url to unsubscribe.' }, { status: 400 })
  }

  const admin = createAdminClient()
  let query = admin.from('zapier_subscriptions').delete()

  if (id) {
    query = query.eq('id', id)
  } else if (target_url) {
    query = query.eq('target_url', target_url)
  }

  const { error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
