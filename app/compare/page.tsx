import type { Metadata } from "next";
import { Container, BreadcrumbJsonLd, OneLineConclusion, StanceNotice } from "@/components/geo";
import { CompareTable } from "@/components/plan";
import { getAllPlans, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "套餐对比 | Token Plan / Coding Plan / Agent Plan 横评",
  description:
    "AI 编程套餐全量对比表，支持按类型（Token/Coding/Agent）和来源（大厂/国内/国际）筛选，按价格、模型数排序。",
  alternates: { canonical: "https://tokenplan.link/compare/" },
};

export default function ComparePage() {
  const plans = getAllPlans();
  const products = getProducts();

  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "对比", url: "https://tokenplan.link/compare/" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">全部套餐对比</h1>
        <p className="mt-3 text-slate-600">
          收录 {plans.length} 个套餐，覆盖 Token Plan、Coding Plan、Agent Plan 三类。
          支持类型/来源筛选、关键词搜索、价格与模型数排序。
        </p>
      </header>

      <section className="mb-8">
        <OneLineConclusion text="新手首选火山方舟 Coding Plan Lite（40 元/月）：同价位模型阵容最完整、国内接入稳定；需要联网搜索与多模态再加 Agent Plan Medium（200 元/10 万 AFP）。深度使用 Qwen 生态或需要线上 API，则选百炼 Token Plan。" />
      </section>

      <section className="mb-10">
        <CompareTable plans={plans} products={products} />
      </section>

      <section className="mb-10">
        <StanceNotice />
      </section>
    </Container>
  );
}
