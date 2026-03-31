'use client'

import { useState } from 'react'
import type { ApprovalComment } from '@/lib/types'

interface CommentFormProps {
  deliverableId: string
  onCommentAdded: (comment: ApprovalComment) => void
}

export default function CommentForm({ deliverableId, onCommentAdded }: CommentFormProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setError('')

    const res = await fetch(`/api/deliverables/${deliverableId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim() }),
    })
    const data = await res.json()
    setSending(false)

    if (res.ok) {
      setMessage('')
      onCommentAdded(data.comment)
    } else {
      setError(data.error ?? 'Failed to send.')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add a comment or question…"
        rows={3}
        style={{
          width: '100%',
          padding: '11px 14px',
          background: 'var(--elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          color: 'var(--text)',
          fontSize: '13px',
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.5,
          boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--gold-dim)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
      />
      {error && (
        <p style={{ fontSize: '12px', color: 'var(--status-rejected)', margin: '6px 0 0' }}>{error}</p>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button
          type="submit"
          disabled={sending || !message.trim()}
          style={{
            padding: '9px 20px',
            background: sending || !message.trim() ? 'var(--gold-dim)' : '#10b981',
            border: 'none',
            borderRadius: '8px',
            color: '#050505',
            fontSize: '13px',
            fontWeight: 600,
            cursor: sending || !message.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {sending ? 'Sending…' : 'Send'}
        </button>
      </div>
    </form>
  )
}
