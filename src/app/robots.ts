import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/checkout/", "/order/", "/order-success"],
    },
    sitemap: "https://getcreatoros.net/sitemap.xml",
  };
}
