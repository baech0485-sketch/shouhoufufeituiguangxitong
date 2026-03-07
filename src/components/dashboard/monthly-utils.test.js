import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStaffPerformance } from './monthly-utils.ts';

test('buildStaffPerformance 会统计可做推广店铺数', () => {
  const result = buildStaffPerformance(
    [
      {
        storeId: 's1',
        amount: 100,
        staffName: '测试2',
      },
    ],
    [
      {
        storeId: 's1',
        staffName: '测试2',
        orderConversionRate30d: 15,
      },
      {
        storeId: 's2',
        staffName: '测试2',
        orderConversionRate30d: 9,
      },
      {
        storeId: 's3',
        staffName: '测试2',
        orderConversionRate30d: 16,
      },
      {
        storeId: 's3',
        staffName: '测试2',
        orderConversionRate30d: 18,
      },
    ],
  );

  assert.deepEqual(result[0], {
    name: '测试2',
    amount: 100,
    followedStores: 3,
    rechargedStores: 1,
    promotableStores: 2,
    conversionRate: 33.3,
  });
});
