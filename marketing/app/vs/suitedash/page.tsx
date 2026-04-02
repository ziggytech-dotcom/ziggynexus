import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ZiggyNexus vs SuiteDash — Modern client portal vs complex legacy software",
  description:
    "ZiggyNexus vs SuiteDash: modern, clean UI vs outdated complexity. Full feature comparison showing why service businesses are switching to ZiggyNexus.",
};

const comparisonRows = [
  {
    feature: "Monthly price",
    ziggynexus: "$39/mo",
    suitedash: "From $99/mo",
    winner: "ziggynexus",
    note: "ZiggyNexus saves up to $720/year",
  },
  {
    feature: "UI / Design",
    ziggynexus: "Modern, clean, fast",
    suitedash: "Complex, dated interface",
    winner: "ziggynexus",
    note: "SuiteDash has a steep learning curve due to UI complexity",
  },
  {
    feature: "Setup time",
    ziggynexus: "< 5 minutes",
    suitedash: "Hours to days",
    winner: "ziggynexus",
    note: "SuiteDash requires extensive configuration before first use",
  },
  {
    feature: "Branded client portals",
    ziggynexus: "Yes",
    suitedash: "Yes",
    winner: "tie",
    note: "",
  },
  {
    feature: "Unlimited client portals",
    ziggynexus: "Yes",
    suitedash: "Limited on base plans",
    winner: "ziggynexus",
    note: "",
  },
  {
    feature: "Custom domain",
    ziggynexus: "Yes",
    suitedash: "Yes",
    winner: "tie",
    note: "",
  },
  {
    feature: "Online invoicing",
    ziggynexus: "Yes",
    suitedash: "Yes",
    winner: "tie",
    note: "",
  },
  {
    feature: "E-sign contracts",
    ziggynexus: "Yes",
    suitedash: "Yes",
    winner: "tie",
    note: "",
  },
  {
    feature: "Secure file sharing",
    ziggynexus: "Yes",
    suitedash: "Yes",
    winner: "tie",
    note: "",
  },
  {
    feature: "Client messaging",
    ziggynexus: "Yes",
    suitedash: "Yes",
    winner: "tie",
    note: "",
  },
  {
    feature: "Onboarding wizard",
    ziggynexus: "Yes — purpose-built",
    suitedash: "Partially (complex setup)",
    winner: "ziggynexus",
    note: "ZiggyNexus onboarding is drag-and-drop; SuiteDash requires custom workflow configuration",
  },
  {
    feature: "Client experience",
    ziggynexus: "Clean, modern portal",
    suitedash: "Overwhelming dashboard",
    winner: "ziggynexus",
    note: "Clients often need training to use SuiteDash portals",
  },
  {
    feature: "Mobile experience",
    ziggynexus: "Fully responsive",
    suitedash: "Poor on mobile",
    winner: "ziggynexus",
    note: "SuiteDash was not designed mobile-first",
  },
  {
    feature: "Time to first client portal",
    ziggynexus: "5 minutes",
    suitedash: "Multiple hours",
    winner: "ziggynexus",
    note: "",
  },
  {
    feature: "Learning curve",
    ziggynexus: "Minimal",
    suitedash: "Very steep",
    winner: "ziggynexus",
    note: "SuiteDash has dozens of settings pages and modules",
  },
  {
    feature: "Priority support",
    ziggynexus: "Included",
    suitedash: "Included",
    winner: "tie",
    note: "",
  },
];

