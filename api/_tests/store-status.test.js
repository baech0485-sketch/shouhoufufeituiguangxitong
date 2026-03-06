import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveStoreStatus } from '../_lib/store-status.js';

test('deriveStoreStatus 按充值和跟进记录回算店铺状态', () => {
  assert.equal(deriveStoreStatus(true, true), '已充值');
  assert.equal(deriveStoreStatus(true, false), '已充值');
  assert.equal(deriveStoreStatus(false, true), '已跟进');
  assert.equal(deriveStoreStatus(false, false), '待跟进');
});