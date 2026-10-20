import fs from "fs";
import path from "path";
import YAML from "yaml";
import {
  PlanSchema,
  ProductSchema,
  SourceSchema,
  FaqSchema,
  ArticleSchema,
  type Plan,
  type Product,
  type Source,
  type Faq,
  type Article,
} from "./schema";

const DATA_DIR = path.join(process.cwd(), "data");

function loadYaml<T>(filename: string): T {
  const raw = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
  return YAML.parse(raw) as T;
}

export function getProducts(): Product[] {
  const data = loadYaml<{ products: Product[] }>("products.yml");
  return data.products.map((p) => ProductSchema.parse(p));
}

export function getTokenPlans(): Plan[] {
  const data = loadYaml<{ plans: Plan[] }>("token-plans.yml");
  return data.plans.map((p) => PlanSchema.parse(p));
}

export function getCodingPlans(): Plan[] {
  const data = loadYaml<{ plans: Plan[] }>("coding-plans.yml");
  return data.plans.map((p) => PlanSchema.parse(p));
}

export function getAgentPlans(): Plan[] {
  const data = loadYaml<{ plans: Plan[] }>("agent-plans.yml");
  return data.plans.map((p) => PlanSchema.parse(p));
}

export function getAllPlans(): Plan[] {
  return [...getTokenPlans(), ...getCodingPlans(), ...getAgentPlans()];
}

export function getSources(): Source[] {
  const data = loadYaml<{ sources: Source[] }>("sources.yml");
  return data.sources.map((s) => SourceSchema.parse(s));
}

export function getFaqs(): Faq[] {
  const data = loadYaml<{ faqs: Faq[] }>("faq.yml");
  return data.faqs.map((f) => FaqSchema.parse(f));
}

export function getArticles(): Article[] {
  const data = loadYaml<{ articles: Article[] }>("articles.yml");
  return data.articles.map((a) => ArticleSchema.parse(a));
}

export function getArticleById(id: string): Article | undefined {
  return getArticles().find((a) => a.id === id);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function getPlansByProduct(productId: string): Plan[] {
  return getAllPlans().filter((p) => p.productId === productId);
}

export function getArticlesByProduct(productId: string): Article[] {
  return getArticles().filter((a) => a.productId === productId);
}

export function getPlansByType(type: "token" | "coding" | "agent"): Plan[] {
  if (type === "token") return getTokenPlans();
  if (type === "coding") return getCodingPlans();
  return getAgentPlans();
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((p) => p.featured);
}
