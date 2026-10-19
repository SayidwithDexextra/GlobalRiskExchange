import type { MetadataRoute } from "next";

const base = "https://www.dexetera.org";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/whitepaper`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/team`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];
}
