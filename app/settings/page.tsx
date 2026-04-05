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

  // 2FA state
  const [mfaFactors, setMfaFactors] = useState<any[]>([])
  const [mfaEnrolling, setMfaEnrolling] = useState(false)
  const [mfaQrCode, setMfaQrCode] = useState('')
  const [mfaSecret, setMfaSecret] = useState('')
  const [mfaFactorId, setMfaFactorId] = useState('')
  const [mfaVerifyCode, setMfaVerifyCode] = useState('')
  const [mfaLoading, setMfaLoading] = useState(false)
  const [mfaMessage, setMfaMessage] = useState('')
  const [clientPlan, setClientPlan] = useState<string | null>(null)
  const [branding, setBranding] = useState<BrandingState>({
    brand_name: '',
    brand_primary_color: '#10b981',
    hide_powered_by: false,
    brand_logo_url: null,
  })
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadMfaFactors()
  }, [])

  async function loadMfaFactors() {
    const supabase = createClient()
    const { data } = await supabase.auth.mfa.listFactors()
    setMfaFactors(data?.totp || [])
  }

  async function startMfaEnroll() {
    setMfaLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
    if (error) { setMfaMessage(error.message); setMfaLoading(false); return }
    setMfaQrCode(data.totp.qr_code)
    setMfaSecret(data.totp.secret)
    setMfaFactorId(data.id)
    setMfaEnrolling(true)
    setMfaLoading(false)
  }

  async function verifyMfaEnroll() {
    setMfaLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: mfaFactorId, code: mfaVerifyCode })
    if (error) { setMfaMessage('Invalid code. Try again.'); setMfaLoading(false); return }
    setMfaMessage('2FA enabled successfully!')
    setMfaEnrolling(false)
    setMfaVerifyCode('')
    loadMfaFactors()
    setMfaLoading(false)
  }

  async function disableMfa(fid: string) {
    setMfaLoading(true)
    const supabase = createClient()
    await supabase.auth.mfa.unenroll({ factorId: fid })
    loadMfaFactors()
    setMfaMessage('2FA disabled.')
    setMfaLoading(false)
  }

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
                  Growth plan or above &mdash; upgrade to unlock
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

      {/* Integrations */}
      <div style={{ marginTop: '48px', maxWidth: '560px' }}>
        <IntegrationSettings />
      </div>

      {/* Team Management */}
      <div style={{ marginTop: '48px', maxWidth: '560px' }}>
        <TeamSettings />
      </div>

      {/* Security / 2FA */}
      <div style={{ marginTop: '48px', maxWidth: '560px' }}>
        <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-1">Two-Factor Authentication</h2>
          <p className="text-[#b3b3b3] text-sm mb-6">Add an extra layer of security to your account using an authenticator app.</p>
          {mfaMessage && (<div className="mb-4 px-4 py-3 rounded-lg bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9] text-sm">{mfaMessage}</div>)}
          {!mfaFactors.some(f => f.status === 'verified') && !mfaEnrolling && (
            <button onClick={startMfaEnroll} disabled={mfaLoading} className="flex items-center gap-2 px-5 py-2.5 bg-[#0ea5e9] text-white rounded-lg text-sm font-medium hover:bg-[#0ea5e9]/90 disabled:opacity-50 transition-colors">
              {mfaLoading ? 'Loading...' : 'Enable Two-Factor Authentication'}
            </button>
          )}
          {mfaEnrolling && (
            <div className="space-y-4">
              <p className="text-[#b3b3b3] text-sm">Scan this QR code with Google Authenticator, Authy, or any TOTP app:</p>
              <img src={mfaQrCode} alt="QR Code" className="w-48 h-48 bg-white p-2 rounded-lg" />
              <p className="text-xs text-[#b3b3b3]">Can&apos;t scan? Enter this code manually: <span className="font-mono text-white">{mfaSecret}</span></p>
              <div>
                <label className="block text-sm text-[#b3b3b3] mb-1.5">Enter the 6-digit code from your app</label>
                <input type="text" maxLength={6} value={mfaVerifyCode} onChange={e => setMfaVerifyCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-40 px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[#2d2d2d] text-white font-mono text-center text-lg focus:outline-none focus:border-[#0ea5e9]" />
              </div>
              <div className="flex gap-3">
                <button onClick={verifyMfaEnroll} disabled={mfaLoading || mfaVerifyCode.length !== 6} className="px-5 py-2.5 bg-[#0ea5e9] text-white rounded-lg text-sm font-medium hover:bg-[#0ea5e9]/90 disabled:opacity-50 transition-colors">
                  {mfaLoading ? 'Verifying...' : 'Verify and Enable'}
                </button>
                <button onClick={() => { setMfaEnrolling(false); setMfaQrCode(''); setMfaVerifyCode('') }} className="px-5 py-2.5 border border-[#2d2d2d] text-[#b3b3b3] rounded-lg text-sm hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          )}
          {mfaFactors.some(f => f.status === 'verified') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                <span className="text-[#22c55e] text-sm font-medium">Two-factor authentication is enabled</span>
              </div>
              {mfaFactors.filter(f => f.status === 'verified').map(f => (
                <button key={f.id} onClick={() => disableMfa(f.id)} disabled={mfaLoading} className="px-5 py-2.5 border border-[#e11d48]/30 text-[#e11d48] rounded-lg text-sm hover:bg-[#e11d48]/10 disabled:opacity-50 transition-colors">
                  {mfaLoading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zapier Integration */}
      <div style={{ marginTop: '48px', maxWidth: '560px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '22px',
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: '6px',
            }}
          >
            Zapier Integration
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Connect your portal to 6,000+ apps via Zapier.{' '}
            <a
              href="https://zapier.com/developer"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#10b981', textDecoration: 'none' }}
            >
              Open Zapier →
            </a>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Section title="Triggers" description="Events your portal sends to Zapier when they happen.">
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { event: 'client.added', label: 'Client Added', desc: 'Fires when a new client completes onboarding.' },
                { event: 'deliverable.approved', label: 'Deliverable Approved', desc: 'Fires when a client approves a deliverable.' },
                { event: 'deliverable.rejected', label: 'Deliverable Rejected', desc: 'Fires when a client rejects a deliverable.' },
                { event: 'invoice.viewed', label: 'Invoice Viewed', desc: 'Fires when a client views a file or invoice.' },
                { event: 'message.received', label: 'Message Received', desc: 'Fires when a client sends a message.' },
              ].map(({ event, label, desc }) => (
                <li
                  key={event}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    background: 'var(--elevated)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      flexShrink: 0,
                      marginTop: '5px',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '2px' }}>
                      {event}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Actions" description="Things Zapier can do in your portal on your behalf.">
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Create Client', endpoint: 'POST /api/zapier/actions/create-client', desc: 'Create a new client record from any Zapier trigger.' },
                { label: 'Add Deliverable', endpoint: 'POST /api/zapier/actions/add-deliverable', desc: 'Add a deliverable to an existing client.' },
              ].map(({ label, endpoint, desc }) => (
                <li
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    background: 'var(--elevated)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--gold-light, #C9A96E)',
                      flexShrink: 0,
                      marginTop: '5px',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '2px' }}>
                      {endpoint}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Authentication" description="Use your API key to authenticate Zapier action requests.">
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Set the <code style={{ fontSize: '12px', padding: '2px 6px', background: 'var(--elevated)', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text)' }}>ZAPIER_API_KEY</code> environment variable on your server,
              then pass it as the <code style={{ fontSize: '12px', padding: '2px 6px', background: 'var(--elevated)', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text)' }}>X-API-Key</code> header on all action requests.
              Subscribe/unsubscribe endpoints use your admin session cookie.
            </p>
          </Section>
        </div>
      </div>
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

function IntegrationSettings() {
  const supabase = createClient()
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})

  useEffect(() => { loadIntegrations() }, [])

  async function loadIntegrations() {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/integrations', {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })
    const data = await res.json()
    setFields({
      resend_api_key: data.integrations?.resend_api_key || '',
      resend_from_name: data.integrations?.resend_from_name || '',
      resend_from_email: data.integrations?.resend_from_email || '',
      zapier_webhook_url: data.integrations?.zapier_webhook_url || '',
    })
  }

  async function saveIntegration(keys: string[]) {
    setSaving(keys[0])
    setMessage('')
    const { data: { session } } = await supabase.auth.getSession()
    const payload = Object.fromEntries(keys.map(k => [k, fields[k]]))
    const res = await fetch('/api/integrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (data.error) setMessage(data.error)
    else { setMessage('Saved!'); loadIntegrations() }
    setSaving(null)
  }

  const cardClass = "bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl p-6 mb-4"
  const inputClass = "w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[#2d2d2d] text-white placeholder-[#b3b3b3]/50 focus:outline-none focus:border-[#0ea5e9] text-sm font-mono"
  const labelClass = "block text-sm text-[#b3b3b3] mb-1.5"
  const saveBtn = (keys: string[]) => (
    <button onClick={() => saveIntegration(keys)} disabled={saving === keys[0]}
      className="mt-3 px-4 py-2 bg-[#0ea5e9] text-white rounded-lg text-sm font-medium hover:bg-[#0ea5e9]/90 disabled:opacity-50 transition-colors">
      {saving === keys[0] ? 'Saving...' : 'Save'}
    </button>
  )

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">Integrations</h2>
      {message && <div className="mb-4 px-4 py-3 rounded-lg bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9] text-sm">{message}</div>}

      <div className={cardClass}>
        <h3 className="text-base font-semibold text-white mb-1">Email (Resend)</h3>
        <p className="text-[#b3b3b3] text-xs mb-4">Get your API key at resend.com → API Keys</p>
        <div className="space-y-3">
          <div><label className={labelClass}>API Key</label>
            <input type="password" value={fields.resend_api_key || ''} onChange={e => setFields({...fields, resend_api_key: e.target.value})} placeholder="re_..." className={inputClass} /></div>
          <div><label className={labelClass}>From Name</label>
            <input value={fields.resend_from_name || ''} onChange={e => setFields({...fields, resend_from_name: e.target.value})} placeholder="Your Business Name" className={inputClass} /></div>
          <div><label className={labelClass}>From Email</label>
            <input type="email" value={fields.resend_from_email || ''} onChange={e => setFields({...fields, resend_from_email: e.target.value})} placeholder="hello@yourdomain.com" className={inputClass} /></div>
        </div>
        {saveBtn(['resend_api_key', 'resend_from_name', 'resend_from_email'])}
      </div>

      <div className={cardClass}>
        <h3 className="text-base font-semibold text-white mb-1">Webhook / Zapier</h3>
        <p className="text-[#b3b3b3] text-xs mb-4">Connect any tool via webhook. Paste your Zapier webhook URL below.</p>
        <div><label className={labelClass}>Webhook URL</label>
          <input value={fields.zapier_webhook_url || ''} onChange={e => setFields({...fields, zapier_webhook_url: e.target.value})} placeholder="https://hooks.zapier.com/..." className={inputClass} /></div>
        {saveBtn(['zapier_webhook_url'])}
      </div>
    </div>
  )
}

function TeamSettings() {
  const supabase = createClient()
  const [members, setMembers] = useState<any[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [loading, setLoading] = useState(false)
  const [teamMessage, setTeamMessage] = useState('')

  useEffect(() => { loadMembers() }, [])

  async function loadMembers() {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/team/members', { headers: { Authorization: `Bearer ${session?.access_token}` } })
    const data = await res.json()
    setMembers(data.members || [])
  }

  async function inviteMember() {
    if (!inviteEmail) return
    setLoading(true); setTeamMessage('')
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/team/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole })
    })
    const data = await res.json()
    if (data.error) setTeamMessage(data.error)
    else { setTeamMessage('Invitation sent!'); setInviteEmail(''); loadMembers() }
    setLoading(false)
  }

  async function removeMember(id: string) {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`/api/team/members/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${session?.access_token}` } })
    loadMembers()
  }

  const activeMembers = members.filter(m => m.status === 'active')
  const pendingMembers = members.filter(m => m.status === 'pending')

  return (
    <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Team Members</h2>
          <p className="text-[#b3b3b3] text-sm mt-0.5">{activeMembers.length} of 5 seats used</p>
        </div>
      </div>
      {teamMessage && <div className="mb-4 px-4 py-3 rounded-lg bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9] text-sm">{teamMessage}</div>}
      <div className="mb-6 p-4 bg-[#0a0a0a] rounded-xl border border-[#2d2d2d]">
        <p className="text-sm font-medium text-white mb-3">Invite a team member</p>
        <div className="flex gap-2">
          <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@company.com" className="flex-1 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] text-white placeholder-[#b3b3b3]/50 focus:outline-none focus:border-[#0ea5e9] text-sm" />
          <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] text-white text-sm focus:outline-none focus:border-[#0ea5e9]">
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <button onClick={inviteMember} disabled={loading || !inviteEmail} className="px-4 py-2 bg-[#0ea5e9] text-white rounded-lg text-sm font-medium hover:bg-[#0ea5e9]/90 disabled:opacity-50 transition-colors whitespace-nowrap">Send Invite</button>
        </div>
      </div>
      {activeMembers.length > 0 && (
        <div className="space-y-2 mb-4">
          {activeMembers.map(m => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] rounded-xl border border-[#2d2d2d]">
              <div>
                <p className="text-sm font-medium text-white">{m.email}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] capitalize">{m.role}</span>
              </div>
              <button onClick={() => removeMember(m.id)} className="text-xs text-[#b3b3b3] hover:text-[#e11d48] transition-colors">Remove</button>
            </div>
          ))}
        </div>
      )}
      {pendingMembers.length > 0 && (
        <div>
          <p className="text-xs text-[#b3b3b3] uppercase tracking-wider mb-2">Pending Invitations</p>
          <div className="space-y-2">
            {pendingMembers.map(m => (
              <div key={m.id} className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] rounded-xl border border-[#2d2d2d] opacity-60">
                <div>
                  <p className="text-sm text-white">{m.email}</p>
                  <span className="text-xs text-[#b3b3b3]">Invitation pending</span>
                </div>
                <button onClick={() => removeMember(m.id)} className="text-xs text-[#b3b3b3] hover:text-[#e11d48] transition-colors">Cancel</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {members.length === 0 && <p className="text-sm text-[#b3b3b3] text-center py-6">No team members yet. Invite your first colleague above.</p>}
    </div>
  )
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
