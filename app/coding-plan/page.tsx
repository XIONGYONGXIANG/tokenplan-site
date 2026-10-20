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
import { getCodingPlans, getFaqs, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Coding Plan 对比 | 火山/智谱/腾讯云 AI 编程套餐",
  description:
    "Coding Plan 是 AI 编程专属订阅套餐。对比火山方舟、智谱 GLM、阿里云百炼、腾讯云、MiniMax、Kimi、小米的价格、模型、额度与支持工具。",
  keywords: [
    "Coding Plan",
    "火山方舟 Coding Plan",
    "智谱 GLM Coding Plan",
    "AI 编程套餐",
  ],
  alternates: { canonical: "https://tokenplan.link/coding-plan/" },
};

export default function CodingPlanPage() {
  const plans = getCodingPlans();
  const products = getProducts();
  const faqs = getFaqs().filter((f) => /coding|编程/i.test(f.question));

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
          { name: "Coding Plan", url: "https://tokenplan.link/coding-plan/" },
        ]}
      />
      <ItemListJsonLd items={itemList} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Coding Plan 对比</h1>
        <p className="mt-3 text-slate-600">
          Coding Plan 是专为 AI 编程设计的订阅套餐，仅限在 Claude Code、Cursor、OpenClaw 等编码 Agent 工具内使用，
          不能用于线上业务 API 服务。
        </p>
      </header>

      <section className="mb-8">
        <OneLineConclusion text="Coding Plan 不用选，直接冲火山方舟 Lite（40 元/月）：5 款模型自由切换、国内节点最稳、兼容所有主流编码 Agent，闭眼入首选。智谱 GLM 只在你重度依赖 GLM 长链路时才值得考虑，百炼要抢名额根本不推荐。" />
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
