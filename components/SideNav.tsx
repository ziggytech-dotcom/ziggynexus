'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { href: '/approvals', icon: '✓', label: 'Approvals' },
  { href: '/assets', icon: '◫', label: 'Assets' },
  { href: '/calendar', icon: '◷', label: 'Calendar' },
]

export default function SideNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav
      style={{
        width: '220px',
        minWidth: '220px',
        height: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 16px',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 8px', marginBottom: '36px' }}>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            marginBottom: '4px',
            fontWeight: 500,
          }}
        >
          ZiggyTech Creative
        </div>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '22px',
            color: 'var(--text)',
            fontWeight: 400,
          }}
        >
          NexusIQ<span style={{ color: 'var(--gold)' }}>™</span>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                background: isActive ? 'var(--gold-glow)' : 'transparent',
                border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '16px', opacity: isActive ? 1 : 0.6 }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* Bottom: sign out */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'color 0.15s',
          }}
        >
          <span style={{ fontSize: '14px' }}>↩</span>
          Sign out
        </button>
      </div>
    </nav>
  )
}
