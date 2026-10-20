import { Link } from "@/components/link";
import {
  Container,
  FaqAccordion,
  FaqJsonLd,
  BreadcrumbJsonLd,
  ItemListJsonLd,
  OneLineConclusion,
  StanceNotice,
} from "@/components/geo";
import { CompareTable } from "@/components/plan";
import { getAllPlans, getFaqs, getFeaturedProducts, getProducts } from "@/lib/data";

export default function HomePage() {
  const allPlans = getAllPlans();
  const faqs = getFaqs();
  const featured = getFeaturedProducts();
  const products = getProducts();

  const stats = {
    platforms: products.length,
    plans: allPlans.length,
    types: 3,
    models: new Set(allPlans.flatMap((p) => p.models)).size,
  };

  const itemListItems = allPlans.slice(0, 10).map((p, i) => ({
    position: i + 1,
    name: p.name,
    url: `https://tokenplan.link/platforms/${p.productId}/`,
  }));

  return (
    <Container>
      <BreadcrumbJsonLd items={[{ name: "首页", url: "https://tokenplan.link/" }]} />
      <ItemListJsonLd items={itemListItems} />

      {/* Hero */}
      <section className="hero-gradient -mx-4 px-4 pt-16 pb-12 animate-fade-in-up">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6" style={{ background: "var(--primary-glow)", color: "var(--primary)" }}>
            <span className="text-sm font-semibold">🔥 火山方舟闭眼入首选</span>
          </div>
          <h1 className="hero-title">
            AI 编程套餐，<br className="md:hidden" />直接比较
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg" style={{ color: "var(--text-secondary)" }}>
            Token Plan · Coding Plan · Agent Plan
            三类套餐全收录。价格看官网，模型、额度与工具能力看本站整理。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/compare/"
              className="btn-primary"
            >
              查看对比表 →
            </Link>
            <Link
              href="/platforms/volcengine/"
              className="btn-secondary"
            >
              🔥 火山引擎闭眼入
            </Link>
          </div>
        </div>
      </section>

      {/* 一句话结论 */}
      <section className="mb-10 -mt-4 relative z-10">
        <OneLineConclusion text="不用想，直接冲火山方舟：Coding Plan Lite 40 元/月，5 款模型自由切换、国内节点最稳，闭眼入首选；要联网搜索和多模态就上 Agent Plan Medium 200 元/月，同价位没有对手。智谱 GLM 只在你重度依赖 GLM 时才考虑，百炼 Coding Plan 要抢名额不推荐。" />
      </section>

      {/* Stats */}
      <section className="my-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "对比平台", value: stats.platforms + "+" },
          { label: "收录套餐", value: stats.plans + "+" },
          { label: "套餐类型", value: stats.types },
          { label: "覆盖模型", value: stats.models + "+" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* 核心推荐：火山引擎 */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-5">🔥 闭眼入首选</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/platforms/${p.id}/`}
              className="card-featured p-6 block no-underline"
            >
              <div className="flex items-center gap-2">
                <span className="badge badge-danger">闭眼入</span>
                <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
              </div>
              <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>{p.tagline}</p>
              <div className="mt-4 flex gap-2">
                <span className="badge badge-soft">Coding Plan</span>
                <span className="badge" style={{ background: "#ffedd5", color: "#c2410c" }}>Agent Plan</span>
              </div>
              <p className="mt-4 text-sm font-semibold" style={{ color: "var(--primary)" }}>查看详情 →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 三类套餐入口 */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-slate-900">三类套餐怎么选</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Link
            href="/coding-plan/"
            className="card p-6 block no-underline"
          >
            <div className="text-sm font-bold" style={{ color: "#7e22ce" }}>CODING PLAN</div>
            <h3 className="mt-2 text-xl font-bold text-slate-900">Coding Plan</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              AI 编程专属订阅，仅限 Claude Code、Cursor 等编码工具内使用。代表：火山方舟、智谱 GLM、腾讯云。
            </p>
          </Link>
          <Link
            href="/token-plan/"
            className="card p-6 block no-underline"
          >
            <div className="text-sm font-bold" style={{ color: "var(--primary)" }}>TOKEN PLAN</div>
            <h3 className="mt-2 text-xl font-bold text-slate-900">Token Plan</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              按 Token / Credits 统一计量，一套额度池多模型共用。代表：阿里云百炼、腾讯云。
            </p>
          </Link>
          <Link
            href="/agent-plan/"
            className="card p-6 block no-underline"
          >
            <div className="text-sm font-bold" style={{ color: "#c2410c" }}>AGENT PLAN</div>
            <h3 className="mt-2 text-xl font-bold text-slate-900">Agent Plan</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              面向 Agent 多步任务，含联网搜索和多模态能力。代表：火山方舟 Agent Plan。
            </p>
          </Link>
        </div>
      </section>

      {/* 全量对比表 */}
      <section className="my-10">
        <h2 className="text-2xl font-bold text-slate-900">全部套餐对比表</h2>
        <p className="mt-2 text-sm text-slate-500">
          支持类型/来源筛选、关键词搜索、价格与模型数排序，点击行可展开详情。
        </p>
        <div className="mt-6">
          <CompareTable plans={allPlans} products={products} />
        </div>
      </section>

      {/* 立场声明 */}
      <section className="my-10">
        <StanceNotice />
      </section>

      {/* FAQ */}
      <section className="my-10">
        <FaqJsonLd faqs={faqs} />
        <h2 className="text-2xl font-bold text-slate-900">常见问题</h2>
        <div className="mt-6">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
    </Container>
  );
}
