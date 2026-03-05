# 售后付费推广系统（Vercel + MongoDB）

用于美团外卖与淘宝闪购店铺的录入、售后跟进、充值记录与数据看板。

## 技术栈

- 前端：React 19 + TypeScript + Vite + Tailwind CSS
- 图表：Recharts
- 后端：Vercel Serverless Functions（`/api/*`）
- 数据库：MongoDB

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 配置环境变量（可复制 `.env.example` 为 `.env.local`）

```env
MONGODB_URI="mongodb://root:your-password@dbconn.sealosbja.site:31728/?directConnection=true"
MONGODB_DB="shouhoufufeituiguang"
```

3. 启动开发环境

```bash
npm run dev
```

如果你需要本地联调 `api/*` 接口，建议使用：

```bash
vercel dev
```

## Excel 批量导入

导入默认文件 `店铺全部数据-20260305.xlsx`：

```bash
npm run import:stores
```

导入指定文件：

```bash
node scripts/import-stores-from-xlsx.mjs "你的Excel路径.xlsx"
```

## 部署到 Vercel

在 Vercel 项目设置中新增环境变量：

- `MONGODB_URI`
- `MONGODB_DB`（建议固定为 `shouhoufufeituiguang`）

部署后，前端将通过同域 `/api/*` 接口访问 MongoDB 数据。

## API 概览

- `GET /api/stores`：获取店铺分页列表（支持 `page`、`pageSize`、`search`、`platform`、`status`）
- `POST /api/stores`：新增店铺
- `GET /api/followups?storeId=xxx`：获取跟进记录（可按店铺过滤）
- `POST /api/followups`：新增跟进记录，并自动更新店铺状态
- `GET /api/recharges?storeId=xxx`：获取充值记录（可按店铺过滤）
- `POST /api/recharges`：新增充值记录，并自动更新店铺状态
