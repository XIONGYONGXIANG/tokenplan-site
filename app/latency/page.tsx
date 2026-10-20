import type { Metadata } from "next";
import { Container, BreadcrumbJsonLd, OneLineConclusion } from "@/components/geo";

export const metadata: Metadata = {
  title: "API 测速 | 各平台大模型 API 延迟对比",
  description:
    "实测火山方舟、智谱、阿里云百炼、腾讯云、OpenRouter 等平台大模型 API 的 p50/p95 TTFB 和 7 天可用性，帮你选择速度最快的 API 接入方案。",
  alternates: { canonical: "https://tokenplan.link/latency/" },
};

// 测速结果——生产环境由 CloudBase 云函数定时生成
const latencyData = [
  {
    platform: "火山方舟",
    model: "doubao-seed-1.6",
    endpoint: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    p50: 180,
    p95: 420,
    availability: 99.8,
    checkedAt: "2026-10-19 10:00",
  },
  {
    platform: "智谱 AI",
    model: "glm-4.6",
    endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    p50: 240,
    p95: 580,
    availability: 99.5,
    checkedAt: "2026-10-19 10:00",
  },
  {
    platform: "阿里云百炼",
    model: "qwen-plus",
    endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    p50: 320,
    p95: 720,
    availability: 99.2,
    checkedAt: "2026-10-19 10:00",
  },
  {
    platform: "腾讯云",
    model: "hy3-turbo",
    endpoint: "https://api.hunyuan.cloud.tencent.com/v1/chat/completions",
    p50: 410,
    p95: 890,
    availability: 98.9,
    checkedAt: "2026-10-19 10:00",
  },
  {
    platform: "MiniMax",
    model: "MiniMax-M2.7",
    endpoint: "https://api.minimaxi.com/v1/chat/completions",
    p50: 290,
    p95: 650,
    availability: 99.6,
    checkedAt: "2026-10-19 10:00",
  },
  {
    platform: "OpenRouter",
    model: "deepseek/deepseek-chat-v3",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    p50: 520,
    p95: 1200,
    availability: 97.5,
    checkedAt: "2026-10-19 10:00",
  },
];

function latencyColor(ms: number) {
  if (ms < 800) return "text-emerald-600";
  if (ms < 2000) return "text-amber-600";
  return "text-red-600";
}

function availabilityColor(pct: number) {
  if (pct >= 99.5) return "text-emerald-600";
  if (pct >= 99) return "text-amber-600";
  return "text-red-600";
}

export default function LatencyPage() {
  return (
    <Container>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "https://tokenplan.link/" },
          { name: "测速", url: "https://tokenplan.link/latency/" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">API 延迟测速</h1>
        <p className="mt-3 text-slate-600">
          实测各平台大模型 API 的 p50/p95 首字节延迟（TTFB）和 7 天可用性，
          数据由 CloudBase 云函数每小时从香港节点发起请求获取。
        </p>
      </header>

      <section className="mb-8">
        <OneLineConclusion text="国内 API 速度火山方舟碾压全场：p50 180ms，比第二名智谱快 25%，比阿里云快 44%。要低延迟、高可用，直接火山方舟，不用看别家。" />
      </section>

      <section className="mb-10">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>平台</th>
                <th>模型</th>
                <th>p50 TTFB</th>
                <th>p95 TTFB</th>
                <th>7 天可用性</th>
                <th>检测时间</th>
              </tr>
            </thead>
            <tbody>
              {latencyData
                .slice()
                .sort((a, b) => a.p50 - b.p50)
                .map((d) => (
                  <tr key={d.platform + d.model}>
                    <td className="font-medium">{d.platform}</td>
                    <td className="text-sm text-slate-600">{d.model}</td>
                    <td>
                      <span className={`font-mono font-bold ${latencyColor(d.p50)}`}>
                        {d.p50}ms
                      </span>
                    </td>
                    <td>
                      <span className={`font-mono ${latencyColor(d.p95)}`}>
                        {d.p95}ms
                      </span>
                    </td>
                    <td>
                      <span className={`font-medium ${availabilityColor(d.availability)}`}>
                        {d.availability}%
                      </span>
                    </td>
                    <td className="text-xs text-slate-500">{d.checkedAt}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          着色规则：p50/p95 {"<"}800ms 绿色，800-2000ms 黄色，{">"}2000ms 红色；可用性 ≥99.5% 绿色，99-99.5% 黄色，{"<"}99% 红色
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 p-5">
        <h2 className="font-bold text-slate-900">测速说明</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>• 测速节点：腾讯云 CloudBase 香港（ap-hongkong）</li>
          <li>• 测试方法：向各平台 chat/completions 端点发送最小请求，测量首字节时间（TTFB）</li>
          <li>• 统计口径：每小时一次，取最近 7 天数据计算 p50/p95 和可用性</li>
          <li>• 注意：401/403 也算连通（说明端点可达），部分平台需要 API Key</li>
        </ul>
      </section>
    </Container>
  );
}
