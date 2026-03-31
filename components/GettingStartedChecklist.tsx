'use client'

import { useState } from 'react'

interface ChecklistItem {
  id: string
  label: string
  done: boolean
  href?: string
}

interface GettingStartedChecklistProps {
  loggedIn: boolean
  profileComplete: boolean
  hasDeliverables: boolean
}

export default function GettingStartedChecklist({
  loggedIn,
  profileComplete,
  hasDeliverables,
}: GettingStartedChecklistProps) {
  const items: ChecklistItem[] = [
    { id: 'login', label: 'Log in to your portal', done: loggedIn },
    { id: 'profile', label: 'Complete your profile', done: profileComplete, href: '/settings' },
    { id: 'deliverable', label: 'Review your first deliverable', done: hasDeliverables, href: '/approvals' },
  ]

  const allDone = items.every((i) => i.done)
  const completedCount = items.filter((i) => i.done).length

  const [dismissed, setDismissed] = useState(allDone)

  if (dismissed) return null

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '28px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
            Getting Started
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {completedCount} of {items.length} complete
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: 1,
            padding: '2px',
          }}
          aria-label="Dismiss checklist"
        >
          ×
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: '3px',
          background: 'var(--elevated)',
          borderRadius: '2px',
          marginBottom: '16px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(completedCount / items.length) * 100}%`,
            background: 'linear-gradient(90deg, #10b981, var(--gold-light))',
            borderRadius: '2px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => {
          const content = (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '7px',
                background: item.done ? 'var(--gold-glow)' : 'var(--elevated)',
                opacity: item.done ? 0.7 : 1,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: `2px solid ${item.done ? '#4ADE80' : 'var(--border-subtle)'}`,
                  background: item.done ? '#4ADE80' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '10px',
                  color: '#050505',
                  fontWeight: 700,
                }}
              >
                {item.done && '✓'}
              </div>
              <span
                style={{
                  fontSize: '13px',
                  color: item.done ? 'var(--text-muted)' : 'var(--text)',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}
              >
                {item.label}
              </span>
              {!item.done && item.href && (
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#10b981' }}>→</span>
              )}
            </div>
          )

          if (!item.done && item.href) {
            return (
              <a key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
                {content}
              </a>
            )
          }
          return <div key={item.id}>{content}</div>
        })}
      </div>
    </div>
  )
}
