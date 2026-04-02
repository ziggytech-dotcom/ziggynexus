import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ZiggyNexus for Service Businesses — Impress clients. Streamline operations.",
  description:
    "Service businesses use ZiggyNexus to manage client relationships, collect payments, share documents, and deliver a premium experience — all for $39/mo.",
};

const industries = [
  {
    name: "Accounting & Bookkeeping",
    description:
      "Collect financial documents securely, send engagement letters for e-signature, invoice for monthly services, and keep all client correspondence in one organized place. No more emailing spreadsheets.",
    features: ["Secure document collection", "Engagement letter e-sign", "Monthly invoicing", "Client messaging"],
  },
  {
    name: "Legal Services",
    description:
      "Share case documents securely, send retainer agreements for signature, collect intake information through a structured onboarding flow, and invoice for hourly or flat-fee services.",
    features: ["Secure file sharing", "Retainer agreement e-sign", "Structured intake", "Invoice & payment"],
  },
  {
    name: "Real Estate & Property Management",
    description:
      "Manage lease agreements, collect application documents, send maintenance updates, and keep property owners and tenants in organized communication threads.",
    features: ["Lease agreement e-sign", "Document collection", "Owner/tenant messaging", "Recurring invoicing"],
  },
  {
    name: "Health & Wellness",
    description:
      "Onboard new patients or clients with intake forms, collect health history documents, share personalized plans and resources, and invoice for packages or sessions.",
    features: ["Digital intake forms", "Plan & resource sharing", "Session invoicing", "Secure messaging"],
  },
  {
    name: "IT & Managed Services",
    description:
      "Keep clients updated with status reports, share documentation and guides, sign service agreements, and invoice for managed service retainers — all from one client workspace.",
    features: ["Status report sharing", "MSA e-sign", "Monthly retainer invoicing", "Support messaging"],
  },
  {
    name: "Event & Production Companies",
    description:
      "Collect event briefs through onboarding forms, share proposals and mood boards, send contracts for signature, and invoice deposits and final payments.",
    features: ["Event brief collection", "Proposal sharing", "Contract e-sign", "Deposit invoicing"],
  },
];

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Faster client intake",
    description:
      "Replace email intake questionnaires with a structured onboarding wizard. Clients complete it at their own pace, and you get everything you need before the first meeting.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Professional client experience",
    description:
      "A branded portal communicates that you run a polished, organized operation. Clients who feel confident in your process are more likely to refer others and renew.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Get paid on time",
    description:
      "Automatic invoice reminders mean you spend less time chasing payments and more time doing the work. Clients pay by card or bank transfer directly in their portal.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Compliant document handling",
    description:
      "AES-256 encrypted file storage with access controls means you can share sensitive documents without relying on email or consumer cloud storage. Audit trails included.",
  },
];

export default function ServiceBusinessesPage() {
  return (
    <div className="bg-[#0f0a0a]">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
              Built for service businesses
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Impress your clients.{" "}
              <span className="text-emerald-500">Streamline everything.</span>
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl">
              Service businesses of all kinds use ZiggyNexus to deliver a
              premium client experience — from the first intake form to the final
              invoice. One platform replaces email, DocuSign, Dropbox, and
              FreshBooks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://app.ziggynexus.com/signup"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center justify-center gap-2"
              >
                Get Started Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <Link
                href="/features"
                className="border border-[#27272a] hover:border-emerald-500 text-white px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center justify-center"
              >
                Explore features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#27272a] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-zinc-500 text-sm">
            <span><span className="text-emerald-500 font-bold text-lg">20+</span> service business types</span>
            <span className="text-[#27272a]">|</span>
            <span><span className="text-emerald-500 font-bold text-lg">500+</span> businesses on ZiggyNexus</span>
            <span className="text-[#27272a]">|</span>
            <span><span className="text-emerald-500 font-bold text-lg">$39</span> flat monthly price</span>
          </div>
        </div>
      </section>

      {/* Key benefits */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              What ZiggyNexus gives you
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Six integrated features that replace the patchwork of tools most
              service businesses rely on today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry use cases */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Works across every service industry</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              If you deliver services to clients, ZiggyNexus was built for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <div key={industry.name} className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 hover:border-emerald-500/40 transition-colors">
                <h3 className="font-semibold text-emerald-500 mb-3">{industry.name}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">{industry.description}</p>
                <div className="flex flex-wrap gap-2">
                  {industry.features.map((feat) => (
                    <span key={feat} className="bg-[#27272a] text-zinc-400 text-xs px-2 py-1 rounded-lg">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consolidation pitch */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Stop paying for 5 tools when 1 will do
                </h2>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  Most service businesses piece together their client workflow from
                  multiple tools. Each one adds cost, friction, and another login
                  for your clients to forget. ZiggyNexus replaces them all.
                </p>
                <a
                  href="https://app.ziggynexus.com/signup"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-xl text-sm transition-colors inline-flex items-center gap-2"
                >
                  Start Free Trial
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
              <div className="space-y-3">
                {[
                  { tool: "Google Drive / Dropbox", replaces: "Secure file sharing", cost: "$10-15/mo" },
                  { tool: "DocuSign / HelloSign", replaces: "E-sign contracts", cost: "$25-35/mo" },
                  { tool: "FreshBooks / Invoice Ninja", replaces: "Online invoicing", cost: "$17-25/mo" },
                  { tool: "Gmail threads", replaces: "Client messaging", cost: "Free but messy" },
                  { tool: "Typeform / Jotform", replaces: "Onboarding wizard", cost: "$25-50/mo" },
                ].map((item) => (
                  <div key={item.tool} className="flex items-center justify-between p-3 rounded-xl border border-[#27272a] text-sm">
                    <div>
                      <span className="text-zinc-500 line-through">{item.tool}</span>
                      <span className="text-zinc-600 mx-2">→</span>
                      <span className="text-emerald-500">{item.replaces}</span>
                    </div>
                    <span className="text-zinc-600 text-xs">{item.cost}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm">
                  <span className="font-semibold">ZiggyNexus — all of the above</span>
                  <span className="font-bold text-emerald-500">$39/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to upgrade your{" "}
            <span className="text-emerald-500">client experience?</span>
          </h2>
          <p className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto">
            Join 500+ service businesses already using ZiggyNexus. Start your
            free 14-day trial — no credit card required.
          </p>
          <a
            href="https://app.ziggynexus.com/signup"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center gap-2"
          >
            Get Started Free — $39/mo after trial
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <p className="text-zinc-600 text-sm mt-4">
            14-day free trial &middot; No credit card required &middot; Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
