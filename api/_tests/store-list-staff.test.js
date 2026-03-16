import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLatestStoreIdsByStaff } from '../_lib/store-list-staff.js';

test('buildLatestStoreIdsByStaff 只返回最新跟进属于指定售后的门店', () => {
  const result = buildLatestStoreIdsByStaff(
    [
      { storeId: 'store-1', staffName: '测试' },
      { storeId: 'store-1', staffName: '王五' },
      { storeId: 'store-3', staffName: '张三' },
      { storeId: 'store-2', staffName: '测试2' },
      { storeId: 'store-3', staffName: '测试2' },
    ],
    '测试2',
  );

  assert.deepEqual(result, ['store-2']);
});
