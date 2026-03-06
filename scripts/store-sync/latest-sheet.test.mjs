import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { findLatestSpreadsheet } from './latest-sheet.mjs';

function writeFile(filePath, content, mtimeMs) {
  fs.writeFileSync(filePath, content, 'utf8');
  const time = new Date(mtimeMs);
  fs.utimesSync(filePath, time, time);
}

test('findLatestSpreadsheet 优先选择店铺全部数据文件', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'latest-sheet-'));
  writeFile(path.join(tempDir, '其他报表.xlsx'), 'a', 1000);
  writeFile(path.join(tempDir, '店铺全部数据-20260305.xlsx'), 'b', 2000);
  writeFile(path.join(tempDir, '店铺全部数据-20260306.xlsx'), 'c', 3000);

  const latestFile = findLatestSpreadsheet(tempDir);
  assert.equal(path.basename(latestFile), '店铺全部数据-20260306.xlsx');
});

test('findLatestSpreadsheet 在没有店铺全部数据时回退到最新表格', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'latest-sheet-'));
  writeFile(path.join(tempDir, 'a.xlsx'), 'a', 1000);
  writeFile(path.join(tempDir, 'b.csv'), 'b', 3000);

  const latestFile = findLatestSpreadsheet(tempDir);
  assert.equal(path.basename(latestFile), 'b.csv');
});