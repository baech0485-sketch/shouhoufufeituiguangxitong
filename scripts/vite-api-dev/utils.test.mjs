import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { parseApiRequestUrl, resolveApiModulePath } from './utils.mjs';

test('parseApiRequestUrl 解析路径和查询参数', () => {
  assert.deepEqual(
    parseApiRequestUrl('/api/followups?storeId=abc&page=2'),
    {
      pathname: '/api/followups',
      query: {
        storeId: 'abc',
        page: '2',
      },
    },
  );
});

test('parseApiRequestUrl 兼容重复查询参数', () => {
  assert.deepEqual(
    parseApiRequestUrl('/api/stores?status=%E5%BE%85%E8%B7%9F%E8%BF%9B&status=%E5%B7%B2%E8%B7%9F%E8%BF%9B'),
    {
      pathname: '/api/stores',
      query: {
        status: ['待跟进', '已跟进'],
      },
    },
  );
});

test('resolveApiModulePath 仅返回真实存在的 api 模块文件', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-api-dev-'));
  const apiDir = path.join(tempRoot, 'api');
  fs.mkdirSync(apiDir, { recursive: true });
  const filePath = path.join(apiDir, 'stores.js');
  fs.writeFileSync(filePath, 'export default function handler() {}');

  assert.equal(
    resolveApiModulePath(tempRoot, '/api/stores'),
    filePath,
  );
  assert.equal(resolveApiModulePath(tempRoot, '/api/missing'), null);
  assert.equal(resolveApiModulePath(tempRoot, '/src/main'), null);
});
