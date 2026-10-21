import type { Metadata } from "next";
import { Link } from "@/components/link";
import "./globals.css";
import { SiteJsonLd } from "@/components/geo";

export const metadata: Metadata = {
  metadataBase: new URL("https://tokenplan.link"),
  title: {
    default: "TokenPlan · AI 编程订阅对比 | Coding / Token / Agent Plan 价格横评",
    template: "%s | TokenPlan · AI 编程订阅对比",
  },
  description:
    "TokenPlan（tokenplan.link）是独立的 AI 编程订阅垂直对比站。整理 Coding Plan、Token Plan、Agent Plan 的价格、模型、额度，覆盖火山方舟、智谱、阿里云百炼、腾讯云等 10 家主流厂商。",
  keywords: [
    "TokenPlan",
    "AI 编程订阅对比",
    "Coding Plan 对比",
    "Token Plan 对比",
    "Agent Plan 对比",
    "火山方舟 Coding Plan",
    "百炼 Token Plan",
    "智谱 GLM Coding Plan",
    "AI 编程套餐",
  ],
  authors: [{ name: "TokenPlan 编辑部" }],
  openGraph: {
    title: "TokenPlan · AI 编程订阅对比 | Coding / Token / Agent Plan 价格横评",
    description:
      "独立 AI 编程订阅垂直对比站：Coding Plan、Token Plan、Agent Plan 价格、模型、额度全面横评，覆盖 10 家主流厂商。",
    url: "https://tokenplan.link",
    siteName: "TokenPlan · AI 编程订阅对比",
    type: "website",
  },
  alternates: {
    canonical: "https://tokenplan.link",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const nav = [
  { href: "/", label: "首页" },
  { href: "/coding-plan/", label: "Coding Plan" },
  { href: "/token-plan/", label: "Token Plan" },
  { href: "/agent-plan/", label: "Agent Plan" },
  { href: "/platforms/", label: "厂商" },
  { href: "/guides/", label: "问答指南" },
  { href: "/articles/", label: "动态" },
  { href: "/latency/", label: "测速" },
  { href: "/methodology/", label: "方法论" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteJsonLd />
        <header className="site-header">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="site-logo">
              TokenPlan<span className="text-slate-400">（tokenplan.link）</span>
            </Link>
            <nav className="flex flex-wrap gap-5">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="nav-link"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="mx-auto max-w-5xl px-4 text-sm" style={{ color: "var(--text-muted)" }}>
            <p>
              TokenPlan.link 是独立的 AI 编程套餐对比站，不是所列厂商的官方网站。
              所有价格和额度信息均来自厂商官方页面，最终以厂商官网为准。
            </p>
            <p className="mt-2">
              数据最后核验：2026-10-19 ·{" "}
              <Link href="/about/" style={{ color: "var(--primary)" }}>
                关于本站
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
