import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "ZiggyNexus — The client portal your clients will actually use.",
    template: "%s | ZiggyNexus",
  },
  description:
    "Give every client their own branded portal. Online invoicing, secure file sharing, e-sign contracts, client messaging, and more — starting at $39/mo.",
  keywords: [
    "client portal",
    "white label portal",
    "agency client portal",
    "online invoicing",
    "e-sign contracts",
    "secure file sharing",
    "client management",
  ],
  openGraph: {
    type: "website",
    siteName: "ZiggyNexus",
    title: "ZiggyNexus — The client portal your clients will actually use.",
    description:
      "Give every client their own branded portal. Starting at $39/mo.",
    url: "https://ziggynexus.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZiggyNexus — The client portal your clients will actually use.",
    description:
      "Give every client their own branded portal. Starting at $39/mo.",
  },
  metadataBase: new URL("https://ziggynexus.com"),

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0f0a0a] text-white font-sans antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
