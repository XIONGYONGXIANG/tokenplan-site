import { z } from "zod";

export const PlanSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  type: z.enum(["coding", "token", "agent"]),
  tier: z.string(),
  price: z.number(),
  priceCurrency: z.enum(["CNY", "USD"]),
  priceNote: z.string().optional(),
  firstMonthNote: z.string().optional(),
  billingUnit: z.string(), // 计费单位：月 / 季 / 年
  limits: z.object({
    fiveHour: z.string().nullable(),
    weekly: z.string().nullable(),
    monthly: z.string().nullable(),
  }),
  perYuanQuota: z.string().nullable(), // 每元额度，仅同类口径内填，否则留空
  modelCount: z.number().optional(),
  toolCount: z.number().optional(),
  models: z.array(z.string()),
  tools: z.array(z.string()),
  highlights: z.array(z.string()),
  caveats: z.array(z.string()).optional(),
  officialUrl: z.string(),
  verifiedAt: z.string(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  category: z.enum(["大厂", "国内", "国际"]),
  featured: z.boolean().optional(),
  tagline: z.string().optional(),
  officialUrl: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
});

export const SourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  productId: z.string(),
  type: z.string(),
  category: z.enum(["official", "api", "third-party"]),
});

export const FaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  productId: z.string(),
  summary: z.string(),
  changes: z.array(z.string()),
  sourceUrl: z.string(),
});

// ===== 答案型指南（GEO 问答内容，人工维护）=====

export const GuideTableSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  // 可选：表格说明（caption），帮助 AI 理解表格口径
  caption: z.string().optional(),
});

export const GuideSectionSchema = z.object({
  heading: z.string(),
  paragraphs: z.array(z.string()).optional(),
  bullets: z.array(z.string()).optional(),
  table: GuideTableSchema.optional(),
});

export const GuideLinkSchema = z.object({
  label: z.string(),
  href: z.string(), // 站内路径，如 /guides/xxx/ 或 /platforms/volcengine/
});

export const GuideSourceSchema = z.object({
  label: z.string(),
  url: z.string(),
});

export const GuideSchema = z.object({
  id: z.string(),
  title: z.string(), // 对齐用户会问 AI 的原话（问题型标题）
  description: z.string(), // meta description / 摘要
  date: z.string(), // 首次发布
  updated: z.string(), // 最后更新
  conclusion: z.string(), // 一句话结论（首屏直给，AI 易抽取）
  tags: z.array(z.string()).optional(),
  sections: z.array(GuideSectionSchema),
  faqs: z.array(FaqSchema).min(1),
  relatedProductIds: z.array(z.string()).optional(),
  relatedLinks: z.array(GuideLinkSchema).optional(),
  sources: z.array(GuideSourceSchema).optional(),
});

export type Plan = z.infer<typeof PlanSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type Faq = z.infer<typeof FaqSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type Guide = z.infer<typeof GuideSchema>;
export type GuideSection = z.infer<typeof GuideSectionSchema>;
