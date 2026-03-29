'use client'

import { useState } from 'react'

export default function BillingPortalButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleOpen() {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()

    if (data.url) {
      window.open(data.url, '_blank')
    } else {
      setError(data.error ?? 'Unable to open billing portal')
    }
    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={handleOpen}
        disabled={loading}
        style={{
          padding: '11px 22px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: '#10b981',
          fontSize: '13px',
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        {loading ? 'Opening...' : '↗ Manage Billing'}
      </button>
      {error && (
        <p style={{ fontSize: '12px', color: 'var(--status-rejected)', marginTop: '6px' }}>{error}</p>
      )}
    </div>
  )
}
