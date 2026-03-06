import assert from 'node:assert/strict';
import test from 'node:test';
import {
  filterRecordsByDashboardPlatform,
  getDashboardPlatform,
} from './platformFilter.js';

test('getDashboardPlatform 能识别美团和饿了么平台', () => {
  assert.equal(getDashboardPlatform('美团外卖'), 'meituan');
  assert.equal(getDashboardPlatform('美团餐饮'), 'meituan');
  assert.equal(getDashboardPlatform('饿了么餐饮'), 'eleme');
  assert.equal(getDashboardPlatform('淘宝闪购'), 'other');
  assert.equal(getDashboardPlatform(''), 'other');
});

test('filterRecordsByDashboardPlatform 支持全部平台', () => {
  const records = [
    { id: '1', storeId: 'store-1' },
    { id: '2', storeId: 'store-2' },
    { id: '3', storeId: 'store-3' },
  ];
  const storePlatformMap = new Map([
    ['store-1', '美团外卖'],
    ['store-2', '饿了么餐饮'],
    ['store-3', '淘宝闪购'],
  ]);

  assert.deepEqual(
    filterRecordsByDashboardPlatform(records, 'all', storePlatformMap).map((record) => record.id),
    ['1', '2', '3'],
  );
});

test('filterRecordsByDashboardPlatform 能按美团和饿了么筛选', () => {
  const records = [
    { id: '1', storeId: 'store-1' },
    { id: '2', storeId: 'store-2' },
    { id: '3', storeId: 'store-3' },
    { id: '4', storeId: 'store-4' },
  ];
  const storePlatformMap = new Map([
    ['store-1', '美团外卖'],
    ['store-2', '美团餐饮'],
    ['store-3', '饿了么餐饮'],
    ['store-4', '淘宝闪购'],
  ]);

  assert.deepEqual(
    filterRecordsByDashboardPlatform(records, 'meituan', storePlatformMap).map(
      (record) => record.id,
    ),
    ['1', '2'],
  );

  assert.deepEqual(
    filterRecordsByDashboardPlatform(records, 'eleme', storePlatformMap).map((record) => record.id),
    ['3'],
  );
});
