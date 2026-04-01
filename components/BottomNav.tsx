'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const bottomNavItems = [
  { href: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { href: '/progress', icon: '◈', label: 'Projects' },
  { href: '/uploads', icon: '◫', label: 'Files' },
  { href: '/approvals', icon: '✓', label: 'Messages' },
  { href: '/settings', icon: '⚙', label: 'Settings' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: '8px 4px',
              flex: 1,
              textDecoration: 'none',
              color: isActive ? '#10b981' : 'var(--text-muted)',
              transition: 'color 0.15s',
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
