import type { Metadata } from "next";
import { Container, BreadcrumbJsonLd } from "@/components/geo";
import { getSources } from "@/lib/data";

export const metadata: Metadata = {
  title: "关于 TokenPlan.link",
  description:
    "TokenPlan.link 是独立的 AI 编程套餐对比站，整理 Token Plan、Coding Plan、Agent Plan 的价格、额度与模型信息，数据均来自厂商官方页面。",
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
        <h1 className="text-3xl font-bold text-slate-900">关于 TokenPlan.link</h1>
        <p className="mt-3 text-slate-600">
          更新日期：2026-10-19
        </p>
      </header>

      <section className="mb-8 prose max-w-none">
        <h2 className="text-xl font-bold">专注 AI 编程套餐对比</h2>
        <p className="mt-2 text-slate-600">
          TokenPlan.link 是 AI Token Plan、Coding Plan、Agent Plan
          垂直价格对比与选型资料站，服务个人开发者、AI 编程用户、技术团队及 API 接入团队。
        </p>

        <h2 className="mt-6 text-xl font-bold">我们整理哪些信息</h2>
        <p className="mt-2 text-slate-600">
          我们将套餐价格、优惠、额度、重置周期、限速、模型能力、IDE Tools
          与编程工具接入、官网入口信息放入统一框架，帮助用户进行选型。
        </p>

        <h2 className="mt-6 text-xl font-bold">数据来源与整理方法</h2>
        <p className="mt-2 text-slate-600">
          资料主要来自厂商官网、价格页、产品文档及公开控制台信息。编辑团队按统一维度整理并交叉核对；
          由于厂商规则可能变化，最终信息应以厂商官网和结算页面为准。
        </p>

        <h2 className="mt-6 text-xl font-bold">自动更新机制</h2>
        <p className="mt-2 text-slate-600">
          GitHub Actions 每 4 小时检查下方列出的官方来源页面，比对 HTTP 状态和正文指纹。
          检测到变化时创建审核 Issue，人工核验后更新数据。所有事实记录官方来源与最后核验日期。
        </p>

        <h2 className="mt-6 text-xl font-bold">与 AI 厂商的关系</h2>
        <p className="mt-2 text-slate-600">
          TokenPlan.link 是独立对比站，不是所列厂商的官方网站，也不代表厂商作出承诺。
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
