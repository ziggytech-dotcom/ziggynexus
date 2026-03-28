import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Admin top bar */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 32px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '18px',
              color: 'var(--text)',
            }}>
              NexusIQ<span style={{ color: 'var(--gold)' }}>™</span>{' '}
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'inherit' }}>
                Admin
              </span>
            </span>
          </Link>

          <nav style={{ display: 'flex', gap: '4px' }}>
            {[
              { href: '/admin', label: 'Overview' },
              { href: '/admin/domains', label: 'Custom Domains' },
              { href: '/admin/deliverables', label: 'Submit Deliverable' },
              { href: '/admin/kb', label: 'Knowledge Base' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/dashboard" style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          textDecoration: 'none',
        }}>
          ← Client Portal
        </Link>
      </div>

      {/* Admin content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>
        {children}
      </div>
    </div>
  )
}
