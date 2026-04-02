import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ZiggyNexus for Consultants — Look bigger. Work smarter.",
  description:
    "Independent consultants and boutique firms use ZiggyNexus to deliver a Fortune 500 client experience at $39/mo. Branded portals, e-sign, invoicing, and messaging in one place.",
};

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Look like a larger firm",
    description:
      "When you invite a client to portal.yourname.com with your logo and colors, they experience a polished, professional setup that signals you run a tight operation — not a freelancer working from their couch.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "Kill the contract back-and-forth",
    description:
      "Send a proposal or contract through the portal and your client signs it in minutes — legally binding, with a timestamp and IP log. No printing, no scanning, no waiting.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Get paid without chasing",
    description:
      "Create an invoice in 30 seconds, send it through the portal, and watch automatic reminders do the follow-up work for you. Clients pay by card or bank transfer directly in their portal.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Share deliverables securely",
    description:
      "Stop attaching reports to emails or sharing Google Drive links. Upload deliverables to the client's portal with proper access controls. Everything's versioned and organized.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "One place for client communication",
    description:
      "No more digging through Gmail threads from 6 months ago. Every conversation, every decision, every update lives in the client's portal — searchable, organized, and yours.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: "Structured onboarding for every engagement",
    description:
      "Build a client onboarding flow once: welcome message, intake questionnaire, document requests, contract signature. Every new engagement starts the same professional way.",
  },
];

const workflow = [
  {
    step: "1",
    title: "New client signs on",
    description:
      "You create a portal in 60 seconds, customized with your branding. Send an automated invite — they're in their workspace in minutes.",
  },
  {
    step: "2",
    title: "Onboarding runs automatically",
    description:
      "Your pre-built onboarding wizard walks them through intake forms, document uploads, and contract signing — without you lifting a finger.",
  },
  {
    step: "3",
    title: "Engagement runs in the portal",
    description:
      "Share reports, exchange messages, update documents, and request additional signatures — all within the portal. No email required.",
  },
  {
    step: "4",
    title: "Invoice and get paid",
    description:
      "Send invoices monthly, on milestones, or on a custom schedule. Clients pay in the portal. Automatic reminders handle late payments.",
  },
];

export default function ConsultantsPage() {
  return (
    <div className="bg-[#0f0a0a]">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
              Built for consultants
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Look bigger.{" "}
              <span className="text-emerald-500">Work smarter.</span>
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl">
              Independent consultants and boutique firms use ZiggyNexus to
              deliver a client experience that rivals the big agencies — without
              the overhead, the headcount, or the enterprise price tag.
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
                href="/pricing"
                className="border border-[#27272a] hover:border-emerald-500 text-white px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center justify-center"
              >
                See pricing — $39/mo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="border-y border-[#27272a] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                before: "Sending contracts via email",
                after: "Clients sign in their portal in minutes",
              },
              {
                before: "Chasing invoice payments",
                after: "Automatic reminders handle follow-up",
              },
              {
                before: "Sharing files via Dropbox links",
                after: "Secure, organized file storage per client",
              },
            ].map((item) => (
              <div key={item.before} className="text-center">
                <div className="text-sm text-zinc-600 mb-2 line-through">{item.before}</div>
                <div className="text-sm text-emerald-500 font-medium">{item.after}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything a consultant needs
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Stop cobbling together Google Workspace, DocuSign, Stripe, and
              Dropbox. ZiggyNexus replaces all of them with one coherent product.
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

      {/* Workflow */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your new client workflow</h2>
            <p className="text-zinc-400 text-lg">
              From signed contract to final invoice — all in ZiggyNexus.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflow.map((step) => (
              <div key={step.step} className="relative">
                <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 h-full">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-sm mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-zinc-300 leading-relaxed mb-6">
                &ldquo;I&apos;m a solo strategy consultant. Before ZiggyNexus I was using Gmail, HelloSign, and a shared Dropbox folder. Now every client has their own portal and I look like I have a 10-person operation. My clients have actually commented on how professional the experience is.&rdquo;
              </blockquote>
              <div>
                <div className="font-semibold text-sm">James T.</div>
                <div className="text-zinc-500 text-sm">Independent Strategy Consultant</div>
              </div>
            </div>
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-zinc-300 leading-relaxed mb-6">
                &ldquo;The e-sign feature alone was worth switching. My average contract signing time dropped from 4 days to about 2 hours. Clients just sign in their portal without needing to create an account anywhere or download anything. That friction removal changed everything.&rdquo;
              </blockquote>
              <div>
                <div className="font-semibold text-sm">Priya K.</div>
                <div className="text-zinc-500 text-sm">Operations Consultant, Clearpath Advisory</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Your clients expect a professional experience.{" "}
            <span className="text-emerald-500">Deliver it.</span>
          </h2>
          <p className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto">
            Start your 14-day free trial today. No credit card. Set up your
            first client portal in under 5 minutes.
          </p>
          <a
            href="https://app.ziggynexus.com/signup"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center gap-2"
          >
            Get Started Free — $39/mo
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
