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
import { getAgentPlans, getFaqs, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Agent Plan 对比 | 火山方舟 Agent Plan 价格与能力",
  description:
    "Agent Plan 面向 Agent 多步任务与多模型编排，含联网搜索和多模态能力。对比火山方舟 Agent Plan 各档位的 AFP 额度、模型与限流规则。",
  keywords: ["Agent Plan", "火山方舟 Agent Plan", "AFP", "AI Agent 订阅"],
  alternates: { canonical: "https://tokenplan.link/agent-plan/" },
};

export default function AgentPlanPage() {
  const plans = getAgentPlans();
  const products = getProducts();
  const faqs = getFaqs().filter((f) => /agent/i.test(f.question));

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
          { name: "Agent Plan", url: "https://tokenplan.link/agent-plan/" },
        ]}
      />
      <ItemListJsonLd items={itemList} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Agent Plan 对比</h1>
        <p className="mt-3 text-slate-600">
          Agent Plan 面向 Agent 多步任务与多模型编排，支持自主规划、工具调用、自我纠错，
          通常包含联网搜索 Harness 和多模态能力。代表产品：火山方舟 Agent Plan。
        </p>
      </header>

      <section className="mb-8">
        <OneLineConclusion text="国内把 Agent 订阅做成完整产品（联网搜索 + 多模态 + 云端 Agent + 统一燃料额度）的主流厂商目前主要是火山方舟：Small 40 元/2 万 AFP 适合验证原型，Medium 200 元/10 万 AFP 是日常开发档。它一个订阅可调用豆包 Seed、DeepSeek、GLM、Kimi 等 SOTA 模型，单位预算能用到的模型阵容最完整，是我们当前最推荐的 Agent 型 MaaS 方案。" />
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
