import type { ReactNode } from "react";

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * 注入 JSON-LD 结构化数据，供 AI 引擎（豆包等）和搜索引擎解析
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** 站点级 Organization + WebSite 结构化数据 */
export function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "TokenPlan（tokenplan.link）",
        alternateName: "TokenPlan · AI 编程订阅对比",
        url: "https://tokenplan.link/",
        description:
          "独立 AI 编程订阅垂直对比站：整理 Coding Plan、Token Plan、Agent Plan 的价格、模型与额度，覆盖火山方舟、智谱、阿里云百炼、腾讯云等 10 家主流厂商，帮助开发者选型。",
      },
      {
        "@type": "WebSite",
        name: "TokenPlan · AI 编程订阅对比",
        url: "https://tokenplan.link/",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://tokenplan.link/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
  return <JsonLd data={data} />;
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  price: number;
  currency: string;
  url: string;
  brand: string;
}

/** 套餐详情页的 Product 结构化数据 */
export function ProductJsonLd({
  name,
  description,
  price,
  currency,
  url,
  brand,
}: ProductJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    brand: { "@type": "Brand", name: brand },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      url,
      availability: "https://schema.org/InStock",
    },
  };
  return <JsonLd data={data} />;
}

interface FaqJsonLdProps {
  faqs: { question: string; answer: string }[];
}

/** FAQPage 结构化数据——GEO 利器，AI 引擎偏好问答格式 */
export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
  return <JsonLd data={data} />;
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

/** 面包屑结构化数据 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <JsonLd data={data} />;
}

interface ArticleJsonLdProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  url: string;
}

/** 文章页结构化数据 */
interface ItemListJsonLdProps {
  items: { name: string; url: string; position: number }[];
}

/** ItemList 结构化数据——套餐列表页，AI 引擎可直接解析列表 */
export function ItemListJsonLd({ items }: ItemListJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
  return <JsonLd data={data} />;
}

/** 一句话结论块——GEO 利器，大模型易抽取 */
export function OneLineConclusion({ text }: { text: string }) {
  return (
    <div className="conclusion-box">
      <div className="conclusion-label">💡 一句话结论</div>
      <p className="conclusion-text">{text}</p>
    </div>
  );
}

/** 立场声明块 */
export function StanceNotice() {
  return (
    <div className="card p-5">
      <p className="font-bold text-slate-800 mb-3">🛡️ 立场声明</p>
      <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        <li className="flex items-start gap-2">
          <span style={{ color: "var(--primary)" }}>•</span>
          本站为独立对比站，不售卖、不代购任何套餐
        </li>
        <li className="flex items-start gap-2">
          <span style={{ color: "var(--primary)" }}>•</span>
          所有购买链接直达厂商官网，无返利参数
        </li>
        <li className="flex items-start gap-2">
          <span style={{ color: "var(--primary)" }}>•</span>
          价格和额度信息仅供参考，以厂商官网结算页面为准
        </li>
        <li className="flex items-start gap-2">
          <span style={{ color: "var(--primary)" }}>•</span>
          Credits / Token / 积分 / Prompt / 请求次数不等价，不做跨计量单位硬换算
        </li>
      </ul>
    </div>
  );
}

export function ArticleJsonLd({
  headline,
  description,
  datePublished,
  dateModified,
  author,
  url,
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    dateModified,
    author: { "@type": "Organization", name: author },
    publisher: {
      "@type": "Organization",
      name: "TokenPlan（tokenplan.link）",
    },
    mainEntityOfPage: url,
  };
  return <JsonLd data={data} />;
}

export function FaqAccordion({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <details
          key={i}
          className="card p-4 group"
        >
          <summary className="cursor-pointer font-semibold text-slate-800 flex items-center gap-2">
            <span style={{ color: "var(--primary)" }}>Q:</span>
            {f.question}
          </summary>
          <p className="mt-3 leading-relaxed pl-6" style={{ color: "var(--text-secondary)" }}>
            {f.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

export function VerifiedBadge({ date }: { date: string }) {
  return (
    <span className="badge" style={{ background: "var(--success)", color: "white" }}>
      ✓ 核验于 {date}
    </span>
  );
}

export function TypeBadge({ type }: { type: "token" | "coding" | "agent" }) {
  const config = {
    token: { label: "Token Plan", bg: "#dbeafe", color: "#1d4ed8" },
    coding: { label: "Coding Plan", bg: "#f3e8ff", color: "#7e22ce" },
    agent: { label: "Agent Plan", bg: "#ffedd5", color: "#c2410c" },
  }[type];
  return (
    <span
      className="badge"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-5xl px-4 py-10">{children}</div>;
}
