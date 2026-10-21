import type { Metadata } from "next";
import { Container, BreadcrumbJsonLd } from "@/components/geo";
import { getSources } from "@/lib/data";

export const metadata: Metadata = {
  title: "关于 TokenPlan · AI 编程订阅对比",
  description:
    "TokenPlan（tokenplan.link）是独立的 AI 编程订阅垂直对比站，整理 Coding Plan、Token Plan、Agent Plan 的价格、额度与模型信息，数据均来自厂商官方页面。",
  alternates: { canonical: "https://tokenplan.link/about/" },
};

export default function AboutPage() {
  const sources = getSources();

  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "关于", url: "https://tokenplan.link/about/" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">关于 TokenPlan · AI 编程订阅对比</h1>
        <p className="mt-3 text-slate-600">
          独立站点 · 非厂商官方 · 2026-10-21 上线
        </p>
      </header>

      <section className="mb-8 prose max-w-none">
        <h2 className="text-xl font-bold">我们是谁</h2>
        <p className="mt-2 text-slate-600">
          TokenPlan（tokenplan.link）是一个**独立的 AI 编程订阅垂直对比站**，
          与 tokenplan.toolsetlink.com 等同主题竞品无任何关系，本站内容与品牌完全自主运营。
        </p>

        <h2 className="mt-6 text-xl font-bold">我们整理哪些信息</h2>
        <p className="mt-2 text-slate-600">
          我们将 Coding Plan（AI 编程专属）、Token Plan（API 额度池）、Agent Plan（联网多模态 Agent）
          三类套餐的价格、优惠、额度、重置周期、限速、模型能力、IDE 工具兼容、官网入口放入统一框架，帮助用户快速选型。
        </p>

        <h2 className="mt-6 text-xl font-bold">数据来源与整理方法</h2>
        <p className="mt-2 text-slate-600">
          资料主要来自厂商官网、价格页、产品文档及公开控制台信息。所有条目标注最后核验日期；
          厂商规则可能变化，最终请以厂商官网结算页面为准。
        </p>

        <h2 className="mt-6 text-xl font-bold">自动更新机制</h2>
        <p className="mt-2 text-slate-600">
          GitHub Actions 每天 UTC 03:47 自动重新构建站点并向搜索引擎提交 IndexNow。
          核心价格与额度变动会在官方页面指纹检测后人工核验更新。
        </p>

        <h2 className="mt-6 text-xl font-bold">我们与厂商的关系</h2>
        <p className="mt-2 text-slate-600">
          TokenPlan 是独立对比站，不是所列厂商的官方网站，也不代表厂商作出任何承诺。
          部分外部链接可能包含推广参数并产生推广收益，但商业关系不影响比较维度和信息更正。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold">官方来源清单</h2>
        <ul className="mt-4 space-y-2">
          {sources.map((s) => (
            <li key={s.id} className="text-sm">
              <span className="font-medium text-slate-800">{s.name}</span>
              {" · "}
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 break-all"
              >
                {s.url}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
