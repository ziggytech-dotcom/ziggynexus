import { createClient } from '@/lib/supabase/server'
import ApprovalCard from '@/components/ApprovalCard'
import CommentThread from '@/components/CommentThread'
import Link from 'next/link'
import type { ApprovalComment, DeliverableVersion } from '@/lib/types'
import ActivityTracker from '@/components/ActivityTracker'

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
        <Link href="/approvals" style={{ color: '#10b981' }}>
          Back to approvals
        </Link>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <ActivityTracker
        eventType="deliverable_viewed"
        eventData={{ deliverable_id: deliverable.id, deliverable_title: deliverable.title }}
      />
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
                          <span style={{ color: '#10b981', marginLeft: '6px', fontSize: '11px' }}>
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
                          color: '#10b981',
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

          {/* Comments thread &mdash; always shown, with reply form */}
          <CommentThread
            deliverableId={id}
            initialComments={(comments ?? []) as ApprovalComment[]}
          />
        </div>
      </div>
    </div>
  )
}
