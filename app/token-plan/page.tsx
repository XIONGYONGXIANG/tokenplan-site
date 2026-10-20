import type { Metadata } from "next";
import {
  Container,
  BreadcrumbJsonLd,
  FaqJsonLd,
  FaqAccordion,
  OneLineConclusion,
  ItemListJsonLd,
} from "@/components/geo";
import { CompareTable } from "@/components/plan";
import { getTokenPlans, getFaqs, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Token Plan 对比 | 百炼 Token Plan 价格与额度",
  description:
    "Token Plan 按 Token/Credits 统一计量的 API 订阅套餐。对比阿里云百炼 Token Plan、腾讯云 TokenHub、阶跃星辰等平台的价格、额度、模型与限流规则。",
  keywords: ["Token Plan", "百炼 Token Plan", "阿里云 Token Plan", "TokenHub"],
  alternates: { canonical: "https://tokenplan.link/token-plan/" },
};

export default function TokenPlanPage() {
  const plans = getTokenPlans();
  const products = getProducts();
  const faqs = getFaqs().filter((f) => /token|credits|百炼/i.test(f.question));

  const itemList = plans.map((p, i) => ({
    position: i + 1,
    name: p.name,
    url: `https://tokenplan.link/platforms/${p.productId}/`,
  }));

  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "Token Plan", url: "https://tokenplan.link/token-plan/" },
        ]}
      />
      <ItemListJsonLd items={itemList} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Token Plan 对比</h1>
        <p className="mt-3 text-slate-600">
          Token Plan 按月订阅的 API 额度套餐，按 Token / Credits / 积分统一计量，一套额度池可调用多个模型。
          代表产品：阿里云百炼 Token Plan、腾讯云 TokenHub。
        </p>
      </header>

      <section className="mb-8">
        <OneLineConclusion text="想要一套额度池自由切换 Qwen/DeepSeek/GLM 选百炼 Token Plan（Lite 39 元起）；纯 Token 计费入门选腾讯云 Hy Token Plan（28 元/月，3500 万 Tokens）。" />
      </section>

      <section className="mb-10">
        <CompareTable plans={plans} products={products} />
      </section>

      {faqs.length > 0 && (
        <section className="mb-10">
          <FaqJsonLd faqs={faqs} />
          <h2 className="text-xl font-bold text-slate-900">常见问题</h2>
          <div className="mt-4">
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      )}
    </Container>
  );
}
