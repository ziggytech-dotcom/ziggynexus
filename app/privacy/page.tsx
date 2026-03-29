import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — ZiggyNexus',
  description: 'How ZiggyTech Ventures LLC collects, uses, and protects your information.',
}

export default function PrivacyPage() {
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
        {/* Back nav */}
        <div style={{ width: '100%', maxWidth: '760px', marginBottom: '32px' }}>
          <Link
            href="/"
            style={{
              fontSize: '13px',
              color: 'rgba(201,169,110,0.65)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
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
          {/* Header */}
          <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(201,169,110,0.10)', paddingBottom: '32px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '12px', fontWeight: 500 }}>
              ZiggyTech Ventures LLC
            </p>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '36px', fontWeight: 400, color: 'var(--text)', marginBottom: '12px', lineHeight: 1.2 }}>
              Privacy Policy
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

          <LegalContent />
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

function LegalContent() {
  return (
    <div>
      <Section title="1. Introduction">
        <p style={prose}>
          ZiggyTech Ventures LLC (&quot;ZiggyTech,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a Nevada limited liability company (EIN: 41-4738365) that provides a suite of B2B SaaS products (the &quot;Business Suite&quot;) to small and mid-sized businesses across the United States.
        </p>
        <p style={prose}>
          This Privacy Policy describes how we collect, use, disclose, and protect information in connection with our Business Suite, which includes ZiggyHQ, ZiggyDocs, ZiggyNexus, ZiggySchedule, ZiggyPayroll, ZiggyPitch, ZiggyHR, ZiggyReviews, ZiggyInvoice, and ZiggyIntake.
        </p>
      </Section>

      <Section title="2. Data Processor / Controller Distinction">
        <p style={prose}>
          <strong style={{ color: 'var(--text)' }}>ZiggyTech operates primarily as a data processor.</strong> Our customers (you, the business) are the data controllers — you determine the purposes and means by which personal data is processed. ZiggyTech processes personal data on your behalf, strictly according to your instructions and our Data Processing Agreement (DPA).
        </p>
        <p style={prose}>
          In limited circumstances ZiggyTech acts as a data controller — for example, when processing account registration, billing data, and usage analytics for our own business purposes.
        </p>
      </Section>

      <Section title="3. Information We Collect">
        <p style={{ ...prose, fontWeight: 600, color: 'var(--text)' }}>Customer-provided data (Processor Role):</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          {[
            'Contact data: names, email addresses, phone numbers, mailing addresses',
            'Employment & payroll data: SSNs, EINs, wage information, tax elections',
            'Health information (PHI) — only when a BAA is in place',
            'Document content: contracts, agreements, signed forms and metadata',
            'Scheduling, financial, and intake form data',
          ].map((item) => (
            <li key={item} style={li}>{item}</li>
          ))}
        </ul>
        <p style={{ ...prose, fontWeight: 600, color: 'var(--text)' }}>Account & usage data (Controller Role):</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          {[
            'Account information: business name, owner name, email, phone, billing address',
            'Authentication data: usernames, hashed passwords, MFA tokens',
            'Payment information processed by Stripe (we do not store raw card data)',
            'Usage and log data: IP addresses, browser type, device identifiers, timestamps',
            'Support communications: emails, chat logs, support tickets',
          ].map((item) => (
            <li key={item} style={li}>{item}</li>
          ))}
        </ul>
        <p style={prose}>
          We also use cookies and similar technologies to collect device/browser identifiers, session data, and performance diagnostics. See our{' '}
          <Link href="/cookies" style={{ color: '#C9A96E', textDecoration: 'underline' }}>Cookie Policy</Link>{' '}
          for full details.
        </p>
      </Section>

      <Section title="4. How We Use Information">
        <p style={{ ...prose, fontWeight: 600, color: 'var(--text)' }}>As a Data Processor (Customer Data):</p>
        <p style={prose}>We use customer-uploaded data solely to provide and maintain the requested Services, process transactions, comply with legal obligations, and detect and prevent fraud or security incidents.</p>
        <p style={{ ...prose, fontWeight: 600, color: 'var(--text)' }}>As a Data Controller (Account & Usage Data):</p>
        <p style={prose}>We use account and usage data to manage your account, process payments, provide customer support, analyze aggregate usage to improve our products, and comply with applicable law.</p>
      </Section>

      <Section title="5. How We Share Information">
        <p style={prose}>We do not sell, rent, or trade your personal information or your customers&apos; data to third parties for marketing purposes.</p>
        <p style={prose}>We may share information with key sub-processors including Supabase (database hosting), Vercel (application hosting), Stripe (payment processing), and Resend (email delivery). All sub-processors are contractually bound to process data only as instructed.</p>
        <p style={prose}>We may also disclose information as required by law, or in connection with a merger or acquisition.</p>
      </Section>

      <Section title="6. California Privacy Rights (CCPA/CPRA)">
        <p style={prose}>California residents have the right to: know what personal information we collect; request deletion of personal information; request correction of inaccurate data; opt out of sale or sharing; limit use of sensitive personal information; and receive non-discriminatory treatment for exercising these rights.</p>
        <p style={prose}>
          To exercise your California privacy rights, contact us at{' '}
          <a href="mailto:legal@ziggytechventures.com" style={{ color: '#C9A96E' }}>legal@ziggytechventures.com</a>{' '}
          (subject: &quot;California Privacy Rights Request&quot;). We will respond within 45 calendar days.
        </p>
      </Section>

      <Section title="7. Nevada Privacy Rights (NV SB220)">
        <p style={prose}>
          We do not sell covered information of Nevada residents. To submit an opt-out request, contact{' '}
          <a href="mailto:legal@ziggytechventures.com" style={{ color: '#C9A96E' }}>legal@ziggytechventures.com</a>{' '}
          (subject: &quot;Nevada SB220 Opt-Out Request&quot;).
        </p>
      </Section>

      <Section title="8. Data Retention">
        <p style={prose}>We retain data only as long as necessary for its stated purpose or to meet legal obligations. Customer account data is retained for the duration of the subscription plus 3 years. Payment records are retained for 7 years. Usage logs are retained for 12 months rolling. Upon subscription termination, customer-uploaded data is deleted within 30 days.</p>
      </Section>

      <Section title="9. Data Security">
        <p style={prose}>We implement commercially reasonable safeguards including TLS 1.2+ encryption in transit, AES-256 encryption at rest, role-based access controls, multi-factor authentication for administrative access, and regular security assessments. No system is perfectly secure.</p>
      </Section>

      <Section title="10. Children's Privacy">
        <p style={prose}>Our Services are designed for business use by adults. We do not knowingly collect personal information from individuals under 13.</p>
      </Section>

      <Section title="11. Changes to This Policy">
        <p style={prose}>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy with a new &quot;Last Updated&quot; date, and by email or in-app notification.</p>
      </Section>

      <Section title="12. Contact Us">
        <p style={prose}>
          <strong style={{ color: 'var(--text)' }}>ZiggyTech Ventures LLC</strong><br />
          Privacy &amp; Legal Affairs<br />
          Email: <a href="mailto:legal@ziggytechventures.com" style={{ color: '#C9A96E' }}>legal@ziggytechventures.com</a><br />
          Las Vegas, Nevada
        </p>
      </Section>
    </div>
  )
}
