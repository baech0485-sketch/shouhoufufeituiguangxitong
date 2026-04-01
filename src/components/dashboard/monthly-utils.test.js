import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStaffPerformance, getAvailableMonths } from './monthly-utils.ts';

test('getAvailableMonths 会补齐从最早业务月份到当前月份的连续月份', () => {
  const result = getAvailableMonths(
    [
      {
        date: '2026-03-15',
      },
    ],
    new Date('2026-04-01T12:00:00Z'),
  );

  assert.deepEqual(result, ['2026-04', '2026-03']);
});

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
