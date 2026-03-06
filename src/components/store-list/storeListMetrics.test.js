import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLatestFollowUpStaffMap, buildRecordCountMap } from './storeListMetrics.js';

test('buildLatestFollowUpStaffMap ????????????', () => {
  const result = buildLatestFollowUpStaffMap([
    { storeId: 's1', staffName: '??' },
    { storeId: 's1', staffName: '??' },
    { storeId: 's2', staffName: '??' },
    { storeId: 's3', staffName: '' },
  ]);

  assert.equal(result.get('s1'), '??');
  assert.equal(result.get('s2'), '??');
  assert.equal(result.has('s3'), false);
});

test('buildRecordCountMap ??????????', () => {
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
