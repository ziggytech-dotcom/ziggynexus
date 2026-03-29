import { createClient } from '@/lib/supabase/server'
import { TYPE_LABELS } from '@/lib/types'
import type { ProjectPhase } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get client record
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('email', user?.email)
    .single()

  // First-time clients: redirect to onboarding
  if (client && client.onboarding_completed === false) {
    redirect('/onboarding')
  }

  // Get pending approvals count
  const { count: pendingCount } = await supabase
    .from('deliverables')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', client?.id ?? '')
    .eq('status', 'pending_review')

  // Get project phases
  const { data: phases } = await supabase
    .from('project_phases')
    .select('*')
    .eq('client_id', client?.id ?? '')
    .order('order_index')

  // Get recent deliverables
  const { data: recent } = await supabase
    .from('deliverables')
    .select('*')
    .eq('client_id', client?.id ?? '')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get unread notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('client_id', client?.id ?? '')
    .eq('read', false)
    .order('created_at', { ascending: false })
    .limit(5)

  const clientName = client?.name ?? user?.email?.split('@')[0] ?? 'Client'

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
          Welcome back
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '36px',
            fontWeight: 400,
            color: 'var(--text)',
            lineHeight: 1.1,
          }}
        >
          {clientName}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '15px' }}>
          Here&apos;s everything happening on your project right now.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        <StatCard
          label="Awaiting Your Approval"
          value={String(pendingCount ?? 0)}
          highlight={!!pendingCount && pendingCount > 0}
          action={pendingCount && pendingCount > 0 ? { label: 'Review now →', href: '/approvals' } : undefined}
        />
        <StatCard
          label="Total Deliverables"
          value={String(recent?.length ?? 0)}
        />
        <StatCard
          label="Notifications"
          value={String(notifications?.length ?? 0)}
        />
      </div>

      {/* Main grid */}
      <div className="grid-2col">

        {/* Project Status */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '18px',
                fontWeight: 400,
                color: 'var(--text)',
              }}
            >
              📊 Project Status
            </h2>
            <a href="/progress" style={{ fontSize: '12px', color: '#10b981', textDecoration: 'none' }}>
              Full view →
            </a>
          </div>
          {phases && phases.length > 0 ? (
            <>
              {/* Overall progress bar */}
              {(() => {
                const phasesTyped = phases as ProjectPhase[]
                const total = phasesTyped.length
                const overallPct = total === 0 ? 0 : Math.round(
                  phasesTyped.reduce((sum, p) => {
                    if (p.status === 'complete') return sum + 100
                    if (p.status === 'pending' || p.status === 'on_hold') return sum + 0
                    return sum + (p.progress_pct ?? 0)
                  }, 0) / total
                )
                return (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Overall Progress</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>{overallPct}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--elevated)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${overallPct}%`,
                        background: 'linear-gradient(90deg, var(--gold-dim), #10b981)',
                        borderRadius: '6px',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                )
              })()}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {phases.map((phase) => (
                  <PhaseRow
                    key={phase.id}
                    label={phase.phase.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    status={phase.status}
                    dueDate={phase.due_date}
                  />
                ))}
              </div>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {[
                { label: 'Discovery & Research', status: 'complete' },
                { label: 'Brand Identity', status: 'in_progress' },
                { label: 'Website Build', status: 'pending' },
                { label: 'Content & Social', status: 'pending' },
                { label: 'Launch', status: 'pending' },
              ].map((phase) => (
                <PhaseRow key={phase.label} label={phase.label} status={phase.status as never} dueDate={null} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '28px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '18px',
              fontWeight: 400,
              marginBottom: '20px',
              color: 'var(--text)',
            }}
          >
            🕐 Recent Activity
          </h2>
          {recent && recent.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recent.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px',
                    background: 'var(--elevated)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500, marginBottom: '2px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {TYPE_LABELS[item.type as keyof typeof TYPE_LABELS] ?? item.type}
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              No deliverables yet. Check back soon — your team is working on it.
            </p>
          )}
        </div>

        {/* Notifications */}
        {notifications && notifications.length > 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '28px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '18px',
                fontWeight: 400,
                marginBottom: '20px',
                color: 'var(--text)',
              }}
            >
              🔔 Notifications
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '14px 16px',
                    background: 'var(--gold-glow)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ color: '#10b981', fontSize: '16px' }}>◆</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px' }}>
                      {n.title}
                    </div>
                    {n.message && (
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{n.message}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  highlight,
  action,
}: {
  label: string
  value: string
  highlight?: boolean
  action?: { label: string; href: string }
}) {
  return (
    <div
      style={{
        background: highlight ? 'var(--gold-glow)' : 'var(--surface)',
        border: `1px solid ${highlight ? 'var(--border)' : 'var(--border-subtle)'}`,
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      <div
        style={{
          fontSize: '36px',
          fontFamily: 'var(--font-playfair)',
          color: highlight ? '#10b981' : 'var(--text)',
          fontWeight: 400,
          marginBottom: '6px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginBottom: action ? '12px' : 0,
        }}
      >
        {label}
      </div>
      {action && (
        <a
          href={action.href}
          style={{
            fontSize: '12px',
            color: '#10b981',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          {action.label}
        </a>
      )}
    </div>
  )
}

function PhaseRow({
  label,
  status,
  dueDate,
}: {
  label: string
  status: string
  dueDate: string | null
}) {
  const statusMap: Record<string, { icon: string; color: string }> = {
    complete: { icon: '✅', color: 'var(--status-approved)' },
    in_progress: { icon: '🔄', color: 'var(--status-in-progress)' },
    in_review: { icon: '🔁', color: 'var(--status-changes)' },
    pending: { icon: '⏳', color: 'var(--text-muted)' },
    on_hold: { icon: '🚫', color: 'var(--status-rejected)' },
  }
  const s = statusMap[status] ?? statusMap.pending

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px' }}>{s.icon}</span>
        <span style={{ fontSize: '14px', color: 'var(--text)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {dueDate && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    pending_review: { label: 'Needs Review', color: 'var(--status-pending)', bg: 'rgba(201,169,110,0.1)' },
    approved: { label: 'Approved', color: 'var(--status-approved)', bg: 'rgba(74,222,128,0.1)' },
    changes_requested: { label: 'Changes', color: 'var(--status-changes)', bg: 'rgba(251,146,60,0.1)' },
    rejected: { label: 'Rejected', color: 'var(--status-rejected)', bg: 'rgba(248,113,113,0.1)' },
  }
  const s = map[status] ?? map.pending_review

  return (
    <span
      style={{
        fontSize: '11px',
        fontWeight: 500,
        padding: '3px 8px',
        borderRadius: '4px',
        color: s.color,
        background: s.bg,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  )
}
