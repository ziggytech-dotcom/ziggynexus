export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { triggerZapierWebhook } from '@/lib/zapier'

const ZAPIER_STATUS_MAP: Record<string, string> = {
  approved: 'deliverable.approved',
  rejected: 'deliverable.rejected',
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { deliverableId, status } = await request.json() as {
    deliverableId: string
    status: string
  }

  const eventType = ZAPIER_STATUS_MAP[status]
  if (!deliverableId || !eventType) {
    return NextResponse.json({ error: 'deliverableId and a triggerable status are required.' }, { status: 400 })
  }

  // Resolve client &mdash; verify deliverable belongs to this user's client record
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user.email)
    .single()

  if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404 })

  const { data: deliverable } = await supabase
    .from('deliverables')
    .select('id, title, type, status, client_id')
    .eq('id', deliverableId)
    .eq('client_id', client.id)
    .single()

  if (!deliverable) return NextResponse.json({ error: 'Deliverable not found.' }, { status: 404 })

  // Fire webhook non-blocking
  triggerZapierWebhook(client.id, eventType, { deliverable })

  return NextResponse.json({ success: true })
}
