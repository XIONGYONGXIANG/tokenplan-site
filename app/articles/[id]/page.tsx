import type { Metadata } from "next";
import { Link } from "@/components/link";
import { notFound } from "next/navigation";
import {
  Container,
  BreadcrumbJsonLd,
  ArticleJsonLd,
} from "@/components/geo";
import { getArticles, getArticleById, getProductById, getProducts } from "@/lib/data";

export function generateStaticParams() {
  return getArticles().map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = getArticles().find((a) => a.id === id);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `https://tokenplan.link/articles/${id}/` },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticles().find((a) => a.id === id);
  if (!article) notFound();

  const product = getProductById(article.productId);

  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "动态", url: "https://tokenplan.link/articles/" },
          {
            name: article.title,
            url: `https://tokenplan.link/articles/${id}/`,
          },
        ]}
      />
      <ArticleJsonLd
        headline={article.title}
        description={article.summary}
        datePublished={article.date}
        dateModified={article.date}
        author="Token Plan 编辑团队"
        url={`https://tokenplan.link/articles/${id}/`}
      />

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>{article.date}</span>
            <span>·</span>
            <Link
              href={`/platforms/${article.productId}/`}
              className="text-blue-600"
            >
              {product?.name}
            </Link>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {article.title}
          </h1>
        </header>

        <div className="prose max-w-none">
          <p className="text-lg text-slate-700">{article.summary}</p>

          <h2 className="mt-8 text-xl font-bold">变动点</h2>
          <ul className="mt-3 space-y-2">
            {article.changes.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="text-emerald-500">•</span>
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <p>
              <strong>来源：</strong>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {product?.name} 官方页面
              </a>
            </p>
            <p className="mt-1">
              本文由后台自动抓取官方页面 diff 生成，具体信息以厂商官网为准。
            </p>
          </div>
        </div>
      </article>
    </Container>
  );
}
