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

                {/* Social Sign In */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#2d2d2d]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span style={{ background: 'var(--surface)', padding: '0 8px', color: 'var(--text-muted)' }}>or continue with</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      const supabase = createClient()
                      await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: { redirectTo: `${window.location.origin}/auth/callback` }
                      })
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#2d2d2d] bg-[#1a1a1a] text-white text-sm hover:bg-[#2d2d2d] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const supabase = createClient()
                      await supabase.auth.signInWithOAuth({
                        provider: 'apple',
                        options: { redirectTo: `${window.location.origin}/auth/callback` }
                      })
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#2d2d2d] bg-[#1a1a1a] text-white text-sm hover:bg-[#2d2d2d] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </button>
                </div>
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
