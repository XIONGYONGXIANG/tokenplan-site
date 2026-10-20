import type { Metadata } from "next";
import { Link } from "@/components/link";
import { Container, BreadcrumbJsonLd } from "@/components/geo";
import { getProducts, getPlansByProduct } from "@/lib/data";

export const metadata: Metadata = {
  title: "厂商一览 | AI 编程套餐平台对比",
  description: "火山方舟、智谱、阿里云百炼、腾讯云等 AI 编程套餐厂商一览，点击查看各平台全部档位详情。",
  alternates: { canonical: "https://tokenplan.link/platforms/" },
};

export default function PlatformsPage() {
  const products = getProducts();
  const featured = products.filter((p) => p.featured);
  const others = products.filter((p) => !p.featured);

  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "厂商", url: "https://tokenplan.link/platforms/" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">厂商一览</h1>
        <p className="mt-3 text-slate-600">
          收录 {products.length} 家 AI 编程套餐厂商，点击查看各平台全部档位、额度规则与官方购买入口。
        </p>
      </header>

      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">🔥 闭眼入首选</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((p) => {
              const plans = getPlansByProduct(p.id);
              return (
                <Link
                  key={p.id}
                  href={`/platforms/${p.id}/`}
                  className="card-featured p-6 block no-underline"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                    <span className="badge badge-danger">闭眼入</span>
                  </div>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{p.tagline}</p>
                  <div className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    {plans.length} 个套餐 · {p.category}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">其他厂商</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {others.map((p) => {
            const plans = getPlansByProduct(p.id);
            return (
              <Link
                key={p.id}
                href={`/platforms/${p.id}/`}
                className="card p-5 block no-underline"
              >
                <h3 className="font-bold text-slate-900">{p.name}</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{p.tagline}</p>
                <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  {plans.length} 个套餐 · {p.category}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </Container>
  );
}
