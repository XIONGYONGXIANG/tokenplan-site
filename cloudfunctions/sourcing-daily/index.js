// 腾讯 CloudBase 云函数：每日抓取各厂商官方定价页，diff 变化并生成动态文章
// 设置定时触发器：每天 UTC 02:00（北京时间 10:00）执行

const cloud = require("tcb-admin-node");
const crypto = require("crypto");
cloud.init({ env: process.env.TCB_ENV_ID });

const SOURCES = [
  { id: "volcengine", name: "火山方舟", url: "https://www.volcengine.com/product/ark" },
  { id: "zhipu", name: "智谱AI", url: "https://www.zhipuai.cn/" },
  { id: "aliyun", name: "阿里云百炼", url: "https://bailian.console.aliyun.com/" },
  { id: "tencent", name: "腾讯云", url: "https://cloud.tencent.com/act/pro/tokenplan" },
  { id: "minimax", name: "MiniMax", url: "https://www.minimaxi.com/" },
  { id: "kimi", name: "Kimi", url: "https://www.moonshot.cn/" },
];

function fingerprint(text) {
  return crypto
    .createHash("md5")
    .update(text.replace(/\s+/g, " ").slice(0, 5000))
    .digest("hex");
}

exports.main = async () => {
  const db = cloud.database();
  const _ = db.command;

  // 获取上次指纹
  const lastSnapshot = await db
    .collection("source-snapshots")
    .limit(100)
    .get();

  const oldFp = {};
  lastSnapshot.data.forEach((s) => {
    oldFp[s.sourceId] = s.fingerprint;
  });

  const changes = [];

  for (const source of SOURCES) {
    try {
      const res = await fetch(source.url, {
        signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "TokenPlanBot/1.0" },
      });
      if (!res.ok) continue;

      const text = await res.text();
      const fp = fingerprint(text);

      if (oldFp[source.id] && oldFp[source.id] !== fp) {
        changes.push({
          sourceId: source.id,
          name: source.name,
          url: source.url,
          detectedAt: new Date().toISOString(),
        });
      }

      // 保存新指纹
      await db
        .collection("source-snapshots")
        .where({ sourceId: source.id })
        .set({ sourceId: source.id, fingerprint: fp, updatedAt: new Date() });
    } catch (e) {
      console.error(`Failed to fetch ${source.name}:`, e.message);
    }
  }

  // 对变化项，可调用 LLM 生成动态文章摘要（此处留接口）
  return { checked: SOURCES.length, changes: changes.length, changes };
};
