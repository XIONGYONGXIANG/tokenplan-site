import type { MetadataRoute } from "next";
import { getProducts, getArticles } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tokenplan.link";
  const now = new Date("2026-10-19").toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/coding-plan/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/token-plan/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/agent-plan/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/compare/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/platforms/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/articles/`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/latency/`, lastModified: now, changeFrequency: "hourly", priority: 0.7 },
    { url: `${base}/methodology/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const platformPages = getProducts().map((p) => ({
    url: `${base}/platforms/${p.id}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p.featured ? 0.9 : 0.6,
  }));

  const articlePages = getArticles().map((a) => ({
    url: `${base}/articles/${a.id}/`,
    lastModified: a.date,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...platformPages, ...articlePages];
}
