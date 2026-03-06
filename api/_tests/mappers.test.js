import test from 'node:test';
import assert from 'node:assert/strict';
import { mapStorePlatform } from '../_lib/mappers.js';

test('mapStorePlatform 只返回看板筛选需要的最小字段', () => {
  const result = mapStorePlatform({
    _id: { toString: () => 'store-1' },
    platform: '美团餐饮',
    name: '测试门店',
    merchantId: '123456',
  });

  assert.deepEqual(result, {
    id: 'store-1',
    platform: '美团餐饮',
  });
});
