// 腾讯 CloudBase 云函数：定时测速各平台大模型 API
// 在 CloudBase 控制台创建云函数，设置定时触发器（每小时），将结果写入对象存储/数据库
// 前端 /latency 页面读取最新结果展示

const cloud = require("tcb-admin-node");
cloud.init({ env: process.env.TCB_ENV_ID });

// 测速端点配置——API Key 从环境变量读取
const ENDPOINTS = [
  {
    platform: "火山方舟",
    model: "doubao-seed-1.6",
    endpoint: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    apiKey: process.env.VOLC_API_KEY,
  },
  {
    platform: "智谱 AI",
    model: "glm-4.6",
    endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    apiKey: process.env.ZHIPU_API_KEY,
  },
  {
    platform: "阿里云百炼",
    model: "qwen-plus",
    endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    apiKey: process.env.DASHSCOPE_API_KEY,
  },
  {
    platform: "OpenRouter",
    model: "deepseek/deepseek-chat-v3",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: process.env.OPENROUTER_API_KEY,
  },
];

async function pingEndpoint(item) {
  const start = Date.now();
  try {
    const res = await fetch(item.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${item.apiKey}`,
      },
      body: JSON.stringify({
        model: item.model,
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(10000),
    });
    const ttfb = Date.now() - start;
    return {
      platform: item.platform,
      model: item.model,
      ttfb,
      status: res.ok ? "ok" : "error",
      checkedAt: new Date().toISOString(),
    };
  } catch (e) {
    return {
      platform: item.platform,
      model: item.model,
      ttfb: -1,
      status: "error",
      message: e.message,
      checkedAt: new Date().toISOString(),
    };
  }
}

exports.main = async () => {
  const results = [];
  for (const item of ENDPOINTS) {
    if (!item.apiKey) continue; // 没有配置 Key 的跳过
    results.push(await pingEndpoint(item));
  }

  // 将结果写入对象存储（供前端读取）
  const db = cloud.database();
  await db.collection("latency").add({
    data: {
      results,
      checkedAt: new Date().toISOString(),
    },
  });

  return { results };
};
