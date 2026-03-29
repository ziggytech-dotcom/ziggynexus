import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service — ZiggyNexus',
  description: 'The terms and conditions governing your use of the ZiggyTech Business Suite.',
}

export default function TermsPage() {
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
              Terms of Service
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

          <TermsContent />
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

const caps: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(245,240,232,0.60)',
  lineHeight: 1.7,
  marginBottom: '12px',
  fontWeight: 600,
}

function TermsContent() {
  return (
    <div>
      <Section title="1. Agreement to Terms">
        <p style={prose}>
          These Terms of Service constitute a legally binding agreement between you (the business entity or individual, &quot;Customer&quot;) and <strong style={{ color: 'var(--text)' }}>ZiggyTech Ventures LLC</strong>, a Nevada LLC (EIN: 41-4738365). By accessing or using any product within the ZiggyTech Business Suite, you agree to be bound by these Terms.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text)' }}>If you do not agree to these Terms, you must not access or use our Services.</strong> If you are entering into these Terms on behalf of a business entity, you represent that you have the authority to bind that entity.
        </p>
      </Section>

      <Section title="2. Description of Services">
        <p style={prose}>ZiggyTech provides a suite of B2B SaaS products including: ZiggyHQ (CRM), ZiggyDocs (document management & e-signature), ZiggyNexus (team collaboration), ZiggySchedule (appointment booking), ZiggyPayroll (payroll processing), ZiggyPitch (proposal builder), ZiggyHR (HR management), ZiggyReviews (reputation management), ZiggyInvoice (billing), and ZiggyIntake (client intake).</p>
      </Section>

      <Section title="3. Account Registration and Eligibility">
        <p style={prose}>You must be at least 18 years of age and have the legal capacity to enter into contracts. Our Services are intended for business use only — not personal, family, or household use.</p>
        <p style={prose}>You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. Notify us immediately at <a href="mailto:legal@ziggytechventures.com" style={{ color: '#C9A96E' }}>legal@ziggytechventures.com</a> if you suspect unauthorized access.</p>
      </Section>

      <Section title="4. Subscription, Billing & Refunds">
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          {[
            'Subscriptions are billed monthly or annually as selected at signup.',
            'Subscriptions auto-renew at the end of each billing period unless cancelled.',
            'Failed payments: we attempt collection up to 3 times; non-payment may result in suspension after 10 days\' notice.',
            'Annual refunds: may be issued within 30 days of annual billing, minus usage fees. After 30 days, non-refundable.',
            'Monthly fees: non-refundable once charged.',
          ].map((item) => (
            <li key={item} style={li}>{item}</li>
          ))}
        </ul>
        <p style={prose}>You may cancel at any time through your account settings. Cancellation takes effect at the end of the current billing period.</p>
      </Section>

      <Section title="5. Acceptable Use Policy">
        <p style={prose}>You may use the Services only for lawful business purposes. You agree not to:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          {[
            'Violate any applicable law or regulation',
            'Infringe any intellectual property or privacy rights',
            'Introduce malware or attempt to circumvent security controls',
            'Send unsolicited communications in violation of CAN-SPAM or TCPA',
            'Resell or sublicense access to the Services without written authorization',
            'Use ZiggyPayroll or ZiggyHR to facilitate illegal worker misclassification',
            'Process sensitive data (SSNs, health data, payment cards) in products not configured for such use',
          ].map((item) => (
            <li key={item} style={li}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="6. Data Processing">
        <p style={prose}>To the extent you upload personal data of third parties to our Services, ZiggyTech acts as a <strong style={{ color: 'var(--text)' }}>data processor</strong> processing such data on your behalf under our Data Processing Agreement (DPA). You, as the data controller, are responsible for ensuring your collection and provision of such data complies with all applicable privacy laws.</p>
        <p style={prose}>Contact <a href="mailto:legal@ziggytechventures.com" style={{ color: '#C9A96E' }}>legal@ziggytechventures.com</a> to obtain or execute a standalone DPA.</p>
      </Section>

      <Section title="7. ESIGN Act Consent">
        <p style={prose}>By accepting these Terms, you consent to receive electronic records and to use electronic signatures in connection with your account and the Services, in accordance with the ESIGN Act (15 U.S.C. § 7001 et seq.) and Nevada&apos;s UETA (NRS Chapter 719). Electronic signatures have the same legal effect as handwritten signatures.</p>
        <p style={prose}>You may withdraw consent to electronic records by notifying us at <a href="mailto:legal@ziggytechventures.com" style={{ color: '#C9A96E' }}>legal@ziggytechventures.com</a>. Withdrawal may result in limited access to certain Services.</p>
      </Section>

      <Section title="8. ZiggyPayroll — Important Disclaimers">
        <p style={prose}><strong style={{ color: 'var(--text)' }}>ZiggyTech is a software platform provider, not a licensed tax advisor, accountant, or PEO.</strong> You are solely responsible for accurate and timely filing of all federal, state, and local tax forms, including W-2, 1099-NEC, Form 941, and applicable state equivalents. ZiggyTech is not liable for any tax penalties resulting from inaccurate or untimely filings.</p>
        <p style={prose}><strong style={{ color: 'var(--text)' }}>Worker Classification:</strong> ZiggyTech does not provide legal advice on employee vs. contractor classification. Misclassification can result in significant tax liability and legal exposure. Consult a licensed employment attorney before classifying workers.</p>
      </Section>

      <Section title="9. Intellectual Property">
        <p style={prose}>All IP rights in the Services remain with ZiggyTech Ventures LLC. You retain all rights to data you upload (&quot;Customer Data&quot;). You grant ZiggyTech a limited license to process Customer Data solely to provide the Services.</p>
      </Section>

      <Section title="10. Warranty Disclaimer">
        <p style={caps}>THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND. ZIGGYTECH EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. ZIGGYTECH DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.</p>
      </Section>

      <Section title="11. Limitation of Liability">
        <p style={caps}>TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZIGGYTECH&apos;S TOTAL LIABILITY FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE GREATER OF: (A) AMOUNTS PAID BY YOU IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR (B) $100.00 USD. ZIGGYTECH IS NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>
      </Section>

      <Section title="12. Governing Law & Dispute Resolution">
        <p style={prose}>These Terms are governed by the laws of the <strong style={{ color: 'var(--text)' }}>State of Nevada</strong>. Before filing formal legal claims, the parties agree to attempt informal resolution for 30 days. Any legal proceedings shall be brought exclusively in the state or federal courts of Clark County, Nevada.</p>
      </Section>

      <Section title="13. Contact Information">
        <p style={prose}>
          <strong style={{ color: 'var(--text)' }}>ZiggyTech Ventures LLC</strong><br />
          Legal &amp; Compliance<br />
          Email: <a href="mailto:legal@ziggytechventures.com" style={{ color: '#C9A96E' }}>legal@ziggytechventures.com</a><br />
          Las Vegas, Nevada
        </p>
        <p style={prose}>
          Also see our{' '}
          <Link href="/privacy" style={{ color: '#C9A96E', textDecoration: 'underline' }}>Privacy Policy</Link>
          {' '}and{' '}
          <Link href="/cookies" style={{ color: '#C9A96E', textDecoration: 'underline' }}>Cookie Policy</Link>.
        </p>
      </Section>
    </div>
  )
}
