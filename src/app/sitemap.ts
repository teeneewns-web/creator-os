import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://getcreatoros.net";
  const pages = [
    { path: "", priority: 1 },
    { path: "/start", priority: 0.9 },
    { path: "/pricing", priority: 0.8 },
    { path: "/samples", priority: 0.8 },
    { path: "/quality", priority: 0.6 },
    { path: "/faq", priority: 0.6 },
    { path: "/contact", priority: 0.4 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  return pages.map((p) => ({
    url: base + p.path,
    lastModified: new Date(),
    priority: p.priority,
  }));
}
