"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#27272a] bg-[#0f0a0a]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <img src="/ziggynexus-wordmark-v3.png" alt="ZiggyNexus" style={{ height: 32, width: "auto" }} />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>

            {/* Compare dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setCompareOpen(true)}
                onMouseLeave={() => setCompareOpen(false)}
                className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Compare
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {compareOpen && (
                <div
                  onMouseEnter={() => setCompareOpen(true)}
                  onMouseLeave={() => setCompareOpen(false)}
                  className="absolute top-full left-0 mt-2 w-52 bg-[#18181b] border border-[#27272a] rounded-xl shadow-xl overflow-hidden"
                >
                  <Link
                    href="/vs/copilot"
                    className="block px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] transition-colors"
                  >
                    ZiggyNexus vs Copilot
                  </Link>
                  <Link
                    href="/vs/suitedash"
                    className="block px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] transition-colors"
                  >
                    ZiggyNexus vs SuiteDash
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/agencies"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              For Agencies
            </Link>
            <Link
              href="/consultants"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              For Consultants
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://app.ziggynexus.com/signup"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
            >
              Get Started Free
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#27272a] py-4 space-y-1">
            <Link
              href="/features"
              className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-[#18181b] rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-[#18181b] rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/vs/copilot"
              className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-[#18181b] rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              vs Copilot
            </Link>
            <Link
              href="/vs/suitedash"
              className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-[#18181b] rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              vs SuiteDash
            </Link>
            <Link
              href="/agencies"
              className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-[#18181b] rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              For Agencies
            </Link>
            <Link
              href="/consultants"
              className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-[#18181b] rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              For Consultants
            </Link>
            <Link
              href="/service-businesses"
              className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-[#18181b] rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              For Service Businesses
            </Link>
            <div className="pt-2 px-3">
              <a
                href="https://app.ziggynexus.com/signup"
                className="block w-full text-center bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Get Started Free
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
