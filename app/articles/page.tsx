import type { Metadata } from "next";
import { Link } from "@/components/link";
import { Container, BreadcrumbJsonLd } from "@/components/geo";
import { getArticles, getProductById } from "@/lib/data";

export const metadata: Metadata = {
  title: "厂商动态 | AI 编程套餐价格变动",
  description: "各厂商 AI 编程套餐的价格变动、额度调整、新模型上线等动态资讯。",
  alternates: { canonical: "https://tokenplan.link/articles/" },
};

export default function ArticlesPage() {
  const articles = getArticles().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "动态", url: "https://tokenplan.link/articles/" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">厂商动态</h1>
        <p className="mt-3 text-slate-600">
          各厂商 AI 编程套餐的价格变动、额度调整、新模型上线等动态，由后台自动抓取官方页面 diff 后生成。
        </p>
      </header>

      <div className="space-y-4">
        {articles.map((a) => {
          const product = getProductById(a.productId);
          return (
            <Link
              key={a.id}
              href={`/articles/${a.id}/`}
              className="card p-5 block no-underline"
            >
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span>{a.date}</span>
                <span>·</span>
                <span>{product?.name}</span>
              </div>
              <h2 className="mt-2 text-lg font-bold text-slate-900">{a.title}</h2>
              <p className="mt-2 text-slate-600">{a.summary}</p>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
