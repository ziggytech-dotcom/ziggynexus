import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as {
    brand_name?: string
    brand_primary_color?: string
    hide_powered_by?: boolean
    brand_logo_url?: string | null
  }

  // Validate hex color if provided
  if (body.brand_primary_color && !/^#[0-9A-Fa-f]{6}$/.test(body.brand_primary_color)) {
    return NextResponse.json({ error: 'Invalid color format — use a 6-digit hex (#RRGGBB).' }, { status: 400 })
  }

  const { error } = await supabase
    .from('clients')
    .update({
      brand_name: body.brand_name?.trim() || null,
      brand_primary_color: body.brand_primary_color || null,
      hide_powered_by: body.hide_powered_by ?? false,
      brand_logo_url: body.brand_logo_url ?? null,
    })
    .eq('email', user.email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
