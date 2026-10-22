// 百度 + 头条搜索 批量 URL 推送脚本
// 从 sitemap.xml 读取所有 URL，分别推送到百度站长平台和头条搜索资源平台
//
// 百度 API 文档: https://ziyuan.baidu.com/linksubmit/index
//   POST http://data.zz.baidu.com/urls?site={site}&token={token}
//   Content-Type: text/plain
//   Body: 每行一个 URL
//
// 头条 API: 头条搜索资源平台链接推送
//   POST https://api.toutiao.com/search/api/push_url?token={token}
//   Content-Type: application/json
//   Body: { "url_list": ["...", "..."] }

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE_URL = 'https://tokenplan.link';
const SITEMAP_PATH = join(process.cwd(), 'out', 'sitemap.xml');

// 从环境变量读取 token（在 GitHub Secrets 中配置）
const BAIDU_TOKEN = process.env.BAIDU_PUSH_TOKEN || '';
const TOUTIAO_TOKEN = process.env.TOUTIAO_PUSH_TOKEN || '';

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

// 推送到百度站长平台
async function pushToBaidu(urls) {
  if (!BAIDU_TOKEN) {
    console.log('[百度] ⚠️  未配置 BAIDU_PUSH_TOKEN，跳过百度推送');
    return;
  }

  const endpoint = `http://data.zz.baidu.com/urls?site=${SITE_URL}&token=${BAIDU_TOKEN}`;
  const body = urls.join('\n');

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body,
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    console.log(`[百度] 响应: status=${res.status}`);
    console.log(`[百度] 内容:`, data);

    if (data.success !== undefined) {
      console.log(`[百度] ✅ 成功推送 ${data.success} 个 URL，剩余配额 ${data.remain}`);
    } else if (data.error) {
      console.error(`[百度] ❌ 推送失败: ${data.error}（${data.message || ''}）`);
    } else {
      console.log(`[百度] ⚠️  响应格式异常，请检查 token`);
    }
  } catch (e) {
    console.error(`[百度] ❌ 请求异常: ${e.message}`);
  }
}

// 推送到头条搜索资源平台
async function pushToToutiao(urls) {
  if (!TOUTIAO_TOKEN) {
    console.log('[头条] ⚠️  未配置 TOUTIAO_PUSH_TOKEN，跳过头条推送');
    return;
  }

  const endpoint = `https://api.toutiao.com/search/api/push_url?token=${TOUTIAO_TOKEN}`;
  const body = JSON.stringify({ url_list: urls });

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    console.log(`[头条] 响应: status=${res.status}`);
    console.log(`[头条] 内容:`, data);

    // 头条 API 返回格式可能变化，这里做宽松判断
    if (res.status >= 200 && res.status < 300 && !data.error && !data.errmsg) {
      console.log(`[头条] ✅ 推送请求已提交（${urls.length} 个 URL）`);
    } else {
      console.log(`[头条] ⚠️  响应异常，请检查 token 或 API 格式`);
    }
  } catch (e) {
    console.error(`[头条] ❌ 请求异常: ${e.message}`);
  }
}

async function main() {
  console.log('[推送] 开始向中文搜索引擎推送 URL...');

  // 读取 sitemap
  let sitemapXml;
  try {
    sitemapXml = readFileSync(SITEMAP_PATH, 'utf-8');
  } catch (e) {
    console.error(`[推送] ❌ 无法读取 sitemap.xml: ${e.message}`);
    process.exit(1);
  }

  const urls = parseSitemap(sitemapXml);
  console.log(`[推送] 共解析到 ${urls.length} 个 URL`);

  if (urls.length === 0) {
    console.log('[推送] 没有 URL 需要推送');
    return;
  }

  console.log('[推送] URL 示例:', urls.slice(0, 3));

  // 并发推送（互不影响）
  await Promise.all([pushToBaidu(urls), pushToToutiao(urls)]);

  console.log('[推送] 完成');
}

main().catch((e) => {
  console.error('[推送] 执行出错:', e);
  process.exit(1);
});
