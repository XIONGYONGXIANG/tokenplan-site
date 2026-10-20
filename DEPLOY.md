# TokenPlan.link 部署指南

## 1. 准备工作

- 腾讯云账号（已实名认证）
- GitHub 账号
- 已注册域名 `tokenplan.link`（推荐 Cloudflare Registrar 成本价注册）

## 2. 创建 CloudBase 香港环境

1. 登录 [腾讯云开发 CloudBase 控制台](https://console.cloud.tencent.com/tcb)
2. 点击「新建环境」
3. **地域选择：香港 (ap-hongkong)**（免备案）
4. 套餐选择：个人版（免费额度够用）
5. 记下环境 ID（形如 `xxx-xxxxx`）

## 3. 开通静态网站托管

在刚创建的环境中，进入「静态网站托管」，点击开通。

## 4. 本地构建测试

```bash
cd tokenplan-site
npm install
npm run build
# 构建产物在 out/ 目录
```

## 5. 手动部署（首次）

```bash
npm install -g @cloudbase/cli
tcb login
tcb hosting deploy out -e <你的环境ID>
```

部署后会得到一个 `xxx-xxxxx.tcloudbaseapp.com` 的默认域名。

## 6. 绑定自定义域名

1. CloudBase 控制台 → 静态网站托管 → 域名管理 → 添加自定义域名
2. 输入 `tokenplan.link`
3. 到 Cloudflare DNS 添加 CNAME 记录，指向 CloudBase 提供的目标域名
4. 等待 SSL 证书自动签发（约 10 分钟）
5. 香港环境无需 ICP 备案

## 7. 配置 GitHub Actions 自动部署

在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：

| Secret | 值 |
|--------|-----|
| `TCB_ENV_ID` | CloudBase 环境 ID |
| `TENCENTCLOUD_SECRET_ID` | 腾讯云 API SecretId |
| `TENCENTCLOUD_SECRET_KEY` | 腾讯云 API SecretKey |

推送代码到 `main` 分支后会自动构建并部署。

## 8. 配置测速云函数（可选）

1. CloudBase 控制台 → 云函数 → 新建云函数 `latency-check`
2. 将 `cloudfunctions/latency-check/index.js` 内容粘贴进去
3. 配置环境变量（各平台 API Key）：
   - `VOLC_API_KEY`
   - `ZHIPU_API_KEY`
   - `DASHSCOPE_API_KEY`
   - `OPENROUTER_API_KEY`
4. 创建定时触发器，Cron 表达式：`0 0 * * * *`（每小时）
5. 创建数据库集合 `latency` 存储测速结果

## 9. 提交搜索引擎

- 百度搜索资源平台：https://ziyuan.baidu.com/
- 谷歌 Search Console：https://search.google.com/search-console
- 提交 `sitemap.xml`：https://tokenplan.link/sitemap.xml

## 10. 更新数据

编辑 `data/` 目录下的 YAML 文件，提交到 `main` 分支即自动更新。
