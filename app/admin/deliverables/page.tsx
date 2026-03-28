'use client'

import { useState, useEffect } from 'react'

interface ClientOption {
  id: string
  name: string
  email: string | null
}

export default function AdminDeliverablesPage() {
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    clientId: '',
    title: '',
    description: '',
    type: 'brand_asset' as 'brand_asset' | 'website' | 'social' | 'report' | 'video',
    fileUrl: '',
    previewUrl: '',
    notes: '',
    notifyClient: true,
  })

  useEffect(() => {
    fetch('/api/admin/domains')
      .then((r) => r.json())
      .then((data) => {
        setClients(data.clients ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.clientId) { setError('Please select a client.'); return }
    if (!form.title.trim()) { setError('Title is required.'); return }

    setSubmitting(true)
    const res = await fetch('/api/admin/deliverables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSubmitting(false)

    if (res.ok) {
      setSuccess('Deliverable submitted successfully. Client has been notified.')
      setForm((prev) => ({
        ...prev,
        title: '',
        description: '',
        fileUrl: '',
        previewUrl: '',
        notes: '',
      }))
    } else {
      setError(data.error ?? 'Something went wrong.')
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '32px',
          fontWeight: 400,
          color: 'var(--text)',
          marginBottom: '8px',
        }}>
          Submit Deliverable for Approval
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
          Upload work for a client to review and approve in their portal. They will be notified by email.
        </p>
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '36px 40px',
        maxWidth: '680px',
      }}>
        {loading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading clients…</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <Field label="Client *">
                <select
                  value={form.clientId}
                  onChange={(e) => update('clientId', e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Select a client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} {c.email ? `(${c.email})` : ''}</option>
                  ))}
                </select>
              </Field>

              <Field label="Title *">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. Homepage Design v2"
                  style={inputStyle}
                />
              </Field>

              <Field label="Type *">
                <select
                  value={form.type}
                  onChange={(e) => update('type', e.target.value)}
                  style={selectStyle}
                >
                  <option value="brand_asset">Brand Asset</option>
                  <option value="website">Website</option>
                  <option value="social">Social Content</option>
                  <option value="report">Report</option>
                  <option value="video">Video</option>
                </select>
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Brief description visible to the client"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </Field>

              <Field label="File URL">
                <input
                  type="url"
                  value={form.fileUrl}
                  onChange={(e) => update('fileUrl', e.target.value)}
                  placeholder="https://…"
                  style={inputStyle}
                />
              </Field>

              <Field label="Preview / Thumbnail URL">
                <input
                  type="url"
                  value={form.previewUrl}
                  onChange={(e) => update('previewUrl', e.target.value)}
                  placeholder="https://… (image URL for preview)"
                  style={inputStyle}
                />
              </Field>

              <Field label="Internal Notes">
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Notes visible in the portal for context"
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </Field>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.notifyClient}
                  onChange={(e) => update('notifyClient', e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--gold)' }}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Email client when submitted
                </span>
              </label>

              {error && (
                <div style={{ fontSize: '13px', color: 'var(--status-rejected)' }}>{error}</div>
              )}
              {success && (
                <div style={{ fontSize: '13px', color: 'var(--status-approved)' }}>{success}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px 28px',
                  background: 'var(--gold)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#050505',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: submitting ? 'wait' : 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                {submitting ? 'Submitting…' : 'Submit for Approval →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: '7px',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 14px',
  background: 'var(--elevated)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  color: 'var(--text)',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}
