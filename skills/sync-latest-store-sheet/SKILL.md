---
name: sync-latest-store-sheet
description: Use when the user wants to sync the latest spreadsheet from `D:\Desktop\运营自动筛选店铺存储文档` into the current project directory, append only new store rows into MongoDB database `shouhoufufeituiguang`, and then recalculate store statuses from follow-up and recharge records. Triggers include “同步最新表格”, “导入最新店铺数据”, “修正店铺状态”, and “运行表格同步 skill”.
---

# 同步最新表格并导入云数据库

这个 skill 用于执行完整流程：

1. 同步最新表格到当前项目目录
2. 确认数据库名称必须是 `shouhoufufeituiguang`
3. 只新增新店铺，不覆盖旧数据
4. 导入后自动回算并修正店铺状态

## 默认规则

- 源目录：`D:\Desktop\运营自动筛选店铺存储文档`
- 一键完整流程：`python skills/sync-latest-store-sheet/scripts/run_full_flow.py`
- 数据库配置只读取项目本地 `.env.mongodb-sync.local` 或 `.env.local`
- 导入策略默认是“只新增，不覆盖旧数据”

## 常用命令

- `python skills/sync-latest-store-sheet/scripts/run_full_flow.py`
- `python skills/sync-latest-store-sheet/scripts/run_full_flow.py --check-only`
- `node scripts/import-stores-from-xlsx.mjs --check-only`
- `node scripts/repair-store-statuses.mjs --check-only`

## 返回结果

向用户简要汇报：

- 最新表格是否已同步
- 数据库目标是否确认正确
- 新增了多少门店
- 跳过了多少已有门店
- 修正了多少店铺状态
