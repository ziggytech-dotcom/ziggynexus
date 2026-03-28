import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { KbArticle } from '@/lib/types'

export default async function HelpPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user?.email)
    .single()

  // Fetch published articles: global (null client_id) OR for this client
  const { data: articles } = await supabase
    .from('kb_articles')
    .select('id, title, slug, category, content, created_at')
    .eq('published', true)
    .or(`client_id.is.null,client_id.eq.${client?.id ?? '00000000-0000-0000-0000-000000000000'}`)
    .order('category')
    .order('created_at')

  // Group by category
  const grouped: Record<string, KbArticle[]> = {}
  for (const article of (articles ?? []) as KbArticle[]) {
    const cat = article.category ?? 'General'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(article)
  }
  const categories = Object.keys(grouped).sort()

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontSize: '12px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '8px',
          fontWeight: 500,
        }}>
          Knowledge Base
        </div>
        <h1 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '36px',
          fontWeight: 400,
          color: 'var(--text)',
          marginBottom: '8px',
        }}>
          Help & FAQ
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Find answers to common questions — no need to send an email.
        </p>
      </div>

      {categories.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {categories.map((cat) => (
            <section key={cat}>
              <h2 style={{
                fontSize: '13px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--gold)',
                marginBottom: '16px',
              }}>
                {cat}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {grouped[cat].map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'var(--surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>?</div>
          <h3 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '24px',
            fontWeight: 400,
            color: 'var(--text)',
            marginBottom: '8px',
          }}>
            No articles yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Your team is working on adding helpful articles here. Check back soon.
          </p>
        </div>
      )}
    </div>
  )
}

function ArticleCard({ article }: { article: KbArticle }) {
  // Extract first sentence as preview
  const preview = article.content.replace(/#+ /g, '').split('\n').find((l) => l.trim().length > 0) ?? ''
  const shortPreview = preview.length > 120 ? preview.slice(0, 120) + '…' : preview

  return (
    <Link
      href={`/help/${article.slug}`}
      style={{
        display: 'block',
        padding: '18px 22px',
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        textDecoration: 'none',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <div style={{
        fontSize: '15px',
        fontWeight: 500,
        color: 'var(--text)',
        marginBottom: '5px',
      }}>
        {article.title}
      </div>
      {shortPreview && (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {shortPreview}
        </div>
      )}
    </Link>
  )
}
