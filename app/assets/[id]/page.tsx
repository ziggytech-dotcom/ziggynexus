import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { ApprovalComment, DeliverableVersion } from '@/lib/types'
import { TYPE_LABELS, STATUS_LABELS } from '@/lib/types'
import ActivityTracker from '@/components/ActivityTracker'

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: asset } = await supabase
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

  if (!asset) {
    return (
      <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>
        Asset not found.{' '}
        <Link href="/assets" style={{ color: '#10b981' }}>
          Back to library
        </Link>
      </div>
    )
  }

  // Track that the client viewed this asset
  // (component fires API call client-side on mount)

  const statusColors: Record<string, { color: string; bg: string }> = {
    pending_review: { color: 'var(--status-pending)', bg: 'rgba(16,185,129,0.1)' },
    approved: { color: 'var(--status-approved)', bg: 'rgba(74,222,128,0.1)' },
    changes_requested: { color: 'var(--status-changes)', bg: 'rgba(251,146,60,0.1)' },
    rejected: { color: 'var(--status-rejected)', bg: 'rgba(248,113,113,0.1)' },
  }
  const sc = statusColors[asset.status] ?? statusColors.pending_review

  return (
    <div className="fade-in">
      <ActivityTracker
        eventType="file_viewed"
        eventData={{ deliverable_id: asset.id, file_name: asset.title }}
      />
      {/* Back */}
      <Link
        href="/assets"
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
        ← Back to Asset Library
      </Link>

      <div className="grid-asset-detail">

        {/* Main */}
        <div>
          {/* Preview */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background: 'var(--elevated)',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
              }}
            >
              {asset.preview_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.preview_url}
                  alt={asset.title}
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
                  <div>Preview not available</div>
                </div>
              )}
            </div>

            {/* Meta */}
            <div style={{ padding: '24px 28px' }}>
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#10b981',
                  marginBottom: '6px',
                  fontWeight: 500,
                }}
              >
                {TYPE_LABELS[asset.type as keyof typeof TYPE_LABELS] ?? asset.type}
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '28px',
                  fontWeight: 400,
                  color: 'var(--text)',
                  marginBottom: '12px',
                }}
              >
                {asset.title}
              </h1>
              {asset.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
                  {asset.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '4px 10px',
                    borderRadius: '5px',
                    color: sc.color,
                    background: sc.bg,
                  }}
                >
                  {STATUS_LABELS[asset.status as keyof typeof STATUS_LABELS] ?? asset.status}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Version {asset.version}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Added {new Date(asset.created_at).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </span>
              </div>

              {asset.file_url && (
                <a
                  href={asset.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '16px',
                    padding: '10px 18px',
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    borderRadius: '8px',
                    color: '#050505',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  ↗ Download / Open File
                </a>
              )}
            </div>
          </div>

          {/* Comments */}
          {comments && comments.length > 0 && (
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: 'var(--text)',
                  marginBottom: '16px',
                }}
              >
                Feedback History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {comments.map((c: ApprovalComment) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '12px 14px',
                      background: c.author_role === 'ztc_team' ? 'var(--gold-glow)' : 'var(--elevated)',
                      borderRadius: '8px',
                      borderLeft: `3px solid ${c.author_role === 'ztc_team' ? '#10b981' : 'var(--border-subtle)'}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        color: c.author_role === 'ztc_team' ? '#10b981' : 'var(--text-secondary)',
                        fontWeight: 600,
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {c.author}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>
                      {c.comment}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {new Date(c.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Version History */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '20px',
            position: 'sticky',
            top: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Version History
          </h3>

          {versions && versions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {versions.map((v: DeliverableVersion) => (
                <div
                  key={v.id}
                  style={{
                    padding: '12px',
                    background: v.version === asset.version ? 'var(--gold-glow)' : 'var(--elevated)',
                    borderRadius: '7px',
                    border: `1px solid ${v.version === asset.version ? 'var(--border)' : 'transparent'}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: v.notes ? '6px' : 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: v.version === asset.version ? '#10b981' : 'var(--text)',
                      }}
                    >
                      v{v.version}
                      {v.version === asset.version && (
                        <span style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.7 }}>
                          CURRENT
                        </span>
                      )}
                    </span>
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
                        ↗ View
                      </a>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(v.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </div>
                  {v.notes && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginTop: '6px',
                        lineHeight: 1.4,
                      }}
                    >
                      {v.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              No previous versions. This is the original.
            </p>
          )}

          {asset.status === 'pending_review' && (
            <div style={{ marginTop: '16px' }}>
              <Link
                href={`/approvals/${asset.id}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '11px',
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  borderRadius: '8px',
                  color: '#050505',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Review & Approve
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
