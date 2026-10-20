// 自动检查官方来源页面的可访问性和正文指纹变化
// 检测到变化或失效时输出告警（GitHub Actions 中可进一步创建 Issue）
import fs from "fs";
import path from "path";
import YAML from "yaml";

const DATA_DIR = path.join(process.cwd(), "data");
const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "source-fingerprints.json");

function loadSources() {
  const raw = fs.readFileSync(path.join(DATA_DIR, "sources.yml"), "utf-8");
  const data = YAML.parse(raw);
  return data.sources;
}

function loadFingerprints() {
  if (!fs.existsSync(CACHE_FILE)) return {};
  return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
}

function saveFingerprints(fp) {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(fp, null, 2));
}

// 简单的正文去噪：移除 script/style/空白，取前 2000 字符的 hash
function fingerprint(text) {
  const cleaned = text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
  let hash = 0;
  for (let i = 0; i < cleaned.length; i++) {
    hash = (hash << 5) - hash + cleaned.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

async function checkSource(source) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: { "User-Agent": "TokenPlanBot/1.0" },
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { id: source.id, name: source.name, status: "error", code: res.status };
    }

    const text = await res.text();
    const fp = fingerprint(text);
    return { id: source.id, name: source.name, status: "ok", fingerprint: fp };
  } catch (e) {
    return {
      id: source.id,
      name: source.name,
      status: "error",
      message: e.message,
    };
  }
}

async function main() {
  const sources = loadSources();
  const oldFp = loadFingerprints();
  const newFp = { ...oldFp };
  const changes = [];
  const errors = [];

  console.log(`检查 ${sources.length} 个来源...`);

  for (const source of sources) {
    const result = await checkSource(source);
    if (result.status === "error") {
      errors.push(result);
      console.error(`❌ ${result.name}: ${result.code || result.message}`);
    } else {
      const prev = oldFp[result.id];
      if (prev && prev !== result.fingerprint) {
        changes.push(result);
        console.log(`🔄 ${result.name}: 内容已变化`);
      } else {
        console.log(`✓ ${result.name}`);
      }
      newFp[result.id] = result.fingerprint;
    }
  }

  saveFingerprints(newFp);

  console.log(`\n完成：${sources.length - errors.length} 正常，${errors.length} 异常，${changes.length} 变化`);

  if (errors.length > 0 || changes.length > 0) {
    process.exitCode = 1;
  }
}

main();
