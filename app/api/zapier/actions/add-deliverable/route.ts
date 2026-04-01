import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isAuthorized(request: Request): boolean {
  const key = request.headers.get('x-api-key')
  return key === process.env.ZAPIER_API_KEY || process.env.NODE_ENV === 'development'
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as {
    clientId: string
    title: string
    description?: string
    type: 'brand_asset' | 'website' | 'social' | 'report' | 'video'
    fileUrl?: string
    previewUrl?: string
    notes?: string
  }

  const { clientId, title, description, type, fileUrl, previewUrl, notes } = body

  if (!clientId || !title || !type) {
    return NextResponse.json({ error: 'clientId, title, and type are required.' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Verify client exists
  const { data: client } = await admin
    .from('clients')
    .select('id')
    .eq('id', clientId)
    .single()

  if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404 })

  const { data: deliverable, error: insertError } = await admin
    .from('deliverables')
    .insert({
      client_id: clientId,
      title,
      description: description ?? null,
      type,
      status: 'pending_review',
      file_url: fileUrl ?? null,
      preview_url: previewUrl ?? null,
      notes: notes ?? null,
      version: 1,
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  // Insert initial version record
  await admin.from('deliverable_versions').insert({
    deliverable_id: deliverable.id,
    version: 1,
    file_url: fileUrl ?? null,
    preview_url: previewUrl ?? null,
    notes: notes ?? null,
    created_by: 'zapier',
  })

  return NextResponse.json({ success: true, deliverable })
}
