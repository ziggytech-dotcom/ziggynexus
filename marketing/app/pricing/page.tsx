import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — ZiggyNexus",
  description:
    "ZiggyNexus costs $39/mo. 5 team seats included, unlimited client portals, all features included. $12/seat/mo after 5 seats. No feature tiers, no surprises.",
};

const includedFeatures = [
  "5 team seats included",
  "+$12/seat/mo after 5 seats",
  "Unlimited client portals",
  "Branded white-label portals with custom domain",
  "Online invoicing with Stripe payments",
  "Automatic payment reminders",
  "Secure encrypted file sharing",
  "Upload requests from clients",
  "E-sign contracts (legally binding)",
  "Signature audit trail",
  "Client messaging with rich text",
  "Internal team notes",
  "Onboarding wizard builder",
  "Reusable onboarding templates",
  "White-label email notifications",
  "Unlimited file storage",
  "Priority email support",
  "API access",
];

const faqs = [
  {
    question: "Is there a free trial?",
    answer:
      "Yes. You get a full 14-day free trial with access to all features. No credit card required to start. At the end of the trial, you can subscribe for $39/mo or cancel — no pressure.",
  },
  {
    question: "How many clients can I have?",
    answer:
      "Unlimited. We don't charge per client or per portal. You can have 5 clients or 500 clients — the price stays $39/mo.",
  },
  {
    question: "Is there a per-user or per-seat fee for my team?",
    answer:
      "Your $39/mo subscription includes 5 team seats. Additional seats are $12/seat/mo. For most small businesses and agencies, 5 seats covers the whole team — and you still pay a fraction of what Copilot charges for a single seat ($69/mo).",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, Amex) via Stripe. Annual billing is available at 10% off ($421/yr).",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Month-to-month with no long-term commitment. Cancel from your dashboard and your subscription ends at the next billing cycle — no penalties.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "You have 30 days after cancellation to export all your data — invoices, files, messages, and signed contracts. After that, data is permanently deleted.",
  },
  {
    question: "Do you charge transaction fees on invoices?",
    answer:
      "ZiggyNexus charges no platform transaction fee. Standard Stripe processing fees apply (2.9% + $0.30 for cards, 0.8% capped at $5 for ACH). You keep the rest.",
  },
  {
    question: "Is there an annual plan?",
    answer:
      "Yes — pay annually and save 10%, bringing your effective cost to $35/mo ($421/yr). Switch to annual anytime from your billing settings.",
  },
];

const comparisonRows = [
  { feature: "Price", ziggynexus: "$39/mo", copilot: "$69/mo", suitedash: "$99/mo" },
  { feature: "Branded client portals", ziggynexus: true, copilot: true, suitedash: true },
  { feature: "Unlimited portals", ziggynexus: true, copilot: false, suitedash: false },
  { feature: "Custom domain", ziggynexus: true, copilot: true, suitedash: true },
  { feature: "Online invoicing", ziggynexus: true, copilot: true, suitedash: true },
  { feature: "E-sign contracts", ziggynexus: true, copilot: true, suitedash: true },
  { feature: "Secure file sharing", ziggynexus: true, copilot: true, suitedash: true },
  { feature: "Client messaging", ziggynexus: true, copilot: true, suitedash: true },
  { feature: "Onboarding wizard", ziggynexus: true, copilot: false, suitedash: true },
  { feature: "5 seats included", ziggynexus: true, copilot: false, suitedash: false },
  { feature: "Modern, clean UI", ziggynexus: true, copilot: true, suitedash: false },
  { feature: "Setup time", ziggynexus: "< 5 min", copilot: "~30 min", suitedash: "Hours" },
  { feature: "API access", ziggynexus: true, copilot: true, suitedash: true },
  { feature: "Priority support", ziggynexus: true, copilot: false, suitedash: true },
];

function CheckIcon({ green = true }: { green?: boolean }) {
  if (green) {
    return (
      <svg className="w-5 h-5 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-zinc-700 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div className="bg-[#0f0a0a]">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            Simple, honest pricing.
          </h1>
          <p className="text-xl text-zinc-400 max-w-xl mx-auto">
            One plan. All features. Unlimited client portals. No surprises.
          </p>
        </div>
      </section>

      {/* Pricing card */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-lg mx-auto">
            <div className="bg-[#18181b] border-2 border-emerald-500/50 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold mb-1">
                  $39
                  <span className="text-xl text-zinc-400 font-normal">/mo</span>
                </div>
                <p className="text-zinc-500">or $421/yr — save 10% with annual billing</p>
              </div>

              <ul className="space-y-3 mb-8">
                {includedFeatures.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-zinc-300">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href="https://app.ziggynexus.com/signup"
                className="block w-full text-center bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-4 rounded-xl transition-colors"
              >
                Start Free Trial
              </a>
              <p className="text-center text-zinc-600 text-sm mt-3">
                14-day free trial &middot; No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How we compare</h2>
            <p className="text-zinc-400">
              ZiggyNexus at $39/mo vs the competition
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-4 px-6 text-zinc-500 font-medium text-sm">Feature</th>
                  <th className="py-4 px-6 text-center">
                    <div className="font-bold text-white">
                      <span style={{ color: "#ff1744" }}>Ziggy</span>Nexus
                    </div>
                    <div className="text-emerald-500 text-sm font-semibold">$39/mo</div>
                  </th>
                  <th className="py-4 px-6 text-center">
                    <div className="font-bold text-zinc-400">Copilot</div>
                    <div className="text-zinc-600 text-sm">$69/mo</div>
                  </th>
                  <th className="py-4 px-6 text-center">
                    <div className="font-bold text-zinc-400">SuiteDash</div>
                    <div className="text-zinc-600 text-sm">$99/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-t border-[#27272a] ${i % 2 === 0 ? "bg-transparent" : "bg-[#18181b]/40"}`}
                  >
                    <td className="py-4 px-6 text-sm text-zinc-300">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.ziggynexus === "boolean" ? (
                        <CheckIcon green={row.ziggynexus} />
                      ) : (
                        <span className="text-emerald-500 text-sm font-semibold">{row.ziggynexus}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.copilot === "boolean" ? (
                        <CheckIcon green={row.copilot} />
                      ) : (
                        <span className="text-zinc-400 text-sm">{row.copilot}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.suitedash === "boolean" ? (
                        <CheckIcon green={row.suitedash} />
                      ) : (
                        <span className="text-zinc-400 text-sm">{row.suitedash}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/vs/copilot"
              className="border border-[#27272a] hover:border-emerald-500 text-white px-6 py-3 rounded-xl text-sm transition-colors text-center"
            >
              Full ZiggyNexus vs Copilot comparison →
            </Link>
            <Link
              href="/vs/suitedash"
              className="border border-[#27272a] hover:border-emerald-500 text-white px-6 py-3 rounded-xl text-sm transition-colors text-center"
            >
              Full ZiggyNexus vs SuiteDash comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6"
              >
                <h3 className="font-semibold mb-3">{faq.question}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-zinc-400 mb-8">
            Join 500+ agencies and consultants for just $39/mo.
          </p>
          <a
            href="https://app.ziggynexus.com/signup"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center gap-2"
          >
            Start Your Free Trial
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
