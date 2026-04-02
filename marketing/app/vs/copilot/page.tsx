import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ZiggyNexus vs Copilot — 89% cheaper for a team | ZiggyNexus",
  description:
    "Copilot charges $69/mo per seat. A 5-person team pays $345/mo. ZiggyNexus gives you 5 seats at $39/mo — same client portal experience, a fraction of the cost.",
}

const ACCENT = "#10b981"
const ACCENT_BG = "rgba(14,165,233,0.1)"
const ACCENT_BORDER = "rgba(14,165,233,0.25)"

export default function VsCopilot() {
  return (
    <>
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
          <div className="nav-links" style={{ display: "flex", gap: 28 }}>
            {[["Features", "/#features"], ["Pricing", "/#pricing"], ["Sign In", "https://app.ziggynexus.com/login"]].map(([l, h]) => (
              <a key={l} href={h} style={{ color: "#888", fontSize: 15, fontWeight: 500 }}>{l}</a>
            ))}
          </div>
          <a href="https://app.ziggynexus.com/signup" style={{
            background: ACCENT, color: "#fff", padding: "9px 20px",
            borderRadius: 8, fontSize: 14, fontWeight: 600,
          }}>
            Start Free Trial
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
        <div style={{
          display: "inline-block",
          background: ACCENT_BG,
          border: `1px solid ${ACCENT_BORDER}`,
          borderRadius: 99,
          padding: "6px 16px",
          fontSize: 13,
          color: ACCENT,
          fontWeight: 600,
          marginBottom: 24,
          letterSpacing: "0.02em",
        }}>
          ZiggyNexus vs Copilot
        </div>

        <h1 style={{
          fontSize: "clamp(38px, 5vw, 60px)",
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "-1.5px",
          marginBottom: 24,
          color: "#fff",
        }}>
          Copilot charges $69/mo per seat.<br />
          <span style={{
            background: `linear-gradient(135deg, #fff 0%, ${ACCENT} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>We include 5 seats for $39.</span>
        </h1>

        <p style={{ fontSize: 18, color: "#888", lineHeight: 1.6, marginBottom: 36, maxWidth: 600, margin: "0 auto 36px" }}>
          A 5-person agency on Copilot pays $345/mo. On ZiggyNexus, that same team pays $39/mo — and gets the same client portal experience. That's <strong style={{ color: "#fff" }}>$3,672 saved per year.</strong>
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://app.ziggynexus.com/signup" style={{
            background: ACCENT, color: "#fff", padding: "15px 30px",
            borderRadius: 10, fontSize: 16, fontWeight: 600,
          }}>
            Start Free Trial — $39/mo
          </a>
          <a href="/#pricing" style={{
            background: "transparent", color: "#fff", padding: "15px 30px",
            borderRadius: 10, fontSize: 16, fontWeight: 600,
            border: "1px solid #333",
          }}>
            See Full Pricing
          </a>
        </div>
      </section>

      {/* ── COST COMPARISON CALLOUT ── */}
      <section style={{ padding: "0 24px 80px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}>
          <div style={{
            background: "#111111",
            border: `2px solid ${ACCENT}`,
            borderRadius: 16,
            padding: "32px 28px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 12 }}>
              ZiggyNexus
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#fff", letterSpacing: "-1px", marginBottom: 4 }}>$39</div>
            <div style={{ color: "#555", fontSize: 14, marginBottom: 16 }}>/mo · 5 seats included</div>
            <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
              {[
                "✓ Unlimited client portals",
                "✓ White-label + custom domain",
                "✓ File sharing, messaging, e-sign",
                "✓ Invoicing via Stripe",
                "✓ Intake forms + knowledge base",
                "✓ 5 seats, no per-seat fee",
              ].map(item => (
                <li key={item} style={{ padding: "5px 0", fontSize: 14, color: "#ccc", display: "flex", gap: 8 }}>
                  <span style={{ color: ACCENT, flexShrink: 0 }}>{item.slice(0, 1)}</span>
                  {item.slice(1)}
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            background: "#0d0d0d",
            border: "1px solid #222",
            borderRadius: 16,
            padding: "32px 28px",
            textAlign: "center",
            opacity: 0.8,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 12 }}>
              Copilot
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#555", letterSpacing: "-1px", marginBottom: 4 }}>$69</div>
            <div style={{ color: "#444", fontSize: 14, marginBottom: 16 }}>/mo · per seat</div>
            <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
              {[
                "✓ Client portals",
                "✓ White-label",
                "✓ File sharing, messaging, e-sign",
                "✓ Invoicing",
                "✓ Intake forms",
                "✗ $69 × 5 seats = $345/mo",
              ].map(item => (
                <li key={item} style={{ padding: "5px 0", fontSize: 14, color: item.startsWith("✗") ? "#c0392b" : "#555", display: "flex", gap: 8 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── DETAILED COMPARISON TABLE ── */}
      <section style={{
        padding: "0 24px 96px",
        maxWidth: 900,
        margin: "0 auto",
      }}>
        <h2 style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.8px", marginBottom: 40, textAlign: "center" }}>
          Feature-by-feature breakdown
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "14px 20px", color: "#555", fontWeight: 600, fontSize: 13, borderBottom: "1px solid #1f1f1f" }}>Feature</th>
                <th style={{ textAlign: "center", padding: "14px 20px", color: ACCENT, fontWeight: 700, fontSize: 15, borderBottom: "1px solid #1f1f1f", background: "rgba(14,165,233,0.04)" }}>ZiggyNexus</th>
                <th style={{ textAlign: "center", padding: "14px 20px", color: "#555", fontWeight: 600, fontSize: 13, borderBottom: "1px solid #1f1f1f" }}>Copilot</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Starting price", "$39/mo", "$69/mo"],
                ["Seats at base price", "5 seats", "1 seat"],
                ["5-person team monthly cost", "$39", "$345"],
                ["5-person team annual cost", "$468", "$4,140"],
                ["Client portals", "Unlimited", "Unlimited"],
                ["White-label portal", "✅ Yes", "✅ Yes"],
                ["Custom domain", "✅ Yes", "✅ Yes (add-on on lower tier)"],
                ["Secure file sharing", "✅ Yes", "✅ Yes"],
                ["Client messaging", "✅ Yes", "✅ Yes"],
                ["E-sign contracts", "✅ Built-in", "✅ Built-in"],
                ["Invoice & payments (Stripe)", "✅ Yes", "✅ Yes"],
                ["Project status updates", "✅ Yes", "✅ Yes"],
                ["Intake forms", "✅ Yes", "✅ Yes"],
                ["Knowledge base", "✅ Yes", "✅ Yes"],
                ["Video updates", "🔧 Coming Soon", "✅ Yes"],
                ["Zapier integration", "🔧 Coming Soon", "✅ Yes"],
                ["Annual contract required", "No", "No"],
                ["Free trial", "14 days, no credit card", "14 days"],
              ].map(([feature, nexus, copilot], i) => (
                <tr key={feature} style={{ background: i % 2 === 0 ? "transparent" : "#0d0d0d" }}>
                  <td style={{ padding: "14px 20px", color: "#888", borderBottom: "1px solid #161616" }}>{feature}</td>
                  <td style={{ padding: "14px 20px", color: "#fff", textAlign: "center", borderBottom: "1px solid #161616", background: "rgba(14,165,233,0.03)", fontWeight: 500 }}>{nexus}</td>
                  <td style={{ padding: "14px 20px", color: "#555", textAlign: "center", borderBottom: "1px solid #161616" }}>{copilot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          marginTop: 28,
          background: ACCENT_BG,
          border: `1px solid ${ACCENT_BORDER}`,
          borderRadius: 12,
          padding: "24px 28px",
          textAlign: "center",
        }}>
          <p style={{ color: "#ccc", fontSize: 16, lineHeight: 1.7 }}>
            💡 <strong style={{ color: "#fff" }}>Bottom line:</strong> Copilot charges $69/mo for 1 seat — a 5-person team is $345/mo. ZiggyNexus includes 5 seats at $39/mo. Same client portal experience,{" "}
            <strong style={{ color: ACCENT }}>89% cheaper for a team.</strong>
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        padding: "80px 24px",
        textAlign: "center",
        background: "#080808",
        borderTop: "1px solid #1f1f1f",
      }}>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 46px)",
          fontWeight: 700,
          letterSpacing: "-1px",
          marginBottom: 16,
          color: "#fff",
        }}>
          Ready to stop overpaying?
        </h2>
        <p style={{ fontSize: 17, color: "#555", marginBottom: 36 }}>
          14 days free. No credit card. 5 seats included.
        </p>
        <a href="https://app.ziggynexus.com/signup" style={{
          display: "inline-block",
          background: ACCENT,
          color: "#fff",
          padding: "16px 36px",
          borderRadius: 12,
          fontSize: 17,
          fontWeight: 700,
        }}>
          Start Free Trial — $39/mo →
        </a>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#050505", borderTop: "1px solid #111", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#333" }}>
            Part of{" "}
            <a href="https://ziggybusiness.com" style={{ color: "#555" }}>ZiggyTech Business Suite</a>
            {" · "}
            <a href="https://ziggybusiness.com" style={{ color: "#555" }}>ziggybusiness.com</a>
          </p>
          <p style={{ fontSize: 13, color: "#2a2a2a", marginTop: 8 }}>© 2026 ZiggyNexus. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
