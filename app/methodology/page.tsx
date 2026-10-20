import type { Metadata } from "next";
import { Container, BreadcrumbJsonLd, StanceNotice } from "@/components/geo";

export const metadata: Metadata = {
  title: "数据方法论 | TokenPlan.link",
  description:
    "TokenPlan.link 的数据整理方法论：Credits/Token/积分不等价，不做跨计量单位硬换算，每元额度只收官方公布数值。",
  alternates: { canonical: "https://tokenplan.link/methodology/" },
};

export default function MethodologyPage() {
  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "方法论", url: "https://tokenplan.link/methodology/" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">数据方法论</h1>
        <p className="mt-3 text-slate-600">
          本站数据整理遵循以下原则，确保对比的公正性和可信度。
        </p>
      </header>

      <div className="prose max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold text-slate-900">计量单位不等价原则</h2>
          <p className="mt-2 text-slate-700">
            不同厂商的套餐采用不同的计量单位：Credits（百炼）、AFP（火山 Agent）、积分（智谱）、
            Tokens（腾讯云）、Prompts（多数 Coding Plan）、请求次数等。这些单位<strong>不等价</strong>，
            不做跨计量单位的硬换算。「每元额度」字段只收录官方公布明确数值的套餐，否则留空。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">数据来源</h2>
          <p className="mt-2 text-slate-700">
            所有价格、额度、模型、工具信息均来自厂商官方定价页、产品文档和公开控制台。
            缺少官方来源的数据不发布；厂商未披露的数字显示「官网未披露」，不推算。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">更新机制</h2>
          <p className="mt-2 text-slate-700">
            后台每日自动抓取各厂商官方页面，diff 出价格、额度、档位变化。
            检测到变化时生成「厂商动态」文章。每条数据标注「最后核验日期」，人工核验后更新。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">排序规则</h2>
          <p className="mt-2 text-slate-700">
            对比表仅在同类口径内排序。价格排序按标称月费；模型数排序按套餐支持的模型数量。
            不做跨类型套餐的综合排名，避免误导。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">额度规则说明</h2>
          <ul className="mt-2 space-y-1 text-slate-700">
            <li>• <strong>5 小时限额</strong>：连续 5 小时内的最大请求次数，动态刷新</li>
            <li>• <strong>周重置</strong>：每 7 天周期重置额度</li>
            <li>• <strong>月重置</strong>：月度订阅日重置额度，当月未用完不结转</li>
          </ul>
        </section>

        <StanceNotice />
      </div>
    </Container>
  );
}
