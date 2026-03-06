import fs from 'node:fs';
import path from 'node:path';

const ALLOWED_EXTENSIONS = new Set(['.xlsx', '.xls', '.xlsm', '.csv', '.tsv']);
const PREFERRED_FILE_PATTERN = /^店铺全部数据-\d{8}\.(xlsx|xls|xlsm|csv|tsv)$/i;

function listRootSpreadsheetFiles(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.resolve(directory, entry.name))
    .filter((filePath) => ALLOWED_EXTENSIONS.has(path.extname(filePath).toLowerCase()));
}

function sortByLastModified(files) {
  return [...files].sort((left, right) => {
    const leftStat = fs.statSync(left);
    const rightStat = fs.statSync(right);
    return rightStat.mtimeMs - leftStat.mtimeMs || path.basename(right).localeCompare(path.basename(left));
  });
}

export function findLatestSpreadsheet(directory = process.cwd()) {
  const absoluteDirectory = path.resolve(directory);
  const files = listRootSpreadsheetFiles(absoluteDirectory);
  if (!files.length) {
    throw new Error(`当前目录根目录未找到表格文件：${absoluteDirectory}`);
  }

  const preferredFiles = files.filter((filePath) => PREFERRED_FILE_PATTERN.test(path.basename(filePath)));
  const candidates = preferredFiles.length ? preferredFiles : files;
  return sortByLastModified(candidates)[0];
}