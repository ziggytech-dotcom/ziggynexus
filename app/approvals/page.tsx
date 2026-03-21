import { createClient } from '@/lib/supabase/server'
import ApprovalCard from '@/components/ApprovalCard'
import type { Deliverable } from '@/lib/types'

export default async function ApprovalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('id, name')
    .eq('email', user?.email)
    .single()

  const { data: pendingItems } = await supabase
    .from('deliverables')
    .select('*')
    .eq('client_id', client?.id ?? '')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false })

  const { data: reviewedItems } = await supabase
    .from('deliverables')
    .select('*')
    .eq('client_id', client?.id ?? '')
    .in('status', ['approved', 'changes_requested', 'rejected'])
    .order('reviewed_at', { ascending: false })
    .limit(10)

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div
          style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '8px',
            fontWeight: 500,
          }}
        >
          NexusIQ™
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
          Approval Queue
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          {pendingItems && pendingItems.length > 0
            ? `${pendingItems.length} item${pendingItems.length === 1 ? '' : 's'} waiting for your review.`
            : 'You\'re all caught up. Nothing pending right now.'}
          {' '}Nothing goes live without your approval.
        </p>
      </div>

      {/* Pending items */}
      {pendingItems && pendingItems.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              Needs Your Review
            </h2>
            <span
              style={{
                fontSize: '12px',
                padding: '2px 8px',
                background: 'var(--gold-glow)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                color: 'var(--gold)',
              }}
            >
              {pendingItems.length}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {pendingItems.map((item: Deliverable) => (
              <ApprovalCard key={item.id} deliverable={item} />
            ))}
          </div>
        </div>
      )}

      {/* Recently reviewed */}
      {reviewedItems && reviewedItems.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '16px',
            }}
          >
            Recently Reviewed
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {reviewedItems.map((item: Deliverable) => (
              <ApprovalCard key={item.id} deliverable={item} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!pendingItems || pendingItems.length === 0) && (!reviewedItems || reviewedItems.length === 0) && (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 40px',
            background: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '24px',
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: '8px',
            }}
          >
            All clear
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            No deliverables waiting for review. Check back when your team delivers something new.
          </p>
        </div>
      )}
    </div>
  )
}
