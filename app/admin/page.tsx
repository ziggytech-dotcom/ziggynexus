import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()

  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const { count: pendingCount } = await supabase
    .from('deliverables')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_review')

  const { count: kbCount } = await supabase
    .from('kb_articles')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  const { data: recentActivity } = await supabase
    .from('portal_activity')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '32px',
          fontWeight: 400,
          color: 'var(--text)',
          marginBottom: '6px',
        }}>
          Workspace Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Manage clients, deliverables, knowledge base, and custom domains.
        </p>
      </div>

      {/* Quick stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '40px',
      }}>
        <StatCard label="Total Clients" value={String(clientCount ?? 0)} />
        <StatCard label="Pending Approvals" value={String(pendingCount ?? 0)} highlight={!!pendingCount && pendingCount > 0} />
        <StatCard label="Published KB Articles" value={String(kbCount ?? 0)} />
      </div>

      {/* Quick actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '48px',
      }}>
        {[
          {
            href: '/admin/deliverables',
            icon: '✓',
            title: 'Submit Deliverable',
            description: 'Upload work for client approval and send notification',
          },
          {
            href: '/admin/domains',
            icon: '◌',
            title: 'Custom Domains',
            description: 'Set clients.yourbusiness.com CNAME per client',
          },
          {
            href: '/admin/kb',
            icon: '?',
            title: 'Knowledge Base',
            description: 'Create and publish help articles for clients',
          },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            style={{
              display: 'block',
              padding: '24px',
              background: 'var(--surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{
              fontSize: '24px',
              color: 'var(--gold)',
              marginBottom: '12px',
            }}>
              {action.icon}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
              {action.title}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {action.description}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent portal activity */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
            Recent Client Activity
          </h2>
        </div>

        {recentActivity && recentActivity.length > 0 ? (
          <div>
            {recentActivity.map((event) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const clientName = (event.clients as any)?.name ?? 'Unknown client'
              return (
                <div
                  key={event.id}
                  style={{
                    padding: '14px 24px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--gold-glow)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      flexShrink: 0,
                    }}>
                      {eventIcon(event.event_type)}
                    </span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                        {clientName}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {event.event_type.replace(/_/g, ' ')}
                        {event.event_data && Object.keys(event.event_data).length > 0 &&
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (event.event_data as any).article_title &&
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          ` — "${(event.event_data as any).article_title}"`
                        }
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {new Date(event.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                      hour: 'numeric', minute: '2-digit',
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            No client activity yet. Actions in the portal will appear here.
          </div>
        )}
      </div>
    </div>
  )
}

function eventIcon(type: string): string {
  const icons: Record<string, string> = {
    file_viewed: '📂',
    deliverable_viewed: '👁',
    payment_made: '💳',
    message_sent: '💬',
    upload_completed: '📁',
    approval_submitted: '✓',
  }
  return icons[type] ?? '◆'
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight ? 'var(--gold-glow)' : 'var(--surface)',
      border: `1px solid ${highlight ? 'var(--border)' : 'var(--border-subtle)'}`,
      borderRadius: '12px',
      padding: '24px',
    }}>
      <div style={{
        fontSize: '32px',
        fontFamily: 'var(--font-playfair)',
        color: highlight ? 'var(--gold)' : 'var(--text)',
        fontWeight: 400,
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  )
}
