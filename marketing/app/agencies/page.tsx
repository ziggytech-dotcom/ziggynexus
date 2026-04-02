import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ZiggyNexus for Agencies — Client portals your clients will actually use",
  description:
    "Scale your agency with branded client portals. ZiggyNexus gives every client their own workspace with invoicing, file sharing, e-sign, and messaging — for $39/mo.",
};

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "One portal per client — fully isolated",
    description:
      "Each client only sees their own work, their own invoices, and their own files. No data bleed, no confusion. Scale from 5 to 500 clients without a management headache.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Your brand everywhere, not ours",
    description:
      "Portals live on your domain (e.g. portal.youragency.com) and show your logo, your colors, and your name. Clients never see the ZiggyNexus brand.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: "Onboarding that runs itself",
    description:
      "Build an onboarding flow once: collect intake info, request documents, send the contract, gather signatures. Every new client goes through the same polished process automatically.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Get paid faster with in-portal invoicing",
    description:
      "Send invoices from within the portal. Clients pay by card or bank transfer without switching apps. Automatic reminders chase late payments so your account managers don't have to.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Stop managing client communication across tools",
    description:
      "Instead of email, Slack, text, and carrier pigeon, all client communication lives in one thread per client. Your whole team sees context. Clients feel heard.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "Sign contracts in under 3 hours",
    description:
      "Upload your SOW or MSA, send it for e-signature, and your client signs from their portal — no DocuSign account required. Legally binding, with a full audit trail.",
  },
];

const useCases = [
  {
    title: "Creative & Design Agencies",
    description:
      "Share deliverables securely, collect feedback, send contracts for retainers, and keep all client communication in one place. No more Dropbox links, email attachments, or HelloSign one-offs.",
  },
  {
    title: "Marketing Agencies",
    description:
      "Onboard new clients with a structured intake flow, share campaign reports in the file manager, invoice for monthly retainers, and maintain a clean client communication thread.",
  },
  {
    title: "SEO & PPC Agencies",
    description:
      "Set up recurring monthly invoices, share keyword reports and performance decks in the portal, and keep all strategy discussions out of email and into organized threads.",
  },
  {
    title: "Web Development Agencies",
    description:
      "Collect project briefs through the onboarding wizard, share design mockups for client approval, send contracts for new projects, and collect staged payments all in one place.",
  },
];

export default function AgenciesPage() {
  return (
    <div className="bg-[#0f0a0a]">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
              Built for agencies
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              The client portal{" "}
              <span className="text-emerald-500">your agency deserves.</span>
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl">
              Give every client a branded, professional portal that reflects your
              agency — not a generic SaaS tool. Onboard faster, get paid faster,
              and stop managing client relationships across five different apps.
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
            <span><span className="text-emerald-500 font-bold text-lg">300+</span> agencies on ZiggyNexus</span>
            <span className="text-[#27272a]">|</span>
            <span><span className="text-emerald-500 font-bold text-lg">8k+</span> client portals managed</span>
            <span className="text-[#27272a]">|</span>
            <span><span className="text-emerald-500 font-bold text-lg">73%</span> faster client onboarding vs before</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Built for how agencies work
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Every feature was designed with agency workflows in mind — from
              client onboarding to final invoice.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 hover:border-emerald-500/40 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agency type use cases */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Works for every agency type</h2>
            <p className="text-zinc-400">
              Whether you run a boutique creative shop or a 50-person growth
              agency, ZiggyNexus fits your workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((uc) => (
              <div key={uc.title} className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-3 text-emerald-500">{uc.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{uc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-[#18181b] border border-[#27272a] rounded-2xl p-10 text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-xl text-zinc-300 leading-relaxed mb-6">
              &ldquo;We onboard 8-10 new clients per month. Before ZiggyNexus, that meant 8-10 different Notion workspaces, separate Dropbox folders, and Google Docs contracts. Now it&apos;s one portal each. The time savings alone paid for the subscription in the first week.&rdquo;
            </blockquote>
            <div>
              <div className="font-semibold">Sarah M.</div>
              <div className="text-zinc-500 text-sm">Founder, Momentum Design Agency</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Your agency. Your brand. Your portal.
          </h2>
          <p className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto">
            Start your free trial today. Unlimited portals, all features, $39/mo
            after trial. No credit card required.
          </p>
          <a
            href="https://app.ziggynexus.com/signup"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center gap-2"
          >
            Start Free Trial
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <p className="text-zinc-600 text-sm mt-4">
            14-day free trial &middot; No credit card required &middot; Setup in under 5 minutes
          </p>
        </div>
      </section>
    </div>
  );
}
