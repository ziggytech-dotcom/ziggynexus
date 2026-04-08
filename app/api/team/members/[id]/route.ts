export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabaseAdmin = createAdminClient()
  const { data: { user } } = await supabaseAdmin.auth.getUser(
    req.headers.get('authorization')?.replace('Bearer ', '') || ''
  )
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabaseAdmin.from('workspace_members').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
