import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRechargePayload } from './rechargeSubmission.js';

test('buildRechargePayload 会保留真实上传的充值截图', () => {
  const payload = buildRechargePayload({
    storeId: 'store-1',
    amount: '50',
    date: '2026-03-07',
    screenshotUrl: 'data:image/png;base64,abc',
    staffName: '测试2',
  });

  assert.deepEqual(payload, {
    storeId: 'store-1',
    amount: 50,
    date: '2026-03-07',
    screenshotUrl: 'data:image/png;base64,abc',
    staffName: '测试2',
  });
});
