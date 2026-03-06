import ExcelJS from 'exceljs';

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
  const headers = worksheet.getRow(1).values.slice(1).map((cell) => toText(cell));
  const rows = [];

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const record = {};
    let hasAnyValue = false;

    headers.forEach((header, index) => {
      const value = toText(row.getCell(index + 1).text);
      record[header] = value;
      if (value) {
        hasAnyValue = true;
      }
    });

    if (hasAnyValue) {
      rows.push(record);
    }
  }

  return rows;
}

export function buildStoreDoc(row, now = new Date()) {
  const sourceStoreId = toText(row['店铺ID']);
  const openDateCandidate = row['录入日期'] || row['合同签订日期'] || row['创建时间'];
  const openDate = normalizeDate(openDateCandidate, new Date().toISOString().slice(0, 10));
  const rawPlatform = toText(row['外卖平台']);
  const rawStatus = toText(row['店铺状态']);
  const cooperationDaysText = toText(row['解约合作天数']);
  const cooperationDays = cooperationDaysText ? Number.parseInt(cooperationDaysText, 10) : null;

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

export function buildStoreFilter(doc) {
  if (doc.sourceStoreId) {
    return { sourceStoreId: doc.sourceStoreId };
  }
  return { name: doc.name, platform: doc.platform, openDate: doc.openDate };
}

export async function readStoreDocsFromWorkbook(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('Excel 中未找到工作表');
  }

  return readWorksheetRows(worksheet).map((row) => buildStoreDoc(row));
}