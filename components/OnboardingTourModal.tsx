'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const TOUR_STEPS = [
  {
    icon: '⬡',
    title: 'Your Dashboard',
    body: 'This is your home base. See what needs your attention, track project progress, and get a bird\'s-eye view of everything happening on your project.',
  },
  {
    icon: '✓',
    title: 'Approvals',
    body: 'When our team completes a deliverable, it lands here. Review the work, leave feedback, or approve it &mdash; all in one place. No more email chains.',
  },
  {
    icon: '◈',
    title: 'Track Progress',
    body: 'Watch your project move through each phase &mdash; Discovery, Brand Identity, Website, Content, and Launch. You\'ll always know exactly where things stand.',
  },
]

interface OnboardingTourModalProps {
  clientEmail: string
}

export default function OnboardingTourModal({ clientEmail }: OnboardingTourModalProps) {
  const [step, setStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [dismissing, setDismissing] = useState(false)

  async function handleDismiss() {
    setDismissing(true)
    const supabase = createClient()
    await supabase
      .from('clients')
      .update({ tour_completed: true })
      .eq('email', clientEmail)
    setDismissed(true)
  }

  if (dismissed) return null

  const current = TOUR_STEPS[step]
  const isLast = step === TOUR_STEPS.length - 1

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="fade-in"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Step dots */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', justifyContent: 'center' }}>
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === step ? '#10b981' : 'var(--border-subtle)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'var(--gold-glow)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            margin: '0 auto 20px',
          }}
        >
          {current.icon}
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '24px',
            fontWeight: 400,
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          {current.title}
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '15px',
            lineHeight: 1.7,
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          {current.body}
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDismiss}
            disabled={dismissing}
            style={{
              flex: 1,
              padding: '11px',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              fontSize: '13px',
              cursor: dismissing ? 'wait' : 'pointer',
            }}
          >
            Skip tour
          </button>
          <button
            onClick={() => {
              if (isLast) {
                handleDismiss()
              } else {
                setStep((s) => s + 1)
              }
            }}
            disabled={dismissing}
            style={{
              flex: 2,
              padding: '11px',
              background: 'linear-gradient(135deg, #10b981, var(--gold-light))',
              border: 'none',
              borderRadius: '8px',
              color: '#050505',
              fontSize: '14px',
              fontWeight: 600,
              cursor: dismissing ? 'wait' : 'pointer',
            }}
          >
            {isLast ? "Let's go →" : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
