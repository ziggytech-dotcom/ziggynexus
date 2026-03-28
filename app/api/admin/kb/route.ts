import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)
  if (adminEmails.length > 0 && !adminEmails.includes(user.email ?? '')) return null
  return user
}

// GET /api/admin/kb — list all articles
// GET /api/admin/kb?id=… — fetch single article with content
export async function GET(request: Request) {
  const supabase = await createClient()
  const user = await assertAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const { data: article } = await supabase
      .from('kb_articles')
      .select('*')
      .eq('id', id)
      .single()
    return NextResponse.json({ article })
  }

  const { data: articles } = await supabase
    .from('kb_articles')
    .select('id, client_id, title, slug, category, published, created_at')
    .order('created_at', { ascending: false })

  return NextResponse.json({ articles })
}

// POST /api/admin/kb — create article
export async function POST(request: Request) {
  const supabase = await createClient()
  const user = await assertAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { clientId, title, slug, content, category, published } = await request.json() as {
    clientId: string
    title: string
    slug: string
    content: string
    category: string
    published: boolean
  }

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'title, slug, and content are required.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('kb_articles')
    .insert({
      client_id: clientId || null,
      title,
      slug,
      content,
      category: category || null,
      published,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A slug with that name already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, article: data })
}

// PATCH /api/admin/kb — update article
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const user = await assertAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json() as {
    id: string
    clientId?: string
    title?: string
    slug?: string
    content?: string
    category?: string
    published?: boolean
  }

  const { id, ...rest } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const updates: Record<string, unknown> = {}
  if (rest.title !== undefined) updates.title = rest.title
  if (rest.slug !== undefined) updates.slug = rest.slug
  if (rest.content !== undefined) updates.content = rest.content
  if (rest.category !== undefined) updates.category = rest.category || null
  if (rest.published !== undefined) updates.published = rest.published
  if ('clientId' in rest) updates.client_id = rest.clientId || null

  const { error } = await supabase
    .from('kb_articles')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

// DELETE /api/admin/kb — delete article
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const user = await assertAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json() as { id: string }
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabase
    .from('kb_articles')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
