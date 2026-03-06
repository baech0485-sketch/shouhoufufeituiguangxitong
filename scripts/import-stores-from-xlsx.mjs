import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { readProjectMongoConfig } from './store-sync/config.mjs';
import { findLatestSpreadsheet } from './store-sync/latest-sheet.mjs';
import { readStoreDocsFromWorkbook } from './store-sync/store-docs.mjs';
import { upsertStoresToMongo } from './store-sync/upsert-stores.mjs';

function parseArgs(argv) {
  const options = { filePath: '', configFile: '', checkOnly: false };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--check-only') {
      options.checkOnly = true;
      continue;
    }
    if (argument === '--config-file') {
      options.configFile = argv[index + 1] || '';
      index += 1;
      continue;
    }
    if (!options.filePath) {
      options.filePath = argument;
    }
  }

  return options;
}

function resolveWorkbookPath(filePath) {
  return filePath ? path.resolve(filePath) : findLatestSpreadsheet(process.cwd());
}

async function main() {
  const { filePath, configFile, checkOnly } = parseArgs(process.argv.slice(2));
  const workbookPath = resolveWorkbookPath(filePath);
  const mongoConfig = readProjectMongoConfig(process.cwd(), configFile);

  if (!fs.existsSync(workbookPath)) {
    throw new Error(`未找到待导入的表格文件：${workbookPath}`);
  }

  console.log(`配置文件：${mongoConfig.envFilePath}`);
  console.log(`数据库主机：${mongoConfig.mongoHosts}`);
  console.log(`数据库名称：${mongoConfig.dbName}`);
  console.log(`待导入表格：${workbookPath}`);

  if (checkOnly) {
    console.log('检查完成：数据库名称已确认正确，未执行导入');
    return;
  }

  const storeDocs = await readStoreDocsFromWorkbook(workbookPath);
  if (!storeDocs.length) {
    throw new Error('Excel 内容为空，未检测到可导入的店铺数据');
  }

  const result = await upsertStoresToMongo({
    mongoUri: mongoConfig.mongoUri,
    dbName: mongoConfig.dbName,
    storeDocs,
    filePath: workbookPath,
  });

  console.log('店铺数据导入完成（仅新增，不覆盖已有数据）');
  console.log(`总行数：${result.totalRows}`);
  console.log(`已处理：${result.processedCount}`);
  console.log(`新增：${result.insertedCount}`);
  console.log(`跳过已有：${result.skippedExistingCount}`);
  console.log(`忽略空店铺名：${result.ignoredCount}`);
}

main().catch((error) => {
  console.error(`导入失败：${error.message}`);
  process.exit(1);
});
