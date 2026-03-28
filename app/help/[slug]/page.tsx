import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ActivityTracker from '@/components/ActivityTracker'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user?.email)
    .single()

  // Fetch the article — must be published and accessible (global or client-specific)
  const { data: article } = await supabase
    .from('kb_articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .or(`client_id.is.null,client_id.eq.${client?.id ?? '00000000-0000-0000-0000-000000000000'}`)
    .single()

  if (!article) notFound()

  // Render simple markdown-lite (headings, bold, paragraphs)
  const rendered = renderContent(article.content)

  return (
    <div className="fade-in">
      {/* Track that the client viewed this article */}
      <ActivityTracker
        eventType="file_viewed"
        eventData={{ article_id: article.id, article_title: article.title, article_slug: slug }}
      />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '32px' }}>
        <Link href="/help" style={{
          fontSize: '13px',
          color: 'var(--gold)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          ← Help & FAQ
        </Link>
      </div>

      {/* Article */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '40px 48px',
        maxWidth: '760px',
      }}>
        {article.category && (
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            fontWeight: 500,
            marginBottom: '12px',
          }}>
            {article.category}
          </div>
        )}
        <h1 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '32px',
          fontWeight: 400,
          color: 'var(--text)',
          marginBottom: '28px',
          lineHeight: 1.2,
        }}>
          {article.title}
        </h1>

        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '15px',
            lineHeight: 1.75,
          }}
          dangerouslySetInnerHTML={{ __html: rendered }}
        />

        <div style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          Last updated {new Date(article.updated_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>
    </div>
  )
}

// Minimal markdown renderer — only handles what we store: headings, bold, paragraphs, lists
function renderContent(raw: string): string {
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''

      // Headings
      if (trimmed.startsWith('### ')) {
        return `<h3 style="font-size:17px;font-weight:600;color:var(--text);margin:24px 0 10px 0;">${trimmed.slice(4)}</h3>`
      }
      if (trimmed.startsWith('## ')) {
        return `<h2 style="font-family:var(--font-playfair);font-size:22px;font-weight:400;color:var(--text);margin:32px 0 12px 0;">${trimmed.slice(3)}</h2>`
      }
      if (trimmed.startsWith('# ')) {
        return `<h2 style="font-family:var(--font-playfair);font-size:26px;font-weight:400;color:var(--text);margin:0 0 16px 0;">${trimmed.slice(2)}</h2>`
      }

      // Unordered list (lines starting with - or *)
      if (/^[*-] /.test(trimmed)) {
        const items = trimmed.split('\n').filter((l) => /^[*-] /.test(l.trim()))
        const lis = items.map((l) => `<li style="margin-bottom:6px;">${inlineFormat(l.replace(/^[*-] /, ''))}</li>`).join('')
        return `<ul style="margin:0 0 16px 0;padding-left:20px;list-style:disc;">${lis}</ul>`
      }

      // Paragraph
      return `<p style="margin:0 0 16px 0;">${inlineFormat(trimmed.replace(/\n/g, ' '))}</p>`
    })
    .join('')
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text);">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="font-size:13px;background:var(--elevated);padding:1px 5px;border-radius:3px;color:var(--gold);">$1</code>')
}
