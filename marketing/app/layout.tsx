import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: {
    default: "ZiggyNexus — Client Portal & Collaboration",
    template: "%s | ZiggyNexus",
  },
  description:
    "Give your clients a branded portal for project updates, invoices, file sharing, and messaging. 14-day free trial, no credit card required.",
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
    title: "ZiggyNexus — Client Portal & Collaboration",
    description:
      "Give your clients a branded portal for project updates, invoices, file sharing, and messaging. 14-day free trial, no credit card required.",
    url: "https://ziggynexus.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZiggyNexus — Client Portal & Collaboration",
    description:
      "Give your clients a branded portal for project updates, invoices, file sharing, and messaging. 14-day free trial, no credit card required.",
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
