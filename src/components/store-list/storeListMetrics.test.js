import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLatestFollowUpStaffMap, buildRecordCountMap } from './storeListMetrics.js';

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
