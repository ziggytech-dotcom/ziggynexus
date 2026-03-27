import { createClient } from '@/lib/supabase/server'
import ApprovalCard from '@/components/ApprovalCard'
import Link from 'next/link'
import type { ApprovalComment, DeliverableVersion } from '@/lib/types'

export default async function ApprovalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: deliverable } = await supabase
    .from('deliverables')
    .select('*')
    .eq('id', id)
    .single()

  const { data: versions } = await supabase
    .from('deliverable_versions')
    .select('*')
    .eq('deliverable_id', id)
    .order('version', { ascending: false })

  const { data: comments } = await supabase
    .from('approval_comments')
    .select('*')
    .eq('deliverable_id', id)
    .order('created_at', { ascending: true })

  if (!deliverable) {
    return (
      <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>
        Deliverable not found.{' '}
        <Link href="/approvals" style={{ color: 'var(--gold)' }}>
          Back to approvals
        </Link>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Back link */}
      <Link
        href="/approvals"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          marginBottom: '28px',
        }}
      >
        ← Back to Approvals
      </Link>

      <div className="grid-detail">
        {/* Main: Approval card */}
        <div>
          <ApprovalCard deliverable={deliverable} />
        </div>

        {/* Sidebar: History + Comments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Version history */}
          {versions && versions.length > 0 && (
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Version History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {versions.map((v: DeliverableVersion) => (
                  <div
                    key={v.id}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--elevated)',
                      borderRadius: '7px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                        Version {v.version}
                        {v.version === deliverable.version && (
                          <span style={{ color: 'var(--gold)', marginLeft: '6px', fontSize: '11px' }}>
                            Current
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {new Date(v.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </div>
                    </div>
                    {v.file_url && (
                      <a
                        href={v.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '12px',
                          color: 'var(--gold)',
                          textDecoration: 'none',
                        }}
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments thread */}
          {comments && comments.length > 0 && (
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Feedback Thread
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {comments.map((c: ApprovalComment) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '10px 12px',
                      background: c.author_role === 'ztc_team'
                        ? 'var(--gold-glow)'
                        : 'var(--elevated)',
                      borderRadius: '7px',
                      borderLeft: `3px solid ${c.author_role === 'ztc_team' ? 'var(--gold)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        color: c.author_role === 'ztc_team' ? 'var(--gold)' : 'var(--text-secondary)',
                        fontWeight: 600,
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {c.author}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
                      {c.comment}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {new Date(c.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
