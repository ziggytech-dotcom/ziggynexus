import Script from "next/script"

const ACCENT = "#10b981"
const ACCENT_BG = "rgba(14,165,233,0.1)"
const ACCENT_BORDER = "rgba(14,165,233,0.25)"
const ACCENT_DIM = "rgba(14,165,233,0.03)"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "ZiggyNexus",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": "https://ziggynexus.com",
      "description": "Client portal and collaboration hub for service businesses. Branded portals, secure file sharing, e-sign contracts, messaging, and invoicing — all for $39/mo.",
      "offers": {
        "@type": "Offer",
        "price": "39.00",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "39.00",
          "priceCurrency": "USD",
          "unitText": "MONTH",
          "description": "Base plan — 5 seats included. Additional seats $12/seat/mo."
        }
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does ZiggyNexus cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ZiggyNexus is $39/mo and includes 5 seats. Need more team members? Add seats for $12/seat/mo. No tiers, no annual lock-in, no surprise fees."
          }
        },
        {
          "@type": "Question",
          "name": "How many clients can I add to my portal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unlimited. Every plan includes unlimited client portals. There are no per-client fees or limits on how many portals you can create."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use my own domain for client portals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Every portal is white-labeled with your branding — your logo, your colors, your custom domain. Clients see your brand, not ZiggyNexus."
          }
        },
        {
          "@type": "Question",
          "name": "How does the free trial work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You get 14 days free — no credit card required. Full access to all live features from day one. If it's not for you, just walk away."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need DocuSign for contract signing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. ZiggyNexus includes built-in e-signature — no DocuSign, no HelloSign, no add-ons. Send a contract, get it signed, store it in the portal. Done."
          }
        },
        {
          "@type": "Question",
          "name": "How does payment collection work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ZiggyNexus connects to Stripe. Send an invoice from inside the portal and your client pays via card or ACH — directly from their portal login. Funds go straight to your Stripe account."
          }
        }
      ]
    }
  ]
}

