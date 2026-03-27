'use client'

import type { Deliverable, DeliverableType } from '@/lib/types'
import { TYPE_LABELS, STATUS_LABELS } from '@/lib/types'

const TYPE_ICONS: Record<DeliverableType, string> = {
  brand_asset: '🎨',
  website: '🌐',
  social: '📱',
  report: '📊',
  video: '🎬',
}

const statusColors: Record<string, string> = {
  pending_review: 'var(--status-pending)',
  approved: 'var(--status-approved)',
  changes_requested: 'var(--status-changes)',
  rejected: 'var(--status-rejected)',
}

export default function AssetCard({ asset }: { asset: Deliverable }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        overflow: 'hidden',
        transition: 'border-color 0.15s, transform 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border)'
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border-subtle)'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: '140px',
          background: 'var(--elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {asset.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.thumbnail_url}
            alt={asset.title}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '36px', opacity: 0.4 }}>
            {TYPE_ICONS[asset.type as DeliverableType] ?? '📄'}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <div
          style={{
            fontSize: '13px',
            color: 'var(--text)',
            fontWeight: 500,
            marginBottom: '4px',
            lineHeight: 1.3,
          }}
        >
          {asset.title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>v{asset.version}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {TYPE_LABELS[asset.type as DeliverableType] ?? asset.type}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: statusColors[asset.status] ?? 'var(--text-muted)',
            }}
          >
            {STATUS_LABELS[asset.status as keyof typeof STATUS_LABELS] ?? asset.status}
          </span>
        </div>
      </div>
    </div>
  )
}
