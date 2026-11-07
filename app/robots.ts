import type { MetadataRoute } from "next";

// Crawling stays allowed so Google can read the page's noindex (a Disallow would hide it); no sitemap, nothing here to index
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
