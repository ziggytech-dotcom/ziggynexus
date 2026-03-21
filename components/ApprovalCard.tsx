'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Deliverable } from '@/lib/types'
import { TYPE_LABELS } from '@/lib/types'

interface ApprovalCardProps {
  deliverable: Deliverable
  onStatusChange?: (id: string, status: string) => void
}

export default function ApprovalCard({ deliverable, onStatusChange }: ApprovalCardProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [showChangesModal, setShowChangesModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [changesNote, setChangesNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [localStatus, setLocalStatus] = useState(deliverable.status)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  async function handleApprove() {
    setLoading('approve')
    setError(null)
    const now = new Date().toISOString()

    const { error } = await supabase
      .from('deliverables')
      .update({
        status: 'approved',
        reviewed_at: now,
        reviewed_by: 'client',
      })
      .eq('id', deliverable.id)

    if (error) {
      setError(error.message)
    } else {
      setLocalStatus('approved')
      onStatusChange?.(deliverable.id, 'approved')
    }
    setLoading(null)
  }

  async function handleRequestChanges() {
    if (!changesNote.trim()) return
    setLoading('changes')
    setError(null)

    const { error: statusError } = await supabase
      .from('deliverables')
      .update({
        status: 'changes_requested',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'client',
      })
      .eq('id', deliverable.id)

    if (!statusError) {
      await supabase.from('approval_comments').insert({
        deliverable_id: deliverable.id,
        author: 'Client',
        author_role: 'client',
        comment: changesNote,
      })
    }

    if (statusError) {
      setError(statusError.message)
    } else {
      setLocalStatus('changes_requested')
      setShowChangesModal(false)
      setChangesNote('')
      onStatusChange?.(deliverable.id, 'changes_requested')
    }
    setLoading(null)
  }

  async function handleReject() {
    if (!rejectReason.trim()) return
    setLoading('reject')
    setError(null)

    const { error: statusError } = await supabase
      .from('deliverables')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'client',
        notes: rejectReason,
      })
      .eq('id', deliverable.id)

    if (!statusError) {
      await supabase.from('approval_comments').insert({
        deliverable_id: deliverable.id,
        author: 'Client',
        author_role: 'client',
        comment: `REJECTED: ${rejectReason}`,
      })
    }

    if (statusError) {
      setError(statusError.message)
    } else {
      setLocalStatus('rejected')
      setShowRejectModal(false)
      setRejectReason('')
      onStatusChange?.(deliverable.id, 'rejected')
    }
    setLoading(null)
  }

  const isReviewed = localStatus !== 'pending_review'
  const statusConfig = {
    approved: { label: 'Approved', color: 'var(--status-approved)', bg: 'rgba(74,222,128,0.08)' },
    changes_requested: { label: 'Changes Requested', color: 'var(--status-changes)', bg: 'rgba(251,146,60,0.08)' },
    rejected: { label: 'Rejected', color: 'var(--status-rejected)', bg: 'rgba(248,113,113,0.08)' },
    pending_review: { label: 'Pending Review', color: 'var(--status-pending)', bg: 'rgba(201,169,110,0.08)' },
  }
  const sc = statusConfig[localStatus] ?? statusConfig.pending_review

  return (
    <>
      <div
        style={{
          background: 'var(--surface)',
          border: `1px solid ${isReviewed ? 'var(--border-subtle)' : 'var(--border)'}`,
          borderRadius: '12px',
          overflow: 'hidden',
          opacity: isReviewed ? 0.75 : 1,
          transition: 'opacity 0.3s',
        }}
      >
        {/* Preview area */}
        <div
          style={{
            background: 'var(--elevated)',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {deliverable.preview_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={deliverable.preview_url}
              alt={deliverable.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {deliverable.type === 'brand_asset' ? '🎨' :
                 deliverable.type === 'website' ? '🌐' :
                 deliverable.type === 'social' ? '📱' :
                 deliverable.type === 'report' ? '📊' :
                 deliverable.type === 'video' ? '🎬' : '📄'}
              </div>
              <div style={{ fontSize: '13px' }}>Preview not available</div>
            </div>
          )}

          {/* Version badge */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              fontSize: '11px',
              padding: '3px 8px',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '4px',
              color: 'var(--text-secondary)',
            }}
          >
            v{deliverable.version}
          </div>

          {/* Status badge */}
          {isReviewed && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '4px',
                color: sc.color,
                background: sc.bg,
                border: `1px solid ${sc.color}40`,
              }}
            >
              {sc.label}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '4px',
                fontWeight: 500,
              }}
            >
              {TYPE_LABELS[deliverable.type] ?? deliverable.type}
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '18px',
                fontWeight: 400,
                color: 'var(--text)',
                lineHeight: 1.3,
              }}
            >
              {deliverable.title}
            </h3>
            {deliverable.description && (
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginTop: '6px',
                  lineHeight: 1.5,
                }}
              >
                {deliverable.description}
              </p>
            )}
          </div>

          {/* File link */}
          {deliverable.file_url && (
            <a
              href={deliverable.file_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--gold)',
                textDecoration: 'none',
                marginBottom: '16px',
                padding: '6px 12px',
                background: 'var(--gold-glow)',
                borderRadius: '6px',
                border: '1px solid var(--border)',
              }}
            >
              ↗ Open full file
            </a>
          )}

          {error && (
            <p style={{ color: 'var(--status-rejected)', fontSize: '13px', marginBottom: '12px' }}>
              {error}
            </p>
          )}

          {/* Action buttons */}
          {!isReviewed && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleApprove}
                disabled={!!loading}
                style={{
                  flex: 1,
                  minWidth: '80px',
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
                  border: 'none',
                  borderRadius: '7px',
                  color: '#050505',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading === 'approve' ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {loading === 'approve' ? '...' : '✓ Approve'}
              </button>

              <button
                onClick={() => setShowChangesModal(true)}
                disabled={!!loading}
                style={{
                  flex: 1,
                  minWidth: '80px',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: '1px solid var(--status-changes)',
                  borderRadius: '7px',
                  color: 'var(--status-changes)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                ✏ Request Changes
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                disabled={!!loading}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '7px',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                ✕ Reject
              </button>
            </div>
          )}

          {isReviewed && (
            <div
              style={{
                padding: '10px 14px',
                background: sc.bg,
                borderRadius: '7px',
                fontSize: '13px',
                color: sc.color,
                fontWeight: 500,
              }}
            >
              {sc.label} {deliverable.reviewed_at &&
                `· ${new Date(deliverable.reviewed_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}`}
            </div>
          )}
        </div>
      </div>

      {/* Request Changes Modal */}
      {showChangesModal && (
        <Modal onClose={() => setShowChangesModal(false)}>
          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '22px',
              fontWeight: 400,
              marginBottom: '8px',
              color: 'var(--text)',
            }}
          >
            Request Changes
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px', lineHeight: 1.5 }}>
            Tell us what you&apos;d like changed on <strong style={{ color: 'var(--text)' }}>{deliverable.title}</strong>.
            The more specific, the better.
          </p>
          <textarea
            value={changesNote}
            onChange={(e) => setChangesNote(e.target.value)}
            placeholder="e.g. Please make the logo larger, change the color to match our brand guide, adjust the font size..."
            rows={5}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'var(--elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '14px',
              lineHeight: 1.5,
              resize: 'vertical',
              marginBottom: '16px',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleRequestChanges}
              disabled={!changesNote.trim() || loading === 'changes'}
              style={{
                flex: 1,
                padding: '12px',
                background: loading === 'changes' ? 'var(--gold-dim)' : 'linear-gradient(135deg, #C9A96E, #E0C48A)',
                border: 'none',
                borderRadius: '8px',
                color: '#050505',
                fontSize: '14px',
                fontWeight: 600,
                cursor: !changesNote.trim() || loading === 'changes' ? 'not-allowed' : 'pointer',
              }}
            >
              {loading === 'changes' ? 'Sending...' : 'Send Feedback'}
            </button>
            <button
              onClick={() => setShowChangesModal(false)}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <Modal onClose={() => setShowRejectModal(false)}>
          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '22px',
              fontWeight: 400,
              marginBottom: '8px',
              color: 'var(--text)',
            }}
          >
            Reject This Deliverable
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px', lineHeight: 1.5 }}>
            This will mark <strong style={{ color: 'var(--text)' }}>{deliverable.title}</strong> as rejected
            and notify the ZiggyTech Creative team. Please explain why so we can make it right.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please explain why this doesn't meet your expectations..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'var(--elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '14px',
              lineHeight: 1.5,
              resize: 'vertical',
              marginBottom: '16px',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim() || loading === 'reject'}
              style={{
                flex: 1,
                padding: '12px',
                background: 'var(--status-rejected)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: !rejectReason.trim() || loading === 'reject' ? 'not-allowed' : 'pointer',
                opacity: !rejectReason.trim() ? 0.5 : 1,
              }}
            >
              {loading === 'reject' ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
            <button
              onClick={() => setShowRejectModal(false)}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '36px',
          width: '100%',
          maxWidth: '480px',
        }}
        className="fade-in"
      >
        {children}
      </div>
    </div>
  )
}
