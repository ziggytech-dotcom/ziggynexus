'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'nexusiq_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY)
      if (!dismissed) setVisible(true)
    } catch {
      // localStorage unavailable (SSR, private mode) — don't show
    }
  }, [])

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'calc(100% - 48px)',
        maxWidth: '640px',
        background: '#0D0D0D',
        border: '1px solid rgba(201, 169, 110, 0.20)',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        flexWrap: 'wrap',
      }}
    >
      <p
        style={{
          fontSize: '13px',
          color: 'rgba(245, 240, 232, 0.65)',
          lineHeight: 1.5,
          margin: 0,
          flex: '1 1 260px',
        }}
      >
        We use cookies to keep you signed in and improve our services.{' '}
        <Link
          href="/cookies"
          style={{ color: '#10b981', textDecoration: 'underline' }}
        >
          Cookie Policy
        </Link>
      </p>

      <button
        onClick={dismiss}
        style={{
          padding: '8px 20px',
          background: 'linear-gradient(135deg, #10b981, #34d399)',
          border: 'none',
          borderRadius: '6px',
          color: '#050505',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Got it
      </button>
    </div>
  )
}
