// 构建时真实探测各平台 API 首包延迟（无需 API Key）
// 原理：向 chat/completions 端点发最小未鉴权请求，401/403/404 都说明端点可达，
//       fetch 在收到响应头时即返回，测得的是「网络 + 网关首包时间」，不是模型生成 TTFB。
// 产出：data/latency.json（SSG 构建时打进 /latency 页面，供爬虫读取）
// 兜底：全部探测失败时保留旧 data/latency.json，保证离线构建不挂。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_FILE = path.join(ROOT, "data", "latency.json");

const SAMPLES = 7; // 每个端点采样次数
const TIMEOUT_MS = 8000;

const TARGETS = [
  {
    platform: "火山方舟",
    model: "doubao-seed",
    endpoint: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
  },
  {
    platform: "智谱 AI",
    model: "glm-4.6",
    endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
  },
  {
    platform: "阿里云百炼",
    model: "qwen-plus",
    endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  },
  {
    platform: "腾讯云混元",
    model: "hunyuan-turbo",
    endpoint: "https://api.hunyuan.cloud.tencent.com/v1/chat/completions",
  },
  {
    platform: "MiniMax",
    model: "MiniMax-M2.7",
    endpoint: "https://api.minimaxi.com/v1/chat/completions",
  },
  {
    platform: "Kimi（月之暗面）",
    model: "kimi-k2.5",
    endpoint: "https://api.moonshot.cn/v1/chat/completions",
  },
  {
    platform: "OpenRouter",
    model: "deepseek/deepseek-chat",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
  },
];

// 最近秩百分位
function percentile(sortedAsc, p) {
  if (sortedAsc.length === 0) return null;
  const rank = Math.ceil(p * sortedAsc.length);
  return sortedAsc[Math.max(0, Math.min(sortedAsc.length - 1, rank - 1))];
}

async function probeOnce(target) {
  const start = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(target.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: target.model,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
      }),
      signal: ctrl.signal,
    });
    // 不关心业务状态码：拿到响应头即代表端点可达
    await res.body?.cancel?.().catch(() => {});
    return { ms: Date.now() - start, ok: true, status: res.status };
  } catch (e) {
    return { ms: null, ok: false, error: String(e?.message || e).slice(0, 80) };
  } finally {
    clearTimeout(timer);
  }
}

async function measureTarget(target) {
  const samples = [];
  const statuses = [];
  for (let i = 0; i < SAMPLES; i++) {
    const r = await probeOnce(target);
    if (r.ok) {
      samples.push(r.ms);
      statuses.push(r.status);
    }
    // 轻微间隔，避免被当成突发流量
    await new Promise((r) => setTimeout(r, 150));
  }
  const sorted = samples.slice().sort((a, b) => a - b);
  return {
    platform: target.platform,
    model: target.model,
    endpoint: target.endpoint,
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    min: sorted[0] ?? null,
    successRate: Number((samples.length / SAMPLES).toFixed(2)),
    samples: samples.length,
    statusHint: statuses[0] ?? null,
  };
}

async function main() {
  const probeNode = process.env.GITHUB_ACTIONS
    ? "GitHub Actions 境外构建节点"
    : "本地构建节点";

  console.log(`[latency] 开始探测 ${TARGETS.length} 个端点 × ${SAMPLES} 次（${probeNode}）`);
  // 各端点之间并发，端点内串行
  const results = await Promise.all(TARGETS.map(measureTarget));
  const reachable = results.filter((r) => r.p50 !== null).length;
  console.log(`[latency] ${reachable}/${TARGETS.length} 个端点可达`);
  for (const r of results) {
    console.log(
      `  - ${r.platform.padEnd(14)} p50=${r.p50 === null ? "FAIL" : r.p50 + "ms"} ` +
        `p95=${r.p95 ?? "-"} 成功率=${(r.successRate * 100) | 0}% 状态码=${r.statusHint ?? "-"}`
    );
  }

  if (reachable === 0) {
    if (fs.existsSync(OUT_FILE)) {
      console.warn("[latency] 全部端点不可达，保留上一次 data/latency.json");
      return;
    }
    console.warn("[latency] 全部端点不可达且无历史文件，写入空结果");
  }

  const payload = {
    checkedAt: new Date().toISOString(),
    probeNode,
    samples: SAMPLES,
    note: "未鉴权首包探测：测量网络与网关响应时间，非模型生成 TTFB；每日随站点构建刷新。",
    results,
  };
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + "\n");
  console.log(`[latency] 已写入 ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((e) => {
  console.error("[latency] 探测任务异常：", e);
  // 异常不阻断构建（只要历史文件在）
  process.exit(0);
});
