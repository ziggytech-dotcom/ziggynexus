import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — ZiggyNexus",
  description:
    "Explore every ZiggyNexus feature: branded portals, online invoicing, secure file sharing, e-sign contracts, client messaging, and onboarding wizards.",
};

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Branded White-Label Portals",
    tagline: "Your brand. Your client's experience.",
    description:
      "Every client you add to ZiggyNexus gets their own dedicated portal — and it looks nothing like a generic SaaS dashboard. Upload your logo, set your brand colors, and use your custom domain. Your clients see your business, not ours.",
    benefits: [
      "Custom domain support (e.g. portal.youragency.com)",
      "Per-client branding with logo and color themes",
      "White-label email notifications sent from your domain",
      "No ZiggyNexus branding visible to your clients",
      "Isolated workspaces — each client only sees their own data",
    ],
    accent: "Build trust with a professional, cohesive brand experience at every touchpoint.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Online Invoicing",
    tagline: "Send. Get paid. Move on.",
    description:
      "Create professional invoices in seconds directly from your ZiggyNexus dashboard. Clients receive a branded invoice in their portal and can pay with a card, bank transfer, or other methods — no login friction, no chasing.",
    benefits: [
      "Create invoices with line items, taxes, and discounts",
      "Stripe-powered card and ACH bank transfer payments",
      "Automatic payment reminders at 7, 3, and 1 day before due",
      "Overdue reminders sent automatically so you don't have to",
      "Invoice history and downloadable PDFs for your records",
      "Real-time payment notifications",
    ],
    accent: "Clients pay up to 3x faster when invoices live inside a portal they already trust.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Secure File Sharing",
    tagline: "No more Google Drive links.",
    description:
      "Share deliverables, proposals, reports, and assets through a purpose-built file manager with access controls baked in. Every file is encrypted at rest and in transit. No expiring links, no permission confusion.",
    benefits: [
      "AES-256 encryption at rest, TLS in transit",
      "Folder organization per client portal",
      "Download-only or view-only permission modes",
      "File version history to track changes over time",
      "Upload requests — ask clients to upload documents directly",
      "No storage limits on Business plan",
    ],
    accent: "Clients never see other clients' files. Isolation is built into every portal.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "E-Sign Contracts",
    tagline: "Signatures in minutes, not days.",
    description:
      "Upload any contract, proposal, or agreement and send it for signature directly through ZiggyNexus. Clients sign with a legally-binding electronic signature right inside their portal — no DocuSign account required on their end.",
    benefits: [
      "Legally binding e-signatures compliant with ESIGN Act and eIDAS",
      "Signature audit trail with timestamps and IP logs",
      "Automatic reminders for unsigned documents",
      "Signed PDF automatically stored in the client's file area",
      "Multiple signers supported on a single document",
      "Template library for frequently-used contracts",
    ],
    accent: "Average signature turnaround drops from 4.2 days to under 3 hours.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Client Messaging",
    tagline: "One thread per client. Zero confusion.",
    description:
      "Replace scattered email threads, DMs, and text messages with a single, organized inbox per client. Conversations are context-aware — clients can reference files, invoices, and contracts directly in a message thread.",
    benefits: [
      "Threaded, organized conversations per client portal",
      "Rich text formatting, file attachments inline",
      "Email notifications for new messages (from your domain)",
      "Read receipts so you know when a client has seen your message",
      "Internal notes visible only to your team, not the client",
      "Full message history exportable for your records",
    ],
    accent: "Your clients stay in one place instead of hunting through old email chains.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: "Onboarding Wizard",
    tagline: "First impressions that run themselves.",
    description:
      "Build a structured onboarding flow once, then deploy it to every new client automatically. Collect intake forms, request documents, prompt signatures, and set clear next steps — without a single back-and-forth email.",
    benefits: [
      "Drag-and-drop onboarding step builder",
      "Conditional steps based on client type or service package",
      "Intake forms with custom fields and validation",
      "Automatic task assignments to your team on completion",
      "Progress tracker visible to both you and the client",
      "Reusable templates for different service types",
    ],
    accent: "Cut new client setup time from hours to minutes with a repeatable process.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-[#0f0a0a]">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative text-center">
          <div className="inline-flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
            6 powerful features, one flat price
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Built for how service{" "}
            <span className="text-emerald-500">businesses actually work</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Every feature in ZiggyNexus was designed around real workflows from
            agencies, consultants, and service businesses — not enterprise
            bloat.
          </p>
          <a
            href="https://app.ziggynexus.com/signup"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center gap-2"
          >
            Try all features free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 md:p-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                    {feature.icon}
                  </div>
                  <div className="text-sm text-emerald-500 font-medium mb-2 uppercase tracking-wide">
                    Feature {String(index + 1).padStart(2, "0")}
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{feature.title}</h2>
                  <p className="text-zinc-400 text-lg mb-4 italic">{feature.tagline}</p>
                  <p className="text-zinc-300 leading-relaxed">{feature.description}</p>
                  <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <p className="text-emerald-400 text-sm">{feature.accent}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
                    What&apos;s included
                  </h3>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-zinc-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            All six features. One price.
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            $39/mo unlocks everything. No feature gating, no per-seat fees, no
            add-ons.
          </p>
          <a
            href="https://app.ziggynexus.com/signup"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center gap-2"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <p className="text-zinc-600 text-sm mt-4">
            14-day free trial &middot; No credit card required
          </p>
        </div>
      </section>
    </div>
  );
}
