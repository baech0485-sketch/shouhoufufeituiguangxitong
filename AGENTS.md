# 项目本地 Skills

## Available skills

- `sync-latest-store-sheet`: 同步 `D:\Desktop\运营自动筛选店铺存储文档` 根目录下最新表格到当前项目目录，并按“同步表格 → 确认数据库 → 正式导入”的完整流程，把最新表格中的门店数据增量导入 MongoDB 云数据库 `shouhoufufeituiguang`。触发词包括“同步最新表格”、“导入最新店铺数据”、“上传最新表格到云数据库”、“追加门店数据”、“运行表格同步 skill”。 (file: `skills/sync-latest-store-sheet/SKILL.md`)

## How to use skills

- 当用户提到上面的任务或直接点名该 skill 时，优先使用对应 `SKILL.md`
- 导入云数据库前，必须先确认数据库名称是 `shouhoufufeituiguang`
- 数据库配置只读取项目本地 `.env.mongodb-sync.local` 或 `.env.local`，不要使用终端环境变量
