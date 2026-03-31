'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ClientBranding } from '@/lib/types'

const navItems = [
  { href: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { href: '/approvals', icon: '✓', label: 'Approvals' },
  { href: '/progress', icon: '◈', label: 'Progress' },
  { href: '/assets', icon: '◫', label: 'Assets' },
  { href: '/uploads', icon: '📁', label: 'Uploads' },
  { href: '/invoices', icon: '📄', label: 'Invoices' },
  { href: '/calendar', icon: '◷', label: 'Calendar' },
  { href: '/help', icon: '?', label: 'Help & FAQ' },
  { href: '/settings', icon: '⚙', label: 'Settings' },
]

interface SideNavProps {
  branding?: ClientBranding | null
  hidePoweredBy?: boolean
}

export default function SideNav({ branding, hidePoweredBy }: SideNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const agencyName = branding?.brand_name ?? 'ZiggyNexus'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navContent = (
    <nav
      className={`portal-sidenav${mobileOpen ? ' mobile-open' : ''}`}
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
      {/* Logo / Brand */}
      <div style={{ padding: '0 8px', marginBottom: '36px' }}>
        {branding?.brand_logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={branding.brand_logo_url}
            alt={agencyName}
            style={{ maxHeight: '40px', maxWidth: '160px', objectFit: 'contain', marginBottom: '8px' }}
          />
        ) : (
          <>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: '#10b981',
                textTransform: 'uppercase',
                marginBottom: '4px',
                fontWeight: 500,
              }}
            >
              {agencyName}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '22px',
                color: 'var(--text)',
                fontWeight: 400,
              }}
            >
              ZiggyNexus<span style={{ color: '#10b981' }}>™</span>
            </div>
          </>
        )}
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#10b981' : 'var(--text-secondary)',
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

      {/* Powered by ZiggyNexus */}
      {!hidePoweredBy && (
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <a
            href="https://ziggynexus.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '10px', color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '0.05em' }}
          >
            Powered by ZiggyNexus
          </a>
        </div>
      )}

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

  return (
    <>
      {/* Mobile top bar — visible only on mobile via CSS */}
      <div className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {branding?.brand_logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={branding.brand_logo_url} alt={agencyName} style={{ height: '28px', objectFit: 'contain' }} />
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '18px',
                color: 'var(--text)',
              }}
            >
              ZiggyNexus<span style={{ color: '#10b981' }}>™</span>
            </span>
          )}
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '8px 10px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: 1,
          }}
        >
          ☰
        </button>
      </div>

      {/* Overlay when mobile nav is open */}
      {mobileOpen && (
        <div
          className="sidenav-overlay open"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {navContent}
    </>
  )
}
