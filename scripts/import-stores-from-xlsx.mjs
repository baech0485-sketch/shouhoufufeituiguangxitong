import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ExcelJS from 'exceljs';
import { MongoClient } from 'mongodb';

const DEFAULT_FILE_PATH = path.resolve(process.cwd(), '店铺全部数据-20260305.xlsx');
const filePath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_FILE_PATH;
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'shouhoufufeituiguang';
const BATCH_SIZE = 300;

function toText(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

function normalizeDate(value, fallback = '') {
  const text = toText(value);
  if (!text) {
    return fallback;
  }
  const normalized = text.replace(/\//g, '-').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : fallback;
}

function mapPlatform(value) {
  const text = toText(value);
  if (!text) {
    return '美团餐饮';
  }
  if (text.includes('饿了么')) {
    return '饿了么餐饮';
  }
  if (text.includes('淘宝')) {
    return '淘宝闪购';
  }
  if (text.includes('美团')) {
    return '美团餐饮';
  }
  return text;
}

function mapStatus(value) {
  const text = toText(value);
  if (!text || text.includes('新店')) {
    return '待跟进';
  }
  if (text.includes('充值') || text.includes('付费') || text.includes('续费')) {
    return '已充值';
  }
  if (text.includes('跟进') || text.includes('沟通') || text.includes('联系')) {
    return '已跟进';
  }
  return '待跟进';
}

function readWorksheetRows(worksheet) {
  const headerCells = worksheet.getRow(1).values;
  const headers = headerCells.slice(1).map((cell) => toText(cell));
  const rows = [];

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const record = {};
    let hasAnyValue = false;

    headers.forEach((header, index) => {
      const cellValue = row.getCell(index + 1).text;
      const normalizedValue = toText(cellValue);
      record[header] = normalizedValue;
      if (normalizedValue) {
        hasAnyValue = true;
      }
    });

    if (hasAnyValue) {
      rows.push(record);
    }
  }

  return rows;
}

function buildStoreDoc(row) {
  const sourceStoreId = toText(row['店铺ID']);
  const openDateCandidate = row['录入日期'] || row['合同签订日期'] || row['创建时间'];
  const openDate = normalizeDate(openDateCandidate, new Date().toISOString().slice(0, 10));
  const rawPlatform = toText(row['外卖平台']);
  const rawStatus = toText(row['店铺状态']);
  const cooperationDaysText = toText(row['解约合作天数']);
  const cooperationDays = cooperationDaysText ? Number.parseInt(cooperationDaysText, 10) : null;
  const now = new Date();

  return {
    sourceStoreId,
    name: toText(row['店铺名']),
    platform: mapPlatform(rawPlatform),
    openDate,
    status: mapStatus(rawStatus),
    merchantId: toText(row['商家ID']),
    wechatGroupName: toText(row['微信群名']),
    city: toText(row['城市']),
    salesName: toText(row['开单销售']),
    contractDate: normalizeDate(row['合同签订日期']),
    operationMode: toText(row['运营模式']),
    operatorName: toText(row['负责运营']),
    rawPlatform,
    rawStatus,
    terminationDate: normalizeDate(row['解约日期']),
    cooperationDays: Number.isFinite(cooperationDays) ? cooperationDays : null,
    sourceCreatedAt: toText(row['创建时间']),
    sourceUpdatedAt: toText(row['更新时间']),
    updatedAt: now,
    importedFromExcelAt: now,
  };
}

function buildFilter(doc) {
  if (doc.sourceStoreId) {
    return { sourceStoreId: doc.sourceStoreId };
  }
  return { name: doc.name, platform: doc.platform, openDate: doc.openDate };
}

async function main() {
  if (!uri) {
    throw new Error('缺少环境变量 MONGODB_URI');
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Excel 文件不存在: ${filePath}`);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];
  const rows = readWorksheetRows(worksheet);

  if (!rows.length) {
    throw new Error('Excel 内容为空，未检测到可导入的店铺数据');
  }

  const client = new MongoClient(uri, { maxPoolSize: 10 });
  await client.connect();
  const db = client.db(dbName);
  const storesCollection = db.collection('stores');

  await storesCollection.createIndex({ sourceStoreId: 1 }, { unique: true, sparse: true });
  await storesCollection.createIndex({ openDate: -1, updatedAt: -1 });
  await storesCollection.createIndex({ name: 1 });

  let processedCount = 0;
  let ignoredCount = 0;
  let upsertedCount = 0;
  let modifiedCount = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batchRows = rows.slice(i, i + BATCH_SIZE);
    const operations = [];

    for (const row of batchRows) {
      const doc = buildStoreDoc(row);
      if (!doc.name) {
        ignoredCount += 1;
        continue;
      }

      operations.push({
        updateOne: {
          filter: buildFilter(doc),
          update: {
            $set: doc,
            $setOnInsert: { createdAt: new Date() },
          },
          upsert: true,
        },
      });
    }

    if (!operations.length) {
      continue;
    }

    const result = await storesCollection.bulkWrite(operations, { ordered: false });
    processedCount += operations.length;
    upsertedCount += result.upsertedCount;
    modifiedCount += result.modifiedCount;
  }

  await client.close();

  console.log('店铺数据导入完成');
  console.log(`数据库: ${dbName}`);
  console.log(`文件: ${filePath}`);
  console.log(`总行数: ${rows.length}`);
  console.log(`已处理: ${processedCount}`);
  console.log(`新增: ${upsertedCount}`);
  console.log(`更新: ${modifiedCount}`);
  console.log(`忽略空店铺名: ${ignoredCount}`);
}

main().catch((error) => {
  console.error('导入失败:', error.message);
  process.exit(1);
});
