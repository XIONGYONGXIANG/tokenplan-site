import type { Metadata } from "next";
import { Link } from "@/components/link";
import { notFound } from "next/navigation";
import {
  Container,
  BreadcrumbJsonLd,
  ProductJsonLd,
  OneLineConclusion,
  StanceNotice,
  VerifiedBadge,
} from "@/components/geo";
import { PlansGrid } from "@/components/plan";
import {
  getProductById,
  getPlansByProduct,
  getArticlesByProduct,
  getProducts,
} from "@/lib/data";

export function generateStaticParams() {
  return getProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} 套餐详情 | ${product.shortName} Coding/Token/Agent Plan`,
    description: `${product.name} 的全部套餐档位、价格、额度规则、支持模型与工具，${product.tagline}`,
    alternates: { canonical: `https://tokenplan.link/platforms/${id}/` },
  };
}

const conclusions: Record<string, string> = {
  volcengine:
    "火山方舟 Coding Plan 40 元/月，5 款模型自由切换、国内节点最稳，闭眼入首选，没有之一；要联网搜索和多模态就上 Agent Plan Medium 200 元/月，同价位碾压所有对手。",
  zhipu: "智谱 GLM Coding Plan 适合重度 GLM 用户和长链路编码 Agent，但模型锁死且价格较高。",
  aliyun: "阿里云百炼 Token Plan 适合 Qwen 生态用户，一套 Credits 额度池多模型共用，但仅华北 2 可用。",
  tencent: "腾讯云 Coding Plan 首月 7.9 元超低价，混元+第三方模型，但仅限编程工具交互。",
};

export default async function PlatformDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const plans = getPlansByProduct(id);
  const products = getProducts();
  const articles = getArticlesByProduct(id);

  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "厂商", url: "https://tokenplan.link/platforms/" },
          {
            name: product.name,
            url: `https://tokenplan.link/platforms/${id}/`,
          },
        ]}
      />

      {plans.map((p) => (
        <ProductJsonLd
          key={p.id}
          name={p.name}
          description={p.highlights.join("；")}
          price={p.price}
          currency={p.priceCurrency}
          url={p.officialUrl}
          brand={product.name}
        />
      ))}

      <header className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          {product.featured && (
            <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
              闭眼入
            </span>
          )}
        </div>
        <p className="mt-3 text-lg text-slate-600">{product.tagline}</p>
        <p className="mt-2 text-slate-600">{product.description}</p>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
            {product.category}
          </span>
          <a
            href={product.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            官方网站 →
          </a>
        </div>
      </header>

      {conclusions[id] && (
        <section className="mb-8">
          <OneLineConclusion text={conclusions[id]} />
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900">全部套餐（{plans.length}）</h2>
        <div className="mt-4">
          <PlansGrid plans={plans} products={products} />
        </div>
      </section>

      {articles.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900">厂商动态</h2>
          <div className="mt-4 space-y-3">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.id}/`}
                className="block rounded-lg border border-slate-200 p-4 hover:border-slate-400 no-underline"
              >
                <div className="text-xs text-slate-500">{a.date}</div>
                <h3 className="font-medium text-slate-900">{a.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{a.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <StanceNotice />
      </section>
    </Container>
  );
}
