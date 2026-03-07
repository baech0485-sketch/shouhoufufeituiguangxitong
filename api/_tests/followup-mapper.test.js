import test from 'node:test';
import assert from 'node:assert/strict';
import { mapFollowUp } from '../_lib/mappers.js';

test('mapFollowUp 会返回跟进截图字段', () => {
  const result = mapFollowUp({
    _id: { toString: () => 'followup-1' },
    storeId: 'store-1',
    date: '2026-03-07',
    communicationType: '私聊',
    intention: '高',
    notes: '备注',
    staffName: '测试2',
    orderConversionRate30d: 15.2,
    screenshotUrl: 'data:image/png;base64,abc',
  });

  assert.equal(result.screenshotUrl, 'data:image/png;base64,abc');
});
