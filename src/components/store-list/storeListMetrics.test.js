import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLatestFollowUpStaffMap,
  buildLatestPromotionStatusMap,
  buildRecordCountMap,
  filterStoresByStaff,
} from './storeListMetrics.js';

test('返回每个店铺首条跟进人员', () => {
  const result = buildLatestFollowUpStaffMap([
    { storeId: 's1', staffName: '张三' },
    { storeId: 's1', staffName: '李四' },
    { storeId: 's2', staffName: '王五' },
    { storeId: 's3', staffName: '' },
  ]);

  assert.equal(result.get('s1'), '张三');
  assert.equal(result.get('s2'), '王五');
  assert.equal(result.has('s3'), false);
});

test('buildLatestFollowUpStaffMap 会把测试归一为测试1', () => {
  const result = buildLatestFollowUpStaffMap([
    { storeId: 's1', staffName: '测试' },
    { storeId: 's2', staffName: '测试2' },
  ]);

  assert.equal(result.get('s1'), '测试1');
  assert.equal(result.get('s2'), '测试2');
});

test('统计每个店铺记录次数', () => {
  const result = buildRecordCountMap([
    { storeId: 's1' },
    { storeId: 's2' },
    { storeId: 's1' },
    { storeId: 's3' },
    { storeId: 's1' },
  ]);

  assert.equal(result.get('s1'), 3);
  assert.equal(result.get('s2'), 1);
  assert.equal(result.get('s3'), 1);
  assert.equal(result.get('missing') || 0, 0);
});

test('filterStoresByStaff 能按售后筛选门店', () => {
  const stores = [
    { id: 's1', name: '门店1' },
    { id: 's2', name: '门店2' },
    { id: 's3', name: '门店3' },
  ];
  const latestFollowUpStaffMap = new Map([
    ['s1', '测试1'],
    ['s2', '测试2'],
  ]);

  assert.deepEqual(
    filterStoresByStaff(stores, '全部', latestFollowUpStaffMap).map((store) => store.id),
    ['s1', 's2', 's3'],
  );
  assert.deepEqual(
    filterStoresByStaff(stores, '测试1', latestFollowUpStaffMap).map((store) => store.id),
    ['s1'],
  );
  assert.deepEqual(
    filterStoresByStaff(stores, '测试2', latestFollowUpStaffMap).map((store) => store.id),
    ['s2'],
  );
});

test('buildLatestPromotionStatusMap 使用最新跟进的30天转化率判断是否可做推广', () => {
  const result = buildLatestPromotionStatusMap([
    { storeId: 's1', orderConversionRate30d: 15 },
    { storeId: 's1', orderConversionRate30d: 8 },
    { storeId: 's2', orderConversionRate30d: 9 },
    { storeId: 's3', orderConversionRate30d: 12 },
    { storeId: 's4', orderConversionRate30d: null },
  ]);

  assert.deepEqual(result.get('s1'), {
    orderConversionRate30d: 15,
    promotionDecisionLabel: '可做推广',
  });
  assert.deepEqual(result.get('s2'), {
    orderConversionRate30d: 9,
    promotionDecisionLabel: '不可做推广',
  });
  assert.deepEqual(result.get('s3'), {
    orderConversionRate30d: 12,
    promotionDecisionLabel: '待观察',
  });
  assert.deepEqual(result.get('s4'), {
    orderConversionRate30d: null,
    promotionDecisionLabel: '-',
  });
});
