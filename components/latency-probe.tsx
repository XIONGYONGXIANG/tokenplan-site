"use client";

import { useState } from "react";

type BaselineRow = {
  platform: string;
  model: string;
  endpoint: string;
  p50: number | null;
  p95: number | null;
  successRate: number;
  samples: number;
};

type ProbeState = "idle" | "running" | "done" | "fail";

const PROBE_SAMPLES = 4;
const PROBE_TIMEOUT = 8000;

function msColor(ms: number | null) {
  if (ms === null) return "text-red-600";
  if (ms < 300) return "text-emerald-600";
  if (ms < 900) return "text-amber-600";
  return "text-red-600";
}

async function probeVisitor(endpoint: string): Promise<number | null> {
  const samples: number[] = [];
  for (let i = 0; i < PROBE_SAMPLES; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), PROBE_TIMEOUT);
    const start = performance.now();
    try {
      // 简单 GET + no-cors：不触发预检；响应为 opaque，但拿到响应头即计时结束
      await fetch(endpoint, {
        method: "GET",
        mode: "no-cors",
        redirect: "follow",
        cache: "no-store",
        signal: ctrl.signal,
      });
      samples.push(performance.now() - start);
    } catch {
      // 超时/网络不可达 → 记为失败
    } finally {
      clearTimeout(timer);
    }
  }
  if (samples.length === 0) return null;
  samples.sort((a, b) => a - b);
  return Math.round(samples[Math.floor(samples.length / 2)]);
}

export function LatencyTable({
  baseline,
}: {
  baseline: BaselineRow[];
}) {
  const [state, setState] = useState<ProbeState>("idle");
  const [visitor, setVisitor] = useState<Record<string, number | null>>({});

  async function runProbe() {
    setState("running");
    setVisitor({});
    // 逐个端点测，避免并发抢带宽失真
    for (const row of baseline) {
      const ms = await probeVisitor(row.endpoint);
      setVisitor((prev) => ({ ...prev, [row.platform]: ms }));
    }
    setState("done");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={runProbe}
          disabled={state === "running"}
          className="btn-primary disabled:opacity-60"
        >
          {state === "running" ? "正在从你的网络实测…" : "从我的网络实测"}
        </button>
        {state === "running" && (
          <span className="text-sm text-slate-500">
            每个端点采样 {PROBE_SAMPLES} 次，取中位数
          </span>
        )}
        {state === "done" && (
          <span className="text-sm text-slate-500">
            实测完成——结果是你当前网络到各网关的真实首包时间
          </span>
        )}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>平台</th>
              <th>模型</th>
              <th>构建节点 p50</th>
              <th>构建节点 p95</th>
              <th>你的网络 p50</th>
              <th>探测成功率</th>
            </tr>
          </thead>
          <tbody>
            {baseline
              .slice()
              .sort((a, b) => (a.p50 ?? 99999) - (b.p50 ?? 99999))
              .map((row) => {
                const v = visitor[row.platform];
                return (
                  <tr key={row.platform + row.model}>
                    <td className="font-medium">{row.platform}</td>
                    <td className="text-sm text-slate-600">{row.model}</td>
                    <td>
                      <span className={`font-mono font-bold ${msColor(row.p50)}`}>
                        {row.p50 === null ? "不可达" : `${row.p50}ms`}
                      </span>
                    </td>
                    <td>
                      <span className={`font-mono ${msColor(row.p95)}`}>
                        {row.p95 === null ? "-" : `${row.p95}ms`}
                      </span>
                    </td>
                    <td>
                      {state === "idle" ? (
                        <span className="text-xs text-slate-400">点上方按钮实测</span>
                      ) : v === undefined ? (
                        <span className="text-xs text-slate-400">等待中…</span>
                      ) : v === null ? (
                        <span className="font-mono text-red-600">超时/拦截</span>
                      ) : (
                        <span className={`font-mono font-bold ${msColor(v)}`}>
                          {v}ms
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`font-medium ${
                          row.successRate >= 0.9
                            ? "text-emerald-600"
                            : row.successRate >= 0.5
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {Math.round(row.successRate * 100)}%
                      </span>
                      <span className="text-xs text-slate-400">
                        {" "}
                        ({row.samples}/7 次)
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
