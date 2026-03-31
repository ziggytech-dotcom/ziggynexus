'use client'

import { useState } from 'react'
import CommentForm from './CommentForm'
import type { ApprovalComment } from '@/lib/types'

interface CommentThreadProps {
  deliverableId: string
  initialComments: ApprovalComment[]
}

export default function CommentThread({ deliverableId, initialComments }: CommentThreadProps) {
  const [comments, setComments] = useState<ApprovalComment[]>(initialComments)

  function handleCommentAdded(comment: ApprovalComment) {
    setComments((prev) => [...prev, comment])
  }

  return (
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

      {comments.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          No comments yet. Start the conversation below.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                padding: '10px 12px',
                background: c.author_role === 'ztc_team' ? 'var(--gold-glow)' : 'var(--elevated)',
                borderRadius: '7px',
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
              <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
                {c.comment}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                {new Date(c.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <CommentForm deliverableId={deliverableId} onCommentAdded={handleCommentAdded} />
    </div>
  )
}
