export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/resend'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deliverableId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message } = await request.json() as { message: string }
  if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  // Verify this deliverable belongs to the authenticated client
  const { data: client } = await supabase
    .from('clients')
    .select('id, name, brand_name, brand_primary_color')
    .eq('email', user.email)
    .single()

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const { data: deliverable } = await supabase
    .from('deliverables')
    .select('id, title, client_id')
    .eq('id', deliverableId)
    .eq('client_id', client.id)
    .single()

  if (!deliverable) return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 })

  // Insert comment
  const { data: comment, error: insertErr } = await supabase
    .from('approval_comments')
    .insert({
      deliverable_id: deliverableId,
      author: client.name,
      author_role: 'client',
      comment: message.trim(),
    })
    .select()
    .single()

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

  // Notify admin via email
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.ziggynexus.com'

  if (adminEmails.length > 0 && resend) {
    const agencyName = client.brand_name ?? 'ZiggyNexus'
    const color = client.brand_primary_color ?? '#10b981'

    await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmails,
      subject: `New comment from ${client.name} on "${deliverable.title}"`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#0d0d0d;color:#f5f0e8;border-radius:12px">
          <div style="font-size:11px;letter-spacing:0.15em;color:${color};text-transform:uppercase;margin-bottom:8px;font-weight:500">${agencyName}</div>
          <h2 style="font-size:20px;font-weight:400;margin:0 0 16px">New client comment</h2>
          <p style="color:rgba(245,240,232,0.6);font-size:14px;margin:0 0 6px"><strong style="color:#f5f0e8">${client.name}</strong> left a comment on:</p>
          <p style="font-size:15px;color:${color};margin:0 0 20px">"${deliverable.title}"</p>
          <blockquote style="margin:0 0 24px;padding:12px 16px;background:rgba(255,255,255,0.04);border-left:3px solid ${color};border-radius:0 8px 8px 0;font-size:14px;line-height:1.6;color:#f5f0e8">
            ${message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </blockquote>
          <a href="${siteUrl}/admin" style="display:inline-block;padding:10px 20px;background:${color};border-radius:8px;color:#050505;font-size:13px;font-weight:600;text-decoration:none">View in Admin →</a>
        </div>
      `,
    }).catch(() => { /* non-fatal */ })
  }

  return NextResponse.json({ comment })
}
