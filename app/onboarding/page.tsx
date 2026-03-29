'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface OnboardingData {
  company: string
  phone: string
  website: string
  industry: string
  goals: string
  brandColors: string
  competitors: string
  socialHandles: string
  notes: string
}

const STEPS = [
  { id: 'welcome', title: 'Welcome', description: 'Let\'s get your portal set up.' },
  { id: 'business', title: 'Your Business', description: 'Tell us about your company.' },
  { id: 'goals', title: 'Goals & Vision', description: 'What do you want to achieve?' },
  { id: 'brand', title: 'Brand Details', description: 'Share what makes you unique.' },
  { id: 'done', title: 'All Set', description: 'Your portal is ready.' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<OnboardingData>({
    company: '',
    phone: '',
    website: '',
    industry: '',
    goals: '',
    brandColors: '',
    competitors: '',
    socialHandles: '',
    notes: '',
  })

  function update(field: keyof OnboardingData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleComplete() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Session expired. Please sign in again.')
      setLoading(false)
      return
    }

    const notes = [
      data.goals && `Goals: ${data.goals}`,
      data.brandColors && `Brand colors: ${data.brandColors}`,
      data.competitors && `Competitors: ${data.competitors}`,
      data.socialHandles && `Social: ${data.socialHandles}`,
      data.notes && `Notes: ${data.notes}`,
    ].filter(Boolean).join('\n')

    const { error: updateError } = await supabase
      .from('clients')
      .update({
        company: data.company || undefined,
        phone: data.phone || undefined,
        onboarding_completed: true,
        notes: notes || undefined,
      })
      .eq('email', user.email)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setStep(4) // go to "done" step
    setLoading(false)
  }

  const currentStep = STEPS[step]
  const progressPct = Math.round((step / (STEPS.length - 1)) * 100)

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="fade-in" style={{ width: '100%', maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: '#10b981',
              marginBottom: '10px',
              fontWeight: 500,
              textTransform: 'uppercase',
            }}
          >
            Portal Setup
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '32px',
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: '6px',
            }}
          >
            {currentStep.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            {currentStep.description}
          </p>
        </div>

        {/* Progress bar */}
        {step < 4 && (
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Step {step + 1} of {STEPS.length - 1}
              </span>
              <span style={{ fontSize: '12px', color: '#10b981' }}>{progressPct}%</span>
            </div>
            <div
              style={{
                height: '3px',
                background: 'var(--elevated)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #10b981, var(--gold-light))',
                  borderRadius: '2px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Card */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '36px 40px',
          }}
        >
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>👋</div>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  marginBottom: '28px',
                  textAlign: 'center',
                }}
              >
                This is your private portal — your central hub for reviewing work, tracking your
                project, and collaborating with our team. It&apos;ll only take 2 minutes to set up.
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 32px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {[
                  ['✓', 'Review and approve all deliverables'],
                  ['◫', 'Access your asset library'],
                  ['📁', 'Upload briefs and references'],
                  ['📄', 'View and pay invoices'],
                ].map(([icon, text]) => (
                  <li
                    key={text}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      color: 'var(--text)',
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        background: 'var(--gold-glow)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setStep(1)}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #10b981, var(--gold-light))',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#050505',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                }}
              >
                Get Started →
              </button>
            </div>
          )}

          {/* Step 1: Business info */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Field
                label="Company name"
                value={data.company}
                onChange={(v) => update('company', v)}
                placeholder="Acme Corp"
              />
              <Field
                label="Phone number"
                value={data.phone}
                onChange={(v) => update('phone', v)}
                placeholder="+1 (555) 000-0000"
                type="tel"
              />
              <Field
                label="Website"
                value={data.website}
                onChange={(v) => update('website', v)}
                placeholder="https://yourwebsite.com"
                type="url"
              />
              <Field
                label="Industry / niche"
                value={data.industry}
                onChange={(v) => update('industry', v)}
                placeholder="e.g. Real estate, E-commerce, SaaS..."
              />
              <StepButtons
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
              />
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TextAreaField
                label="What are your main goals for this project?"
                value={data.goals}
                onChange={(v) => update('goals', v)}
                placeholder="e.g. Build brand awareness, launch a new product, grow social following, generate leads..."
                rows={4}
              />
              <Field
                label="Who are your main competitors? (optional)"
                value={data.competitors}
                onChange={(v) => update('competitors', v)}
                placeholder="e.g. Brand A, Brand B"
              />
              <StepButtons
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            </div>
          )}

          {/* Step 3: Brand */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Field
                label="Brand colors (hex or names)"
                value={data.brandColors}
                onChange={(v) => update('brandColors', v)}
                placeholder="e.g. #1A2B3C, Navy blue, Gold"
              />
              <Field
                label="Social media handles"
                value={data.socialHandles}
                onChange={(v) => update('socialHandles', v)}
                placeholder="@handle on Instagram, @handle on TikTok..."
              />
              <TextAreaField
                label="Anything else we should know? (optional)"
                value={data.notes}
                onChange={(v) => update('notes', v)}
                placeholder="Tone of voice, things to avoid, special requirements..."
                rows={3}
              />
              {error && (
                <p style={{ color: 'var(--status-rejected)', fontSize: '13px' }}>{error}</p>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setStep(2)}
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
                  ← Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: loading ? 'var(--gold-dim)' : 'linear-gradient(135deg, #10b981, var(--gold-light))',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#050505',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Saving...' : 'Complete Setup →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '56px', marginBottom: '20px' }}>🎉</div>
              <h2
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '26px',
                  fontWeight: 400,
                  color: 'var(--text)',
                  marginBottom: '12px',
                }}
              >
                You&apos;re all set!
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                }}
              >
                Your portal is ready. The team has been notified with your details.
                Head to your dashboard to see what&apos;s waiting for you.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #10b981, var(--gold-light))',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#050505',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                }}
              >
                Go to Dashboard →
              </button>
            </div>
          )}
        </div>

        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '12px',
            marginTop: '24px',
          }}
        >
          🔒 Your information is private and only shared with your account team.
        </p>
      </div>
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginBottom: '8px',
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '11px 14px',
          background: 'var(--elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          color: 'var(--text)',
          fontSize: '14px',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--gold-dim)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
      />
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginBottom: '8px',
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          padding: '11px 14px',
          background: 'var(--elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          color: 'var(--text)',
          fontSize: '14px',
          outline: 'none',
          resize: 'vertical',
          lineHeight: 1.5,
          boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--gold-dim)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
      />
    </div>
  )
}

function StepButtons({
  onBack,
  onNext,
}: {
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={onBack}
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
        ← Back
      </button>
      <button
        onClick={onNext}
        style={{
          flex: 1,
          padding: '12px',
          background: 'linear-gradient(135deg, #10b981, var(--gold-light))',
          border: 'none',
          borderRadius: '8px',
          color: '#050505',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Continue →
      </button>
    </div>
  )
}