export default function VsSuiteDashPage() {
  const ziggyWins = comparisonRows.filter((r) => r.winner === "ziggynexus").length;

  return (
    <div className="bg-[#0f0a0a]">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative text-center">
          <div className="inline-flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
            Comparison
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span style={{ color: "#ff1744" }}>Ziggy</span>
            <span className="text-white">Nexus</span>
            <span className="text-zinc-500"> vs </span>
            <span className="text-zinc-400">SuiteDash</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            SuiteDash tried to build everything for everyone and ended up with a
            product that takes days to configure and confuses your clients.
            ZiggyNexus is purpose-built for service businesses — simple to
            set up, beautiful to use.
          </p>

          <div className="bg-[#18181b] border border-emerald-500/40 rounded-2xl px-8 py-5 inline-block mb-10">
            <div className="text-3xl font-bold text-emerald-500">{ziggyWins} out of {comparisonRows.length}</div>
            <div className="text-sm text-zinc-400 mt-1">Categories won by ZiggyNexus</div>
          </div>

          <div className="block">
            <a
              href="https://app.ziggynexus.com/signup"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center gap-2"
            >
              Try ZiggyNexus Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Key differentiator callout */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
              <div className="text-2xl font-bold text-emerald-500 mb-1">60x faster</div>
              <p className="text-zinc-400 text-sm">Time to first client portal vs SuiteDash</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
              <div className="text-2xl font-bold text-emerald-500 mb-1">Save $720/yr</div>
              <p className="text-zinc-400 text-sm">$39/mo vs SuiteDash&apos;s $99/mo starting price</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
              <div className="text-2xl font-bold text-emerald-500 mb-1">0 training</div>
              <p className="text-zinc-400 text-sm">Clients use ZiggyNexus without a tutorial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Feature-by-feature comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#27272a]">
                  <th className="text-left py-4 px-6 text-zinc-500 font-medium text-sm w-1/3">Feature</th>
                  <th className="py-4 px-6 text-center w-1/4">
                    <div className="font-bold">
                      <span style={{ color: "#ff1744" }}>Ziggy</span>
                      <span className="text-white">Nexus</span>
                    </div>
                    <div className="text-emerald-500 text-sm font-semibold">$39/mo</div>
                  </th>
                  <th className="py-4 px-6 text-center w-1/4">
                    <div className="font-bold text-zinc-400">SuiteDash</div>
                    <div className="text-zinc-600 text-sm">from $99/mo</div>
                  </th>
                  <th className="py-4 px-6 text-left text-zinc-500 font-medium text-sm w-1/3 hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-t border-[#27272a] ${i % 2 === 0 ? "bg-transparent" : "bg-[#18181b]/40"}`}
                  >
                    <td className="py-4 px-6 text-sm text-zinc-300 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-sm font-medium ${row.winner === "ziggynexus" ? "text-emerald-500" : "text-zinc-400"}`}>
                        {row.winner === "ziggynexus" && (
                          <svg className="w-4 h-4 inline mr-1 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {row.ziggynexus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-sm text-zinc-500">{row.suitedash}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-zinc-500 hidden md:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The UI problem */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                The SuiteDash problem: your clients won&apos;t use it
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Your portal is only valuable if clients log in",
                    body: "SuiteDash portals are notoriously overwhelming. Clients see a dense dashboard full of modules they don't understand. Most end up emailing you anyway — defeating the purpose.",
                  },
                  {
                    title: "Days to configure, not minutes",
                    body: "SuiteDash has 40+ settings pages across billing, CRM, project management, HR, and more. Before you can invite a single client, you're staring at a configuration maze. ZiggyNexus has you ready in under 5 minutes.",
                  },
                  {
                    title: "You're paying for features you don't need",
                    body: "SuiteDash bundles CRM, HR tools, and project management you'll never use — and charges you for the privilege. ZiggyNexus is built specifically for client portals and nothing else.",
                  },
                  {
                    title: "A cheaper price doesn't help if staff needs training",
                    body: "The hidden cost of SuiteDash isn't the subscription — it's onboarding your team and hand-holding clients through the portal. ZiggyNexus requires zero client training.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{item.title}</div>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
                <blockquote className="text-zinc-300 leading-relaxed text-sm mb-4">
                  &ldquo;We spent two weeks configuring SuiteDash and our clients still couldn&apos;t figure it out. We switched to ZiggyNexus on a Friday afternoon and our first client was in their portal by Monday morning.&rdquo;
                </blockquote>
                <div>
                  <div className="font-semibold text-sm">Marcus L.</div>
                  <div className="text-zinc-500 text-sm">Director, Greenfield Creative Agency</div>
                </div>
              </div>
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
                <blockquote className="text-zinc-300 leading-relaxed text-sm mb-4">
                  &ldquo;SuiteDash felt like it was designed by committee in 2009. ZiggyNexus looks like it belongs in 2026. My clients compliment the portal every time I bring on a new one.&rdquo;
                </blockquote>
                <div>
                  <div className="font-semibold text-sm">Tanya R.</div>
                  <div className="text-zinc-500 text-sm">Independent Brand Consultant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Simple, modern, and half the price.
          </h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Get everything SuiteDash offers for client portals — without the
            complexity, without the outdated UI, and at $60/mo less.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.ziggynexus.com/signup"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center justify-center gap-2"
            >
              Start Free Trial — $39/mo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <Link
              href="/pricing"
              className="border border-[#27272a] hover:border-emerald-500 text-white px-8 py-4 rounded-xl text-base transition-colors inline-flex items-center justify-center"
            >
              Compare pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
