import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cookie Policy — NexusIQ',
  description: 'How ZiggyTech Ventures LLC uses cookies and tracking technologies.',
}

export default function CookiesPage() {
  return (
    <>
      <main
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '60px 24px 80px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '760px', marginBottom: '32px' }}>
          <Link
            href="/"
            style={{ fontSize: '13px', color: 'rgba(201,169,110,0.65)', textDecoration: 'none', letterSpacing: '0.04em' }}
          >
            ← Back to portal
          </Link>
        </div>

        <article
          style={{
            width: '100%',
            maxWidth: '760px',
            background: 'var(--surface)',
            border: '1px solid rgba(201,169,110,0.12)',
            borderRadius: '16px',
            padding: '48px 52px',
          }}
        >
          <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(201,169,110,0.10)', paddingBottom: '32px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '12px', fontWeight: 500 }}>
              ZiggyTech Ventures LLC
            </p>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '36px', fontWeight: 400, color: 'var(--text)', marginBottom: '12px', lineHeight: 1.2 }}>
              Cookie Policy
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.40)', lineHeight: 1.5 }}>
              Effective Date: [Pending attorney review] &nbsp;·&nbsp; Last Updated: [Pending attorney review]
            </p>
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(201,169,110,0.05)', borderRadius: '8px', border: '1px solid rgba(201,169,110,0.15)' }}>
              <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.50)', lineHeight: 1.6 }}>
                <strong style={{ color: '#C9A96E' }}>Draft Notice:</strong> This document is a draft pending attorney review and has not been formally published.
              </p>
            </div>
          </div>

          <CookieContent />
        </article>
      </main>
      <Footer />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '36px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#C9A96E', marginBottom: '14px', letterSpacing: '0.02em' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

const prose: React.CSSProperties = {
  fontSize: '14px',
  color: 'rgba(245,240,232,0.70)',
  lineHeight: 1.75,
  marginBottom: '12px',
}

const li: React.CSSProperties = {
  fontSize: '14px',
  color: 'rgba(245,240,232,0.70)',
  lineHeight: 1.75,
  marginBottom: '6px',
}

function CookieTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {['Cookie / Category', 'Purpose', 'Duration'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#C9A96E', fontWeight: 600, borderBottom: '1px solid rgba(201,169,110,0.15)', letterSpacing: '0.04em', fontSize: '12px', textTransform: 'uppercase' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, purpose, duration]) => (
            <tr key={name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '10px 14px', color: 'rgba(245,240,232,0.85)', fontFamily: 'monospace', fontSize: '12px' }}>{name}</td>
              <td style={{ padding: '10px 14px', color: 'rgba(245,240,232,0.65)' }}>{purpose}</td>
              <td style={{ padding: '10px 14px', color: 'rgba(245,240,232,0.50)', whiteSpace: 'nowrap' }}>{duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CookieContent() {
  return (
    <div>
      <Section title="1. What Are Cookies?">
        <p style={prose}>Cookies are small text files placed on your device by websites you visit. They help websites work properly, remember your preferences, and provide information to the site operator.</p>
        <p style={prose}>We also use similar technologies including web beacons/pixels, local storage, and session storage.</p>
      </Section>

      <Section title="2. Strictly Necessary Cookies">
        <p style={prose}>Required for the Services to function. These cannot be disabled.</p>
        <CookieTable rows={[
          ['session_id', 'Maintains your login session', 'Session'],
          ['csrf_token', 'Protects against CSRF attacks', 'Session'],
          ['auth_token', 'Stores your authentication state', 'Up to 30 days'],
          ['user_prefs', 'Stores essential UI preferences', '1 year'],
        ]} />
      </Section>

      <Section title="3. Functional Cookies">
        <p style={prose}>These enhance usability and personalization. You may disable these, but doing so may affect functionality.</p>
        <CookieTable rows={[
          ['ui_theme', 'Remembers your UI theme preference', '1 year'],
          ['sidebar_state', 'Remembers sidebar collapsed/expanded state', '6 months'],
          ['dashboard_layout', 'Saves your customized dashboard layout', '1 year'],
          ['onboarding_progress', 'Tracks completion of onboarding steps', '90 days'],
        ]} />
      </Section>

      <Section title="4. Analytics Cookies">
        <p style={prose}>Help us understand how you use our Services so we can improve them. You may opt out.</p>
        <CookieTable rows={[
          ['Google Analytics (_ga, _gid)', 'Tracks page views, user flows, session data', 'Up to 2 years'],
          ['Mixpanel', 'Product analytics; tracks feature usage', '1 year'],
          ['Vercel Speed Insights', 'Performance monitoring', 'Session'],
        ]} />
      </Section>

      <Section title="5. Marketing Cookies">
        <p style={prose}>Used on our marketing website only (not within the authenticated app). You may opt out.</p>
        <CookieTable rows={[
          ['Google Ads (_gcl_*)', 'Tracks conversions from Google Ads', '90 days'],
          ['Meta Pixel', 'Measures ad effectiveness', 'Up to 90 days'],
          ['LinkedIn Insight Tag', 'B2B ad targeting and conversion tracking', 'Up to 90 days'],
        ]} />
      </Section>

      <Section title="6. Your Cookie Choices">
        <p style={prose}>You can manage non-essential cookie preferences through our Cookie Preference Center (accessible via the &quot;Cookie Settings&quot; link in the footer).</p>
        <p style={prose}>Most web browsers allow you to control cookies through browser settings. Disabling strictly necessary cookies will prevent you from using core features of our Services.</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          {[
            ['Google Analytics Opt-Out', 'https://tools.google.com/dlpage/gaoptout'],
            ['Digital Advertising Alliance', 'https://optout.aboutads.info'],
            ['Network Advertising Initiative', 'https://optout.networkadvertising.org'],
          ].map(([label, href]) => (
            <li key={label} style={li}>
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A96E' }}>{label}</a>
            </li>
          ))}
        </ul>
        <p style={prose}>
          <strong style={{ color: 'var(--text)' }}>California Residents (CCPA/CPRA):</strong> To opt out of sharing personal information for cross-context behavioral advertising, email us at <a href="mailto:legal@ziggytechventures.com" style={{ color: '#C9A96E' }}>legal@ziggytechventures.com</a> (subject: &quot;CCPA Opt-Out — Cookies&quot;). Requests will be processed within 15 business days.
        </p>
      </Section>

      <Section title="7. Data Retention">
        <p style={prose}>Cookie lifespans are listed in the tables above. Server-side data collected through cookies is retained in accordance with our <Link href="/privacy" style={{ color: '#C9A96E', textDecoration: 'underline' }}>Privacy Policy</Link> — generally 12 months for usage and log data.</p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p style={prose}>We may update this Cookie Policy to reflect changes in technology, regulation, or our practices. We will post updates with a new &quot;Last Updated&quot; date, and provide notice of material changes via email or in-app notification.</p>
      </Section>

      <Section title="9. Contact Us">
        <p style={prose}>
          <strong style={{ color: 'var(--text)' }}>ZiggyTech Ventures LLC</strong><br />
          Privacy &amp; Legal Affairs<br />
          Email: <a href="mailto:legal@ziggytechventures.com" style={{ color: '#C9A96E' }}>legal@ziggytechventures.com</a><br />
          Las Vegas, Nevada
        </p>
        <p style={prose}>
          Also see our{' '}
          <Link href="/privacy" style={{ color: '#C9A96E', textDecoration: 'underline' }}>Privacy Policy</Link>
          {' '}and{' '}
          <Link href="/terms" style={{ color: '#C9A96E', textDecoration: 'underline' }}>Terms of Service</Link>.
        </p>
      </Section>
    </div>
  )
}
