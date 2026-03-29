'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

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
      {/* Subtle gold glow background */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="fade-in"
        style={{
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: '#10b981',
              marginBottom: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
            }}
          >
            ZiggyNexus
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '42px',
              fontWeight: 400,
              color: 'var(--text)',
              lineHeight: 1.1,
              marginBottom: '8px',
            }}
          >
            ZiggyNexus<span style={{ color: '#10b981' }}>™</span>
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '15px',
              lineHeight: 1.5,
            }}
          >
            Your private client portal
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '40px',
          }}
        >
          {!sent ? (
            <>
              <h2
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '22px',
                  fontWeight: 400,
                  marginBottom: '8px',
                  color: 'var(--text)',
                }}
              >
                Sign in
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  marginBottom: '32px',
                  lineHeight: 1.5,
                }}
              >
                We&apos;ll send a secure magic link to your email. No password needed.
              </p>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="email"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-secondary)',
                      marginBottom: '8px',
                      fontWeight: 500,
                    }}
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = 'var(--gold-dim)')
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = 'var(--border-subtle)')
                    }
                  />
                </div>

                {error && (
                  <p
                    style={{
                      color: 'var(--status-rejected)',
                      fontSize: '13px',
                      marginBottom: '16px',
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: loading
                      ? 'var(--gold-dim)'
                      : 'linear-gradient(135deg, #10b981, #34d399)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#050505',
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    cursor: loading || !email ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
              <h2
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '22px',
                  fontWeight: 400,
                  marginBottom: '12px',
                  color: 'var(--text)',
                }}
              >
                Check your email
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                }}
              >
                We&apos;ve sent a secure sign-in link to{' '}
                <strong style={{ color: '#10b981' }}>{email}</strong>.
                <br />
                Click the link in your email to access your portal.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                }}
              >
                Use a different email
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
            lineHeight: 1.5,
          }}
        >
          🔒 Your workspace is private. Only you and the ZiggyNexus team can access it.
        </p>

        <p
          style={{
            textAlign: 'center',
            color: 'rgba(245,240,232,0.28)',
            fontSize: '11px',
            marginTop: '12px',
            lineHeight: 1.6,
          }}
        >
          By accessing this portal you agree to our{' '}
          <Link href="/privacy" style={{ color: 'rgba(16,185,129,0.55)', textDecoration: 'underline' }}>
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/terms" style={{ color: 'rgba(16,185,129,0.55)', textDecoration: 'underline' }}>
            Terms of Service
          </Link>.
        </p>
      </div>
    </main>
  )
}
