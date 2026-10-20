import type { Metadata } from "next";
import { Link } from "@/components/link";
import { notFound } from "next/navigation";
import {
  Container,
  BreadcrumbJsonLd,
  ArticleJsonLd,
  FaqJsonLd,
  FaqAccordion,
  OneLineConclusion,
} from "@/components/geo";
import {
  getGuides,
  getGuideById,
  getProductById,
} from "@/lib/data";

export function generateStaticParams() {
  return getGuides().map((g) => ({ id: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const guide = getGuideById(id);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `https://tokenplan.link/guides/${id}/` },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guides = getGuides();
  const guide = guides.find((g) => g.id === id);
  if (!guide) notFound();

  const index = guides.findIndex((g) => g.id === id);
  const prev = index > 0 ? guides[index - 1] : null;
  const next = index < guides.length - 1 ? guides[index + 1] : null;
  const relatedProducts = (guide.relatedProductIds ?? [])
    .map((pid) => getProductById(pid))
    .filter(Boolean);

  const url = `https://tokenplan.link/guides/${id}/`;

  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "问答指南", url: "https://tokenplan.link/guides/" },
          { name: guide.title, url },
        ]}
      />
      <ArticleJsonLd
        headline={guide.title}
        description={guide.description}
        datePublished={guide.date}
        dateModified={guide.updated}
        author="Token Plan 编辑团队"
        url={url}
      />
      <FaqJsonLd faqs={guide.faqs} />

      <article>
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>发布 {guide.date}</span>
            <span>·</span>
            <span>更新 {guide.updated}</span>
            {guide.tags?.map((t) => (
              <span key={t} className="badge badge-soft">#{t}</span>
            ))}
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-snug text-slate-900">
            {guide.title}
          </h1>
        </header>

        {/* 一句话结论：首屏直给，AI 易抽取 */}
        <div className="mb-8">
          <OneLineConclusion text={guide.conclusion} />
        </div>

        {/* 正文小节 */}
        <div className="space-y-9">
          {guide.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold text-slate-900">
                {section.heading}
              </h2>
              {section.paragraphs?.map((p, j) => (
                <p
                  key={j}
                  className="mt-3 leading-7"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 space-y-2">
                  {section.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 leading-7"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span style={{ color: "var(--primary)" }}>•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {section.table && (
                <div className="table-wrapper mt-4">
                  <table>
                    {section.table.caption && (
                      <caption className="px-4 pt-3 pb-1 text-left text-xs" style={{ color: "var(--text-muted)" }}>
                        {section.table.caption}
                      </caption>
                    )}
                    <thead>
                      <tr>
                        {section.table.headers.map((h, j) => (
                          <th key={j}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, j) => (
                        <tr key={j}>
                          {row.map((cell, k) => (
                            <td key={k}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* 相关厂商 */}
        {relatedProducts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">相关厂商</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedProducts.map((p) => (
                <Link
                  key={p!.id}
                  href={`/platforms/${p!.id}/`}
                  className="card px-4 py-3 no-underline"
                >
                  <span className="font-semibold text-slate-800">{p!.name}</span>
                  {p!.featured && (
                    <span className="badge badge-primary ml-2">重点推荐</span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 延伸阅读（站内串联，强化主题集群） */}
        {guide.relatedLinks && guide.relatedLinks.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">延伸阅读</h2>
            <ul className="mt-3 space-y-2">
              {guide.relatedLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-blue-600">
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ：可见手风琴 + FAQPage JSON-LD 已在头部输出 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">常见问题</h2>
          <div className="mt-4">
            <FaqAccordion faqs={guide.faqs} />
          </div>
        </section>

        {/* 来源与核验 */}
        <footer className="mt-10 rounded-lg bg-slate-50 p-4 text-sm" style={{ color: "var(--text-muted)" }}>
          <p>
            <strong>数据核验：</strong>文中价格与额度信息核验至 {guide.updated}，
            来自各厂商官方定价页，实际以厂商官网结算页为准。
          </p>
          {guide.sources && guide.sources.length > 0 && (
            <p className="mt-2">
              <strong>官方来源：</strong>
              {guide.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && " · "}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    {s.label}
                  </a>
                </span>
              ))}
            </p>
          )}
        </footer>

        {/* 上一篇 / 下一篇 */}
        <nav className="mt-10 grid gap-4 md:grid-cols-2">
          {prev ? (
            <Link href={`/guides/${prev.id}/`} className="card p-4 no-underline">
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>← 上一篇</div>
              <div className="mt-1 font-semibold text-slate-800">{prev.title}</div>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/guides/${next.id}/`} className="card p-4 text-right no-underline">
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>下一篇 →</div>
              <div className="mt-1 font-semibold text-slate-800">{next.title}</div>
            </Link>
          )}
        </nav>
      </article>
    </Container>
  );
}
