import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Deliverable, DeliverableType } from '@/lib/types'
import { TYPE_LABELS } from '@/lib/types'
import AssetCard from '@/components/AssetCard'

const TYPE_ICONS: Record<DeliverableType, string> = {
  brand_asset: '🎨',
  website: '🌐',
  social: '📱',
  report: '📊',
  video: '🎬',
}

const TYPE_ORDER: DeliverableType[] = ['brand_asset', 'website', 'social', 'report', 'video']

export default async function AssetsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('id, name')
    .eq('email', user?.email)
    .single()

  const { data: assets } = await supabase
    .from('deliverables')
    .select('*')
    .eq('client_id', client?.id ?? '')
    .order('type')
    .order('created_at', { ascending: false })

  // Group by type
  const grouped = TYPE_ORDER.reduce((acc, type) => {
    acc[type] = (assets ?? []).filter((a: Deliverable) => a.type === type)
    return acc
  }, {} as Record<DeliverableType, Deliverable[]>)

  const totalCount = assets?.length ?? 0

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div
          style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#10b981',
            marginBottom: '8px',
            fontWeight: 500,
          }}
        >
          ZiggyNexus™
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '36px',
            fontWeight: 400,
            color: 'var(--text)',
            marginBottom: '8px',
          }}
        >
          Asset Library
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          {totalCount > 0
            ? `${totalCount} deliverable${totalCount === 1 ? '' : 's'} &mdash; all your work in one place.`
            : 'Your deliverables will appear here as they\'re completed.'}
        </p>
      </div>

      {/* Sections by type */}
      {totalCount > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {TYPE_ORDER.map((type) => {
            const items = grouped[type]
            if (items.length === 0) return null

            return (
              <section key={type}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{TYPE_ICONS[type]}</span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '20px',
                      fontWeight: 400,
                      color: 'var(--text)',
                    }}
                  >
                    {TYPE_LABELS[type]}
                  </h2>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      padding: '2px 8px',
                      background: 'var(--elevated)',
                      borderRadius: '20px',
                    }}
                  >
                    {items.length}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {items.map((asset: Deliverable) => (
                    <Link
                      key={asset.id}
                      href={`/assets/${asset.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <AssetCard asset={asset} />
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 40px',
            background: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>◫</div>
          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '24px',
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: '8px',
            }}
          >
            Your library is being built
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Deliverables appear here as your team completes them.
          </p>
        </div>
      )}
    </div>
  )
}
