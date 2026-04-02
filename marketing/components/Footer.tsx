import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#27272a] bg-[#0f0a0a]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-xl font-bold tracking-tight mb-3">
              <span style={{ color: "#ff1744" }}>Ziggy</span>
              <span className="text-white">Nexus</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              The client portal your clients will actually use.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <a
                  href="https://app.ziggynexus.com/signup"
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Get Started Free
                </a>
              </li>
            </ul>
          </div>

          {/* Compare */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Compare</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/vs/copilot"
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  vs Copilot
                </Link>
              </li>
              <li>
                <Link
                  href="/vs/suitedash"
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  vs SuiteDash
                </Link>
              </li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Use Cases</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/agencies"
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Agencies
                </Link>
              </li>
              <li>
                <Link
                  href="/consultants"
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Consultants
                </Link>
              </li>
              <li>
                <Link
                  href="/service-businesses"
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Service Businesses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            &copy; 2026 ZiggyNexus &middot; Part of ZiggyTech Business Suite
          </p>
          <p className="text-sm text-zinc-600">
            <a
              href="https://app.ziggynexus.com"
              className="hover:text-zinc-400 transition-colors"
            >
              app.ziggynexus.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