export default function Home() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`@media(max-width:768px){.nav-links{display:none}}`}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1f1f1f",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: 1120,
          margin: "0 auto",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
            Ziggy<span style={{ color: ACCENT }}>Nexus</span>
          </a>

          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ display: "flex", gap: 28 }}>
              {[
                ["Features", "#features"],
                ["Compare", "/vs/copilot"],
                ["Pricing", "#pricing"],
                ["Sign In", "https://app.ziggynexus.com/login"],
              ].map(([label, href]) => (
                <a key={label} href={href} style={{ color: "#888", fontSize: 15, fontWeight: 500 }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <a href="https://app.ziggynexus.com/signup" style={{
            background: ACCENT,
            color: "#fff",
            padding: "9px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}>
            Start Free Trial
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        padding: "100px 24px 80px",
        textAlign: "center",
        maxWidth: 820,
        margin: "0 auto",
      }}>
        <div style={{
          display: "inline-block",
          background: ACCENT_BG,
          border: `1px solid ${ACCENT_BORDER}`,
          borderRadius: 99,
          padding: "6px 16px",
          fontSize: 13,
          color: ACCENT,
          fontWeight: 600,
          marginBottom: 28,
          letterSpacing: "0.02em",
        }}>
          Copilot Alternative · 89% cheaper for a team
        </div>

        <h1 style={{
          fontSize: "clamp(42px, 6vw, 68px)",
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: "-1.5px",
          marginBottom: 24,
          color: "#fff",
        }}>
          One portal. Every client.<br />
          <span style={{
            background: `linear-gradient(135deg, #fff 0%, ${ACCENT} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Everything in one place.</span>
        </h1>

        <p style={{ fontSize: 19, color: "#888", lineHeight: 1.6, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
          Stop managing clients over email, Slack, and Google Drive. Give every client a branded portal — with file sharing, e-sign contracts, messaging, and invoicing — for <strong style={{ color: "#fff" }}>$39/mo</strong>.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <a href="https://app.ziggynexus.com/signup" style={{
            background: ACCENT,
            color: "#fff",
            padding: "15px 30px",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
          }}>
            Start Free Trial — 14 days free
          </a>
          <a href="#pricing" style={{
            background: "transparent",
            color: "#fff",
            padding: "15px 30px",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
            border: "1px solid #333",
          }}>
            See Pricing
          </a>
        </div>

        <p style={{ fontSize: 13, color: "#555", letterSpacing: "0.03em" }}>
          No credit card · 14-day free trial · Unlimited client portals
        </p>

        {/* Trust badges */}
        <div style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 40,
        }}>
          {[
            "✅ 5 seats included at $39/mo",
            "🔒 White-label your own domain",
            "✍️ Built-in e-sign — no DocuSign",
          ].map(badge => (
            <span key={badge} style={{
              fontSize: 13,
              color: "#666",
              background: "#111",
              border: "1px solid #1f1f1f",
              borderRadius: 8,
              padding: "8px 14px",
            }}>
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* ── PROBLEM STRIP ── */}
      <section style={{
        background: "#0f0f0f",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
        padding: "56px 24px",
      }}>
        <div style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 32,
          textAlign: "center",
        }}>
          {[
            {
              emoji: "📧",
              headline: "Email is not a client portal.",
              body: "Files buried in threads, contracts sent back and forth as attachments, clients asking \"where's the doc?\" — sound familiar? There's a better way.",
            },
            {
              emoji: "🔗",
              headline: "Link chaos is real.",
              body: "Google Drive here, Dropbox there, DocuSign over there, a Slack channel, and an invoice in your email. Your clients deserve a single place for everything.",
            },
            {
              emoji: "💸",
              headline: "Copilot charges $69 per seat.",
              body: "A 5-person agency pays $345/mo just for client portals. That's insane. ZiggyNexus includes 5 seats at $39/mo — same experience, fraction of the cost.",
            },
          ].map(({ emoji, headline, body }) => (
            <div key={headline}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{headline}</h3>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "96px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: 16 }}>
            Everything your clients need. All in one place.
          </h2>
          <p style={{ fontSize: 17, color: "#666", maxWidth: 520, margin: "0 auto" }}>
            One login for your client. One dashboard for your team. No more juggling five different tools.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {[
            {
              icon: "🏷️",
              title: "Branded Client Portal",
              desc: "Your logo, your domain, your colors. Every client gets their own white-labeled portal — it looks and feels like an extension of your business, not a third-party tool.",
            },
            {
              icon: "📁",
              title: "Secure File Sharing",
              desc: "Share deliverables, reports, and documents through encrypted storage. Clients upload files to you too. No more Google Drive links, email attachments, or lost files.",
            },
            {
              icon: "💬",
              title: "Built-in Messaging",
              desc: "All client communication in one thread, inside the portal. No more scattered Slack DMs, email chains, and WhatsApp messages. One conversation. Always findable.",
            },
            {
              icon: "✍️",
              title: "E-Sign Contracts",
              desc: "Send contracts for legally binding electronic signature — built right in. No DocuSign, no HelloSign, no add-ons. Track who signed, who viewed, who declined.",
            },
            {
              icon: "💳",
              title: "Invoicing & Payments",
              desc: "Send invoices and collect payment via Stripe — directly inside the client's portal. Card and ACH accepted. Funds go straight to your account.",
            },
            {
              icon: "📊",
              title: "Project Status Updates",
              desc: "Clients see progress without you sending a weekly email. Update milestones and statuses inside the portal — clients log in and see what's done and what's next.",
            },
            {
              icon: "📋",
              title: "Intake Forms",
              desc: "Collect project briefs, onboarding info, creative assets, and approvals — all through structured forms inside the portal. No more back-and-forth for basic info.",
            },
            {
              icon: "📚",
              title: "Knowledge Base",
              desc: "Build a resource hub inside each portal. Share SOPs, FAQs, guides, how-to videos, and brand assets. Clients self-serve instead of pinging you.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: "#111111",
              border: "1px solid #1f1f1f",
              borderRadius: 14,
              padding: "28px 24px",
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMING SOON STRIP ── */}
      <section style={{
        background: "#0d0d0d",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>What's coming next</h2>
            <p style={{ color: "#555", fontSize: 15 }}>We ship fast. Here's what's already in the pipeline.</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}>
            {[
              {
                icon: "🎥",
                title: "Video Updates",
                badge: "Coming Soon",
                badgeColor: "#0066ff",
                desc: "Record short video messages for clients — right inside the portal. No Loom account needed.",
              },
              {
                icon: "⭐",
                title: "Client Satisfaction Surveys",
                badge: "Coming Soon",
                badgeColor: "#0066ff",
                desc: "Automated NPS and satisfaction check-ins after project milestones. Know how your clients feel before they churn.",
              },
              {
                icon: "⚡",
                title: "Zapier Integration",
                badge: "Coming Soon",
                badgeColor: "#0066ff",
                desc: "Connect ZiggyNexus to thousands of tools via Zapier. Automate onboarding, notifications, and more.",
              },
            ].map(({ icon, title, badge, badgeColor, desc }) => (
              <div key={title} style={{
                background: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: 14,
                padding: "24px 22px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{icon}</span>
                  <span style={{
                    background: `${badgeColor}20`,
                    color: badgeColor,
                    border: `1px solid ${badgeColor}40`,
                    borderRadius: 99,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase" as const,
                  }}>{badge}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginTop: 6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section style={{
        padding: "96px 24px",
        background: "#080808",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: 14 }}>
              Built for your industry
            </h2>
            <p style={{ fontSize: 17, color: "#666", maxWidth: 520, margin: "0 auto" }}>
              Whether you run an agency, a consultancy, or a coaching practice — ZiggyNexus fits your workflow.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}>
            {[
              { icon: "🎨", name: "Marketing & Creative Agencies", desc: "Client portals for every account — campaign files, approvals, deliverables, and reporting in one place." },
              { icon: "💻", name: "Web & Dev Agencies", desc: "Project portals with staging links, dev updates, feedback loops, and final file delivery." },
              { icon: "💼", name: "Consultants & Advisors", desc: "Deliverable sharing, meeting notes, strategy docs, and engagement contracts — all client-facing." },
              { icon: "🎓", name: "Coaches & Course Creators", desc: "Student portals with homework submission, course materials, progress tracking, and session notes." },
              { icon: "🏠", name: "Real Estate Agencies", desc: "Transaction portals with document collection, inspection reports, and milestone updates for buyers and sellers." },
              { icon: "📊", name: "Accounting & Finance", desc: "Secure document exchange for tax docs, statements, and reports — with built-in messaging for client queries." },
              { icon: "🏗️", name: "Architects & Interior Design", desc: "Design reviews, mood boards, project timelines, material approvals, and contractor coordination." },
              { icon: "🎯", name: "PR & Communications", desc: "Campaign portals with press materials, media kits, coverage reports, and approval workflows." },
            ].map(({ icon, name, desc }) => (
              <div key={name} style={{
                background: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: 14,
                padding: "24px 22px",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}>
                <span style={{ fontSize: 32, flexShrink: 0, lineHeight: 1 }}>{icon}</span>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{name}</h3>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.55, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Custom callout */}
          <div style={{
            background: ACCENT_BG,
            border: `1px solid ${ACCENT_BORDER}`,
            borderRadius: 14,
            padding: "32px 36px",
            display: "flex",
            flexWrap: "wrap" as const,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Don't see your industry?</h3>
              <p style={{ fontSize: 15, color: "#888", maxWidth: 480, lineHeight: 1.6, margin: 0 }}>
                ZiggyNexus works for any service business managing ongoing clients. Every plan includes onboarding support to get your portals set up right.
              </p>
            </div>
            <a href="mailto:hello@ziggynexus.com" style={{
              background: ACCENT,
              color: "#fff",
              padding: "13px 26px",
              borderRadius: 9,
              fontSize: 15,
              fontWeight: 600,
              whiteSpace: "nowrap" as const,
              flexShrink: 0,
            }}>
              Contact Us →
            </a>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ padding: "96px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.8px", marginBottom: 12 }}>
            ZiggyNexus vs Copilot
          </h2>
          <p style={{ color: "#666", fontSize: 16 }}>
            Same client portal experience. 89% cheaper for a team.
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "14px 20px", color: "#555", fontWeight: 600, fontSize: 13, borderBottom: "1px solid #1f1f1f" }}>Feature</th>
                <th style={{ textAlign: "center", padding: "14px 20px", color: ACCENT, fontWeight: 700, fontSize: 15, borderBottom: "1px solid #1f1f1f", background: ACCENT_DIM }}>ZiggyNexus</th>
                <th style={{ textAlign: "center", padding: "14px 20px", color: "#555", fontWeight: 600, fontSize: 13, borderBottom: "1px solid #1f1f1f" }}>Copilot</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Price", "$39/mo", "$69/mo per seat"],
                ["Seats included", "5 seats", "1 seat"],
                ["5-person team cost", "$39/mo total", "$345/mo total"],
                ["Client portals", "✅ Unlimited", "✅ Unlimited"],
                ["White-label domain", "✅ Yes", "✅ Yes"],
                ["Secure file sharing", "✅ Yes", "✅ Yes"],
                ["Built-in messaging", "✅ Yes", "✅ Yes"],
                ["E-sign contracts", "✅ Built-in", "✅ Built-in"],
                ["Invoicing & payments", "✅ Via Stripe", "✅ Via Stripe"],
                ["Intake forms", "✅ Yes", "✅ Yes"],
                ["Knowledge base", "✅ Yes", "✅ Yes"],
                ["Video updates", "🔧 Coming Soon", "✅ Yes"],
                ["Contract required", "No — cancel anytime", "No"],
              ].map(([feature, nexus, copilot], i) => (
                <tr key={feature} style={{ background: i % 2 === 0 ? "transparent" : "#0d0d0d" }}>
                  <td style={{ padding: "14px 20px", color: "#888", borderBottom: "1px solid #161616" }}>{feature}</td>
                  <td style={{ padding: "14px 20px", color: "#fff", textAlign: "center", borderBottom: "1px solid #161616", background: ACCENT_DIM, fontWeight: 500 }}>{nexus}</td>
                  <td style={{ padding: "14px 20px", color: "#555", textAlign: "center", borderBottom: "1px solid #161616" }}>{copilot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          marginTop: 24,
          background: ACCENT_BG,
          border: `1px solid ${ACCENT_BORDER}`,
          borderRadius: 12,
          padding: "20px 24px",
          textAlign: "center",
        }}>
          <p style={{ color: "#ccc", fontSize: 15, lineHeight: 1.7 }}>
            💡 <strong style={{ color: "#fff" }}>Bottom line:</strong> Copilot charges $69/mo for 1 seat — a 5-person team is $345/mo. ZiggyNexus includes 5 seats at $39/mo. Same client portal experience, <strong style={{ color: ACCENT }}>89% cheaper for a team.</strong>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#444" }}>
          Pricing data sourced from Copilot.com · Updated March 2026
        </p>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{
        padding: "96px 24px",
        background: "#080808",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
      }}>
        <div style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.8px", marginBottom: 12 }}>
            Simple pricing. No per-seat games.
          </h2>
          <p style={{ color: "#666", fontSize: 16, marginBottom: 48 }}>
            One plan. Five seats included. Scales with your team.
          </p>

          <div style={{
            background: "#111111",
            border: `2px solid ${ACCENT}`,
            borderRadius: 20,
            padding: "40px 36px",
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 12 }}>
              ZiggyNexus — Base Plan
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 64, fontWeight: 700, color: "#fff", letterSpacing: "-2px" }}>$39</span>
              <span style={{ fontSize: 18, color: "#555" }}>/mo</span>
            </div>
            <p style={{ color: "#555", fontSize: 14, marginBottom: 32 }}>
              5 seats included · +$12/seat/mo after that
            </p>

            <ul style={{ listStyle: "none", padding: 0, marginBottom: 32, textAlign: "left" }}>
              {[
                "Unlimited client portals",
                "Branded white-label portal (your domain)",
                "Secure file sharing",
                "Built-in client messaging",
                "E-sign contracts (no DocuSign needed)",
                "Invoicing & Stripe payment collection",
                "Project status updates",
                "Intake forms",
                "Knowledge base / resource hub",
                "5 team seats included",
              ].map(item => (
                <li key={item} style={{ padding: "7px 0", fontSize: 15, color: "#ccc", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                </li>
              ))}
            </ul>

            <a href="https://app.ziggynexus.com/signup" style={{
              display: "block",
              background: ACCENT,
              color: "#fff",
              padding: "16px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
            }}>
              Start Free Trial — No credit card required
            </a>
          </div>

          {/* Bundle callout */}
          <div style={{
            background: "#111111",
            border: "1px solid #1f1f1f",
            borderRadius: 14,
            padding: "22px 24px",
            textAlign: "center",
          }}>
            <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>
              🏢 <strong style={{ color: "#fff" }}>Running a full business?</strong> Get all ZiggyTech apps — including ZiggyNexus — for a flat monthly rate with the ZiggyTech Business Suite.{" "}
              <a href="https://ziggybusiness.com" style={{ color: ACCENT, textDecoration: "underline" }}>Learn more →</a>
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "96px 24px", maxWidth: 740, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.6px", marginBottom: 48, textAlign: "center" }}>
          Questions? We've got answers.
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            {
              q: "How much does ZiggyNexus cost?",
              a: "$39/mo. That includes 5 seats. Need more people on your team? Add seats for $12/seat/mo. No tiers, no annual lock-in, no surprise fees.",
            },
            {
              q: "How many clients can I add?",
              a: "Unlimited. Every plan includes unlimited client portals. There are no caps on how many portals you can create or how many clients you can serve.",
            },
            {
              q: "Can I use my own domain for client portals?",
              a: "Yes. Every portal is white-labeled with your branding — your logo, your colors, and your custom domain. Clients see your brand, not ZiggyNexus.",
            },
            {
              q: "How does the free trial work?",
              a: "Sign up and get 14 days free — no credit card required. Full access to every live feature from day one. If it's not for you, just walk away. Nothing to cancel.",
            },
            {
              q: "Do I need DocuSign for contract signing?",
              a: "No. E-signature is built right into ZiggyNexus. Send a contract, get it signed, and it's stored in the portal forever. No add-ons, no third-party accounts.",
            },
            {
              q: "How does payment collection work?",
              a: "ZiggyNexus connects to Stripe. Send an invoice from inside the portal and your client pays via card or ACH — directly from their portal login. Funds hit your Stripe account automatically.",
            },
          ].map(({ q, a }) => (
            <details key={q} style={{
              background: "#111111",
              border: "1px solid #1f1f1f",
              borderRadius: 10,
              overflow: "hidden",
            }}>
              <summary style={{
                padding: "20px 24px",
                fontSize: 16,
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                {q}
                <span style={{ color: ACCENT, fontSize: 20, fontWeight: 400, flexShrink: 0 }}>+</span>
              </summary>
              <div style={{ padding: "0 24px 20px", fontSize: 15, color: "#777", lineHeight: 1.7, borderTop: "1px solid #1a1a1a" }}>
                <p style={{ marginTop: 16 }}>{a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        padding: "100px 24px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0a0a0a 0%, #050d10 100%)",
        borderTop: "1px solid #1f1f1f",
      }}>
        <h2 style={{
          fontSize: "clamp(36px, 5vw, 58px)",
          fontWeight: 700,
          letterSpacing: "-1.5px",
          marginBottom: 20,
          lineHeight: 1.1,
        }}>
          Your clients deserve better<br />
          <span style={{
            background: `linear-gradient(135deg, #fff 0%, ${ACCENT} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>than your inbox.</span>
        </h2>
        <p style={{ fontSize: 18, color: "#555", marginBottom: 40 }}>
          14 days free. No credit card. Unlimited portals from day one.
        </p>
        <a href="https://app.ziggynexus.com/signup" style={{
          display: "inline-block",
          background: ACCENT,
          color: "#fff",
          padding: "18px 40px",
          borderRadius: 12,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.2px",
        }}>
          Start Free Trial →
        </a>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#050505",
        borderTop: "1px solid #111",
        padding: "40px 24px",
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          textAlign: "center",
        }}>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" as const, justifyContent: "center" }}>
            {[
              ["Home", "/"],
              ["Features", "#features"],
              ["Compare", "/vs/copilot"],
              ["Pricing", "#pricing"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Sign In", "https://app.ziggynexus.com/login"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ color: "#555", fontSize: 14, fontWeight: 500 }}>
                {label}
              </a>
            ))}
          </div>

          <p style={{ fontSize: 13, color: "#333" }}>
            Part of{" "}
            <a href="https://ziggybusiness.com" style={{ color: "#555" }}>ZiggyTech Business Suite</a>
            {" · "}
            <a href="https://ziggybusiness.com" style={{ color: "#555" }}>ziggybusiness.com</a>
          </p>

          <p style={{ fontSize: 13, color: "#2a2a2a" }}>
            © 2026 ZiggyNexus. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
