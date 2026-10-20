import type { Metadata } from "next";
import { Container, BreadcrumbJsonLd } from "@/components/geo";
import { LatencyTable } from "@/components/latency-probe";
import latencyJson from "@/data/latency.json";

export const metadata: Metadata = {
  title: "API 测速 | 各平台大模型 API 接入延迟实测",
  description:
    "实测火山方舟、智谱、阿里云百炼、腾讯混元、MiniMax、Kimi、OpenRouter 等平台大模型 API 的首包延迟与可达性：每次构建自动探测，并支持从访客自身网络一键复测。",
  alternates: { canonical: "https://tokenplan.link/latency/" },
};

type Row = {
  platform: string;
  model: string;
  endpoint: string;
  p50: number | null;
  p95: number | null;
  successRate: number;
  samples: number;
};

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

export default function LatencyPage() {
  const rows = (latencyJson.results as Row[]) ?? [];
  const reachable = rows.filter((r) => r.p50 !== null);
  const fastest = reachable.slice().sort((a, b) => (a.p50 ?? 0) - (b.p50 ?? 0))[0];
  const slowest = reachable.slice().sort((a, b) => (b.p50 ?? 0) - (a.p50 ?? 0))[0];

  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "测速", url: "https://tokenplan.link/latency/" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">API 接入延迟实测</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          每次站点构建时自动向各平台 API 端点发起未鉴权探测，测量网络与网关的首包响应时间；
          你也可以点击「从我的网络实测」，获取你当前所在地网络到各平台的真实延迟。
        </p>
        <p className="mt-2 text-sm text-slate-500">
          最近探测：{formatTime(latencyJson.checkedAt)}（{latencyJson.probeNode}）·
          每端点采样 {latencyJson.samples} 次 · {reachable.length}/{rows.length} 个端点可达
        </p>
      </header>

      {fastest && (
        <section className="mb-8 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <p className="text-slate-800">
            <strong>本次探测结论：</strong>
            首包延迟最低的是<strong className="text-blue-700">{fastest.platform}</strong>
            （p50 {fastest.p50}ms），最高的是 {slowest.platform}（p50 {slowest.p50}ms）。
            该数据反映<strong>网络与网关接入速度</strong>，受探测节点位置影响很大，
            不代表模型生成速度；请以「从我的网络实测」结果作为你本地选型参考。
          </p>
        </section>
      )}

      <section className="mb-10">
        <LatencyTable baseline={rows} />
        <div className="mt-3 text-xs text-slate-500">
          着色规则：p50/p95 {"<"}300ms 绿色，300-900ms 黄色，{">"}900ms 红色；
          探测成功率 ≥90% 绿色，50-90% 黄色，{"<"}50% 红色。
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 p-5">
        <h2 className="font-bold text-slate-900">测速口径说明（重要）</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>• 测的是什么：未携带 API Key 的最小请求，收到 401/403/404 等任意 HTTP 响应即计为一次成功首包，衡量「网络连通 + 网关响应」时间。</li>
          <li>• 不测什么：不测模型推理/首 token 生成（TTFT），那需要有效 Key 和真实 prompt，与模型负载相关，本站不做模拟值。</li>
          <li>• 刷新频率：构建基线数据随站点部署自动刷新（每日定时构建 + 每次代码发布）；「从我的网络实测」是你浏览器的实时结果，不会上传。</li>
          <li>• 为什么各家差异大：探测节点地理位置、网关鉴权层实现、是否走边缘加速都会影响首包时间，跨网络环境结果可能完全不同。</li>
        </ul>
      </section>
    </Container>
  );
}
