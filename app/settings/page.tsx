'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface BrandingState {
  brand_name: string
  brand_primary_color: string
  hide_powered_by: boolean
  brand_logo_url: string | null
}

const STARTER_PLAN = 'starter'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [clientPlan, setClientPlan] = useState<string | null>(null)
  const [branding, setBranding] = useState<BrandingState>({
    brand_name: '',
    brand_primary_color: '#10b981',
    hide_powered_by: false,
    brand_logo_url: null,
  })
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user?.email) { setLoading(false); return }
      const { data: client } = await supabase
        .from('clients')
        .select('brand_name, brand_primary_color, hide_powered_by, brand_logo_url, package')
        .eq('email', user.email)
        .single()
      if (client) {
        setBranding({
          brand_name: client.brand_name ?? '',
          brand_primary_color: client.brand_primary_color ?? '#10b981',
          hide_powered_by: client.hide_powered_by ?? false,
          brand_logo_url: client.brand_logo_url ?? null,
        })
        setClientPlan(client.package ?? null)
      }
      setLoading(false)
    })
  }, [])

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be under 2MB.')
      return
    }

    setUploading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setUploading(false); return }

    const ext = file.name.split('.').pop()
    const path = `logos/${user.id}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('nexus-logos')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadErr) {
      setError(uploadErr.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('nexus-logos').getPublicUrl(path)
    // Bust cache with timestamp
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`
    setBranding((prev) => ({ ...prev, brand_logo_url: publicUrl }))
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branding),
    })
    const data = await res.json()
    setSaving(false)

    if (res.ok) {
      setSuccess('Settings saved.')
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(data.error ?? 'Failed to save.')
    }
  }

  async function removeLogo() {
    setBranding((prev) => ({ ...prev, brand_logo_url: null }))
  }

  const isPremium = clientPlan && clientPlan !== STARTER_PLAN

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>
        Loading settings…
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '40px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '32px',
            fontWeight: 400,
            color: 'var(--text)',
            marginBottom: '8px',
          }}
        >
          Portal Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Customize how your portal looks and feels.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Logo Upload */}
        <Section title="Logo" description="Appears in the portal header. PNG or SVG recommended.">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {branding.brand_logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={branding.brand_logo_url}
                alt="Logo preview"
                style={{
                  height: '48px',
                  maxWidth: '160px',
                  objectFit: 'contain',
                  background: 'var(--elevated)',
                  borderRadius: '8px',
                  padding: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            ) : (
              <div
                style={{
                  height: '48px',
                  width: '120px',
                  background: 'var(--elevated)',
                  borderRadius: '8px',
                  border: '1px dashed var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                }}
              >
                No logo
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{
                  padding: '8px 16px',
                  background: 'var(--elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  cursor: uploading ? 'wait' : 'pointer',
                }}
              >
                {uploading ? 'Uploading…' : branding.brand_logo_url ? 'Replace' : 'Upload logo'}
              </button>
              {branding.brand_logo_url && (
                <button
                  type="button"
                  onClick={removeLogo}
                  style={{
                    padding: '8px 12px',
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--status-rejected)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/svg+xml,image/jpeg,image/webp"
              onChange={handleLogoUpload}
              style={{ display: 'none' }}
            />
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Max 2MB. PNG, SVG, JPG, or WebP.
          </p>
        </Section>

        {/* Company Name */}
        <Section title="Agency / Company Name" description="Replaces 'ZiggyNexus' throughout your portal.">
          <input
            type="text"
            value={branding.brand_name}
            onChange={(e) => setBranding((prev) => ({ ...prev, brand_name: e.target.value }))}
            placeholder="Your Agency Name"
            maxLength={80}
            style={inputStyle}
          />
        </Section>

        {/* Brand Color */}
        <Section title="Brand Color" description="Used for accents, active states, and highlights.">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="color"
                value={branding.brand_primary_color}
                onChange={(e) => setBranding((prev) => ({ ...prev, brand_primary_color: e.target.value }))}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  padding: '2px',
                  background: 'var(--elevated)',
                }}
              />
            </div>
            <input
              type="text"
              value={branding.brand_primary_color}
              onChange={(e) => {
                const v = e.target.value
                if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                  setBranding((prev) => ({ ...prev, brand_primary_color: v }))
                }
              }}
              placeholder="#10b981"
              maxLength={7}
              style={{ ...inputStyle, width: '120px', fontFamily: 'monospace' }}
            />
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: branding.brand_primary_color,
                border: '1px solid var(--border-subtle)',
                flexShrink: 0,
              }}
            />
          </div>
        </Section>

        {/* Powered by ZiggyNexus */}
        <Section title="'Powered by ZiggyNexus'" description="Show or hide the footer branding on your portal.">
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: isPremium ? 'pointer' : 'default',
              opacity: isPremium ? 1 : 0.5,
            }}
          >
            <div
              onClick={() => isPremium && setBranding((prev) => ({ ...prev, hide_powered_by: !prev.hide_powered_by }))}
              style={{
                width: '40px',
                height: '22px',
                borderRadius: '11px',
                background: branding.hide_powered_by ? '#10b981' : 'var(--elevated)',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
                transition: 'background 0.2s',
                cursor: isPremium ? 'pointer' : 'not-allowed',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: branding.hide_powered_by ? '20px' : '2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text)' }}>
                Hide &ldquo;Powered by ZiggyNexus&rdquo;
              </div>
              {!isPremium && (
                <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>
                  Growth plan or above — upgrade to unlock
                </div>
              )}
            </div>
          </label>
        </Section>

        {error && (
          <div style={{ fontSize: '13px', color: 'var(--status-rejected)', padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ fontSize: '13px', color: '#4ADE80', padding: '10px 14px', background: 'rgba(74,222,128,0.08)', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.2)' }}>
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            alignSelf: 'flex-start',
            padding: '11px 28px',
            background: saving ? 'var(--gold-dim)' : 'linear-gradient(135deg, #10b981, var(--gold-light))',
            border: 'none',
            borderRadius: '8px',
            color: '#050505',
            fontSize: '14px',
            fontWeight: 600,
            cursor: saving ? 'wait' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--elevated)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  color: 'var(--text)',
  fontSize: '14px',
  outline: 'none',
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '20px 24px',
      }}
    >
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{description}</div>
      </div>
      {children}
    </div>
  )
}
