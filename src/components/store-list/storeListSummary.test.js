import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildStoreListSummaryItems,
  countStoresByStatus,
} from './storeListSummary.js';

test('countStoresByStatus 会从完整门店集合中统计各状态数量', () => {
  assert.deepEqual(
    countStoresByStatus([
      { status: '待跟进' },
      { status: '待跟进' },
      { status: '已跟进' },
      { status: '已充值' },
      { status: '已在推广' },
      { status: '已在推广' },
    ]),
    {
      待跟进: 2,
      已跟进: 1,
      已充值: 1,
      已在推广: 2,
    },
  );
});

test('店铺列表摘要按完整状态计数生成标签数据', () => {
  const items = buildStoreListSummaryItems({
    total: 12,
    statusCounts: {
      待跟进: 5,
      已跟进: 3,
      已充值: 2,
      已在推广: 2,
    },
  });

  assert.deepEqual(
    items.map((item) => [item.label, item.value, item.tone]),
    [
      ['全部', 12, 'default'],
      ['待跟进', 5, 'brandSoft'],
      ['已跟进', 3, 'default'],
      ['已充值', 2, 'successSoft'],
      ['已在推广', 2, 'warningSoft'],
    ],
  );
});
