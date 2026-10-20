"use client";

import { useState, useMemo } from "react";
import type { Plan, Product } from "@/lib/schema";
import { TypeBadge, VerifiedBadge } from "@/components/geo";

type SortKey = "default" | "price-asc" | "price-desc" | "perYuan" | "models";

interface CompareTableProps {
  plans: Plan[];
  products: Product[];
}

function getProductById(id: string, products: Product[]) {
  return products.find((p) => p.id === id);
}

export function CompareTable({ plans, products }: CompareTableProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = [...plans];

    if (typeFilter !== "all") {
      result = result.filter((p) => p.type === typeFilter);
    }
    if (sourceFilter !== "all") {
      result = result.filter((p) => {
        const product = getProductById(p.productId, products);
        return product?.category === sourceFilter;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => {
        const product = getProductById(p.productId, products);
        return (
          p.name.toLowerCase().includes(q) ||
          product?.name.toLowerCase().includes(q) ||
          p.models.some((m) => m.toLowerCase().includes(q))
        );
      });
    }

    switch (sortKey) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "models":
        result.sort((a, b) => (b.modelCount ?? 0) - (a.modelCount ?? 0));
        break;
    }

    return result;
  }, [plans, typeFilter, sourceFilter, search, sortKey]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* 筛选栏 */}
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-input"
        >
          <option value="all">全部类型</option>
          <option value="coding">Coding Plan</option>
          <option value="token">Token Plan</option>
          <option value="agent">Agent Plan</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="filter-input"
        >
          <option value="all">全部来源</option>
          <option value="大厂">大厂</option>
          <option value="国内">国内</option>
          <option value="国际">国际</option>
        </select>

        <input
          type="text"
          placeholder="🔍 搜索平台或模型..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input flex-1 min-w-[200px]"
        />

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="filter-input"
        >
          <option value="default">默认排序</option>
          <option value="price-asc">价格低到高</option>
          <option value="price-desc">价格高到低</option>
          <option value="models">模型数多到少</option>
        </select>
      </div>

      <div className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
        共 {filtered.length} 个套餐 · 数据最后核验：2026-10-19
      </div>

      {/* 对比表 */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>套餐名称</th>
              <th>类型</th>
              <th>价格</th>
              <th>首月说明</th>
              <th>计费单位</th>
              <th>5h限额</th>
              <th>月度额度</th>
              <th>每元额度</th>
              <th>模型数</th>
              <th>工具数</th>
              <th>档位</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const product = getProductById(p.productId, products);
              const isExpanded = expanded.has(p.id);
              return (
                <>
                  <tr key={p.id}>
                    <td>
                      <button
                        onClick={() => toggleExpand(p.id)}
                        className="text-left font-medium text-blue-600 hover:underline"
                      >
                        {isExpanded ? "▼ " : "▶ "}
                        {p.name}
                      </button>
                      <div className="text-xs text-slate-500">
                        {product?.shortName}
                      </div>
                    </td>
                    <td>
                      <TypeBadge type={p.type} />
                    </td>
                    <td className="whitespace-nowrap font-semibold">
                      ¥{p.price}
                    </td>
                    <td className="text-xs text-slate-600">
                      {p.firstMonthNote || "—"}
                    </td>
                    <td>{p.billingUnit}</td>
                    <td className="text-xs text-slate-600">
                      {p.limits.fiveHour || "—"}
                    </td>
                    <td className="text-xs text-slate-600">
                      {p.limits.monthly || "—"}
                    </td>
                    <td className="text-xs text-slate-600">
                      {p.perYuanQuota || "—"}
                    </td>
                    <td>{p.modelCount ?? "—"}</td>
                    <td>{p.toolCount ?? "—"}</td>
                    <td>{p.tier}</td>
                    <td>
                      <a
                        href={p.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        购买 →
                      </a>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={p.id + "-detail"} className="bg-slate-50">
                      <td colSpan={12} className="p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-2">
                              支持模型
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {p.models.map((m, i) => (
                                <span
                                  key={i}
                                  className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                          {p.tools.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-2">
                                支持工具
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {p.tools.map((t, i) => (
                                  <span
                                    key={i}
                                    className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {p.highlights.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-2">
                                亮点
                              </h4>
                              <ul className="space-y-1">
                                {p.highlights.map((h, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-slate-600"
                                  >
                                    <span className="text-emerald-500">✓</span>
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {p.caveats && p.caveats.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-2">
                                注意事项
                              </h4>
                              <ul className="space-y-1">
                                {p.caveats.map((c, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-slate-500"
                                  >
                                    <span className="text-amber-500">⚠</span>
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <VerifiedBadge date={p.verifiedAt} />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 套餐卡片（用于厂商详情页） */
export function PlanCard({ plan, product }: { plan: Plan; product?: Product }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {product?.name} · {plan.tier} 档
          </p>
        </div>
        <TypeBadge type={plan.type} />
      </div>

      <div className="mt-4">
        <span className="text-3xl font-extrabold" style={{ color: "var(--primary)" }}>¥{plan.price}</span>
        <span style={{ color: "var(--text-muted)" }}>/{plan.billingUnit}</span>
        {plan.firstMonthNote && (
          <p className="mt-1 text-xs font-medium" style={{ color: "var(--accent-warm)" }}>{plan.firstMonthNote}</p>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div>
          <span className="font-medium text-slate-700">模型（{plan.modelCount ?? 0}）：</span>
          <span className="text-slate-600">{plan.models.join("、")}</span>
        </div>
        {plan.tools.length > 0 && (
          <div>
            <span className="font-medium text-slate-700">工具（{plan.toolCount ?? 0}）：</span>
            <span className="text-slate-600">{plan.tools.join("、")}</span>
          </div>
        )}
        <div>
          <span className="font-medium text-slate-700">额度：</span>
          <span className="text-slate-600">
            {plan.limits.fiveHour && `5小时 ${plan.limits.fiveHour} · `}
            {plan.limits.weekly && `每周 ${plan.limits.weekly} · `}
            {plan.limits.monthly || "—"}
          </span>
        </div>
        {plan.perYuanQuota && (
          <div>
            <span className="font-medium text-slate-700">每元额度：</span>
            <span className="text-slate-600">{plan.perYuanQuota}</span>
          </div>
        )}
      </div>

      {plan.highlights.length > 0 && (
        <ul className="mt-4 space-y-1">
          {plan.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-emerald-500">✓</span>
              {h}
            </li>
          ))}
        </ul>
      )}

      {plan.caveats && plan.caveats.length > 0 && (
        <ul className="mt-3 space-y-1">
          {plan.caveats.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
              <span className="text-amber-500">⚠</span>
              {c}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-center justify-between">
        <VerifiedBadge date={plan.verifiedAt} />
        <a
          href={plan.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary no-underline text-sm"
          style={{ padding: "0.5rem 1rem" }}
        >
          前往官网 →
        </a>
      </div>
    </div>
  );
}

export function PlansGrid({ plans, products }: { plans: Plan[]; products: Product[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {plans.map((p) => (
        <PlanCard key={p.id} plan={p} product={getProductById(p.productId, products)} />
      ))}
    </div>
  );
}
