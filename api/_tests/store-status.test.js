import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveStoreStatus,
  MANUAL_PROMOTING_STATUS,
  resolveStoreStatus,
} from '../_lib/store-status.js';

test('deriveStoreStatus 按充值和跟进记录回算基础状态', () => {
  assert.equal(deriveStoreStatus(true, true), '已充值');
  assert.equal(deriveStoreStatus(true, false), '已充值');
  assert.equal(deriveStoreStatus(false, true), '已跟进');
  assert.equal(deriveStoreStatus(false, false), '待跟进');
});

test('resolveStoreStatus 会保留手动标记的已在推广状态', () => {
  assert.deepEqual(
    resolveStoreStatus({
      currentStatus: MANUAL_PROMOTING_STATUS,
      statusSource: 'manual',
      hasRecharge: true,
      hasFollowUp: true,
    }),
    {
      status: MANUAL_PROMOTING_STATUS,
      statusSource: 'manual',
    },
  );
});

test('resolveStoreStatus 会为普通店铺返回自动推导状态', () => {
  assert.deepEqual(
    resolveStoreStatus({
      currentStatus: '待跟进',
      statusSource: 'derived',
      hasRecharge: false,
      hasFollowUp: true,
    }),
    {
      status: '已跟进',
      statusSource: 'derived',
    },
  );
});
