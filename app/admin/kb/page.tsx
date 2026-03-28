'use client'

import { useState, useEffect } from 'react'

interface ClientOption {
  id: string
  name: string
}

interface Article {
  id: string
  client_id: string | null
  title: string
  slug: string
  category: string | null
  published: boolean
  created_at: string
}

export default function KbAdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    clientId: '',
    title: '',
    slug: '',
    content: '',
    category: '',
    published: true,
  })

  async function loadData() {
    const [artRes, cliRes] = await Promise.all([
      fetch('/api/admin/kb'),
      fetch('/api/admin/domains'),
    ])
    const artData = await artRes.json()
    const cliData = await cliRes.json()
    setArticles(artData.articles ?? [])
    setClients(cliData.clients ?? [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80)
  }

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !editingId ? { slug: autoSlug(value as string) } : {}),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError('Title, slug, and content are required.')
      return
    }
    setSaving(true)

    const res = await fetch('/api/admin/kb', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, id: editingId }),
    })
    const data = await res.json()
    setSaving(false)

    if (res.ok) {
      setShowForm(false)
      setEditingId(null)
      resetForm()
      loadData()
    } else {
      setError(data.error ?? 'Failed to save.')
    }
  }

  async function togglePublish(article: Article) {
    await fetch('/api/admin/kb', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: article.id, published: !article.published }),
    })
    loadData()
  }

  async function deleteArticle(id: string) {
    if (!confirm('Delete this article?')) return
    await fetch('/api/admin/kb', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadData()
  }

  function startEdit(article: Article & { content?: string }) {
    setEditingId(article.id)
    setForm({
      clientId: article.client_id ?? '',
      title: article.title,
      slug: article.slug,
      content: article.content ?? '',
      category: article.category ?? '',
      published: article.published,
    })
    setShowForm(true)

    // Fetch full content
    fetch(`/api/admin/kb?id=${article.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.article) {
          setForm((prev) => ({ ...prev, content: d.article.content }))
        }
      })
  }

  function resetForm() {
    setForm({ clientId: '', title: '', slug: '', content: '', category: '', published: true })
  }

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '32px',
            fontWeight: 400,
            color: 'var(--text)',
            marginBottom: '8px',
          }}>
            Knowledge Base
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Create help articles clients can self-serve. Leave client blank to make an article global.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm() }}
          style={{
            padding: '10px 20px',
            background: 'var(--gold)',
            border: 'none',
            borderRadius: '8px',
            color: '#050505',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : '+ New Article'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '28px 32px',
          marginBottom: '32px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '24px' }}>
            {editingId ? 'Edit Article' : 'New Article'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} style={inputStyle} placeholder="What is the approval process?" />
              </div>
              <div>
                <label style={labelStyle}>Slug *</label>
                <input type="text" value={form.slug} onChange={(e) => update('slug', e.target.value)} style={{ ...inputStyle, fontFamily: 'monospace' }} placeholder="approval-process" />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <input type="text" value={form.category} onChange={(e) => update('category', e.target.value)} style={inputStyle} placeholder="Getting Started, Process, Billing…" />
              </div>
              <div>
                <label style={labelStyle}>Client (blank = global)</label>
                <select value={form.clientId} onChange={(e) => update('clientId', e.target.value)} style={inputStyle}>
                  <option value="">All clients</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Content * (Markdown supported)</label>
              <textarea
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                rows={14}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
                placeholder="Write the article in Markdown. Use ## for headings, **bold**, - for lists."
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} style={{ accentColor: 'var(--gold)' }} />
                Published (visible to clients)
              </label>
              {error && <div style={{ fontSize: '12px', color: 'var(--status-rejected)' }}>{error}</div>}
              <button type="submit" disabled={saving} style={{
                marginLeft: 'auto',
                padding: '10px 22px',
                background: 'var(--gold)',
                border: 'none',
                borderRadius: '8px',
                color: '#050505',
                fontSize: '13px',
                fontWeight: 600,
                cursor: saving ? 'wait' : 'pointer',
              }}>
                {saving ? 'Saving…' : (editingId ? 'Update Article' : 'Publish Article')}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading…</div>
      ) : articles.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>?</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No articles yet. Create your first one above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {articles.map((article) => (
            <div
              key={article.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px' }}>
                  {article.title}
                  {!article.published && (
                    <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>
                      (Draft)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  /{article.slug}
                  {article.category && ` · ${article.category}`}
                  {article.client_id
                    ? ` · ${clients.find((c) => c.id === article.client_id)?.name ?? 'Specific client'}`
                    : ' · All clients'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <ActionBtn onClick={() => togglePublish(article)} label={article.published ? 'Unpublish' : 'Publish'} />
                <ActionBtn onClick={() => startEdit(article)} label="Edit" />
                <ActionBtn onClick={() => deleteArticle(article.id)} label="Delete" danger />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ActionBtn({ onClick, label, danger }: { onClick: () => void; label: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        background: danger ? 'rgba(248,113,113,0.1)' : 'var(--elevated)',
        border: `1px solid ${danger ? 'rgba(248,113,113,0.3)' : 'var(--border-subtle)'}`,
        borderRadius: '6px',
        color: danger ? 'var(--status-rejected)' : 'var(--text-secondary)',
        fontSize: '12px',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 13px',
  background: 'var(--elevated)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  color: 'var(--text)',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}
