import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Bytespider",
        allow: "/",
      },
    ],
    sitemap: "https://tokenplan.link/sitemap.xml",
    host: "https://tokenplan.link",
  };
}
