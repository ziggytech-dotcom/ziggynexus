'use client'

import { useState, useEffect } from 'react'

interface ClientDomain {
  id: string
  name: string
  email: string | null
  custom_domain: string | null
  custom_domain_verified: boolean
}

export default function DomainsPage() {
  const [clients, setClients] = useState<ClientDomain[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [domains, setDomains] = useState<Record<string, string>>({})
  const [messages, setMessages] = useState<Record<string, { type: 'success' | 'error'; text: string }>>({})

  useEffect(() => {
    fetch('/api/admin/domains')
      .then((r) => r.json())
      .then((data) => {
        setClients(data.clients ?? [])
        const initial: Record<string, string> = {}
        for (const c of data.clients ?? []) {
          initial[c.id] = c.custom_domain ?? ''
        }
        setDomains(initial)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function saveDomain(clientId: string) {
    setSaving(clientId)
    setMessages((prev) => ({ ...prev, [clientId]: { type: 'success', text: '' } }))

    const domain = domains[clientId]?.trim() ?? ''
    const res = await fetch('/api/admin/domains', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, domain: domain || null }),
    })
    const data = await res.json()

    if (res.ok) {
      setMessages((prev) => ({ ...prev, [clientId]: { type: 'success', text: 'Domain saved.' } }))
      setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, custom_domain: domain || null } : c))
    } else {
      setMessages((prev) => ({ ...prev, [clientId]: { type: 'error', text: data.error ?? 'Failed to save.' } }))
    }
    setSaving(null)
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
          Custom Domains
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
          Set a custom domain for each client portal. The client points a CNAME record at your
          primary domain and their portal is served at their chosen subdomain.
        </p>
      </div>

      {/* CNAME setup instructions */}
      <div style={{
        background: 'var(--gold-glow)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px 28px',
        marginBottom: '36px',
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#10b981', marginBottom: '14px' }}>
          CNAME Setup Instructions
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
          Have your client add the following DNS record in their domain registrar (GoDaddy, Cloudflare, etc.):
        </p>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '16px 20px',
          fontFamily: 'monospace',
          fontSize: '13px',
          display: 'grid',
          gridTemplateColumns: 'max-content max-content 1fr',
          gap: '8px 24px',
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Type</span>
          <span style={{ color: 'var(--text-muted)' }}>Name</span>
          <span style={{ color: 'var(--text-muted)' }}>Value</span>

          <span style={{ color: '#10b981', fontWeight: 600 }}>CNAME</span>
          <span style={{ color: 'var(--text)' }}>clients</span>
          <span style={{ color: 'var(--text)' }}>
            {typeof window !== 'undefined'
              ? window.location.hostname
              : 'app.ziggynexus.com'}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
          DNS propagation typically takes a few minutes. Once set, enter the full subdomain
          below (e.g. <code style={{ color: '#10b981' }}>clients.acmecorp.com</code>).
        </p>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading clients…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {clients.map((client) => (
            <div
              key={client.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '20px 24px',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                flexWrap: 'wrap',
              }}>
                <div style={{ minWidth: '160px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
                    {client.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{client.email}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, maxWidth: '480px' }}>
                  <input
                    type="text"
                    placeholder="clients.theirbusiness.com"
                    value={domains[client.id] ?? ''}
                    onChange={(e) => setDomains((prev) => ({ ...prev, [client.id]: e.target.value }))}
                    style={{
                      flex: 1,
                      padding: '9px 14px',
                      background: 'var(--elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'monospace',
                    }}
                  />
                  <button
                    onClick={() => saveDomain(client.id)}
                    disabled={saving === client.id}
                    style={{
                      padding: '9px 18px',
                      background: '#10b981',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#050505',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: saving === client.id ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {saving === client.id ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>

              {messages[client.id]?.text && (
                <div style={{
                  marginTop: '10px',
                  fontSize: '12px',
                  color: messages[client.id].type === 'success' ? 'var(--status-approved)' : 'var(--status-rejected)',
                }}>
                  {messages[client.id].text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
