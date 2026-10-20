// IndexNow 自动提交脚本
// 从 sitemap.xml 读取所有 URL，批量提交到 IndexNow（百度/Bing/Yandex 等）
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE_URL = 'https://tokenplan.link';
const KEY = '9edeff49f607e49083f63147c01a586a';
const SITEMAP_PATH = join(process.cwd(), 'out', 'sitemap.xml');

// 解析 sitemap.xml 提取所有 URL
function parseSitemap(xml) {
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

// 向 IndexNow 批量提交 URL
async function submitToIndexNow(urls) {
  const endpoint = 'https://api.indexnow.org/indexnow';
  const body = JSON.stringify({
    host: 'tokenplan.link',
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList: urls,
  });

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });

  const text = await res.text();
  return { status: res.status, body: text };
}

async function main() {
  console.log('[IndexNow] 开始提交...');

  // 读取 sitemap
  let sitemapXml;
  try {
    sitemapXml = readFileSync(SITEMAP_PATH, 'utf-8');
  } catch (e) {
    console.error(`[IndexNow] 无法读取 sitemap.xml: ${e.message}`);
    process.exit(1);
  }

  const urls = parseSitemap(sitemapXml);
  console.log(`[IndexNow] 共解析到 ${urls.length} 个 URL`);

  if (urls.length === 0) {
    console.log('[IndexNow] 没有 URL 需要提交');
    return;
  }

  // 打印前 3 个 URL 用于确认
  console.log('[IndexNow] 提交 URL 示例:', urls.slice(0, 3));

  // 提交到 IndexNow
  const result = await submitToIndexNow(urls);
  console.log(`[IndexNow] API 响应: status=${result.status}`);
  console.log(`[IndexNow] 响应内容: ${result.body}`);

  if (result.status >= 200 && result.status < 300) {
    console.log(`[IndexNow] ✅ 成功提交 ${urls.length} 个 URL`);
  } else if (result.status === 422 || result.status === 400) {
    // 422/400 通常是密钥验证失败或格式问题
    console.error('[IndexNow] ❌ 提交失败，请检查密钥文件是否已部署');
    process.exit(1);
  } else if (result.status === 429) {
    console.log('[IndexNow] ⚠️ 触发频率限制，稍后重试');
  } else {
    console.error(`[IndexNow] ❌ 提交失败，状态码: ${result.status}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('[IndexNow] 执行出错:', e);
  process.exit(1);
});
