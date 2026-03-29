'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(201, 169, 110, 0.10)',
        background: '#050505',
        padding: '20px 32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          color: 'rgba(245, 240, 232, 0.30)',
          letterSpacing: '0.04em',
        }}
      >
        © {new Date().getFullYear()} ZiggyTech Ventures LLC. All rights reserved.
      </span>

      <nav
        style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { href: '/privacy', label: 'Privacy Policy' },
          { href: '/terms', label: 'Terms of Service' },
          { href: '/cookies', label: 'Cookie Policy' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontSize: '12px',
              color: 'rgba(201, 169, 110, 0.65)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLAnchorElement).style.color = '#10b981')
            }
            onMouseOut={(e) =>
              ((e.target as HTMLAnchorElement).style.color =
                'rgba(201, 169, 110, 0.65)')
            }
          >
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
