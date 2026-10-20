import type { Metadata } from "next";
import { Link } from "@/components/link";
import {
  Container,
  BreadcrumbJsonLd,
  ItemListJsonLd,
} from "@/components/geo";
import { getGuides } from "@/lib/data";

export const metadata: Metadata = {
  title: "AI 编程订阅问答指南 | Token / Coding / Agent Plan 怎么选",
  description:
    "用问答形式讲透 AI 编程订阅：三类套餐区别、最便宜 Coding Plan、火山方舟评测、5 小时限额、百炼 Credits、Claude Code 国内接入等高频问题。",
  alternates: { canonical: "https://tokenplan.link/guides/" },
};

export default function GuidesPage() {
  const guides = getGuides();

  const listItems = guides.map((g, i) => ({
    position: i + 1,
    name: g.title,
    url: `https://tokenplan.link/guides/${g.id}/`,
  }));

  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "问答指南", url: "https://tokenplan.link/guides/" },
        ]}
      />
      <ItemListJsonLd items={listItems} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          AI 编程订阅问答指南
        </h1>
        <p className="mt-3 max-w-3xl" style={{ color: "var(--text-secondary)" }}>
          把开发者最常问的问题写成答案：三类套餐怎么选、哪家最便宜、火山方舟值不值、
          5 小时限额怎么算、Claude Code 国内怎么接。所有价格额度均核验自厂商官方页面。
        </p>
      </header>

      <div className="space-y-4">
        {guides.map((g, i) => (
          <Link
            key={g.id}
            href={`/guides/${g.id}/`}
            className="card p-5 block no-underline"
          >
            <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <span className="font-bold" style={{ color: "var(--primary)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{g.updated}</span>
              {g.tags?.slice(0, 2).map((t) => (
                <span key={t} className="badge badge-soft">#{t}</span>
              ))}
            </div>
            <h2 className="mt-2 text-lg font-bold text-slate-900">{g.title}</h2>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
              {g.description}
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
