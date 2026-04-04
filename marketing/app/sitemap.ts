import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ziggynexus.com";
  const now = new Date();
  const routes = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/features", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/pricing", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/agencies", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/consultants", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/service-businesses", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/changelog", priority: 0.6, changeFrequency: "weekly" as const },
    { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/vs/copilot", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/vs/notion", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/vs/suitedash", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.5, changeFrequency: "yearly" as const },
    { url: "/terms", priority: 0.5, changeFrequency: "yearly" as const },
  ];
  return routes.map((route) => ({ url: `${baseUrl}${route.url}`, lastModified: now, changeFrequency: route.changeFrequency, priority: route.priority }));
}
