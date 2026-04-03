import test from 'node:test';
import assert from 'node:assert/strict';

import { getRechargeScreenshotPreview } from './storeHistoryMedia.js';

test('充值记录存在 base64 截图时返回可展示的截图预览信息', () => {
  assert.deepEqual(
    getRechargeScreenshotPreview({
      screenshotUrl: 'data:image/png;base64,abc123',
      amount: 520,
      date: '2026-03-31',
    }),
    {
      visible: true,
      src: 'data:image/png;base64,abc123',
      alt: '充值截图（2026-03-31，¥520）',
    },
  );
});

test('充值记录截图为空时不展示截图预览', () => {
  assert.deepEqual(
    getRechargeScreenshotPreview({
      screenshotUrl: '',
      amount: 520,
      date: '2026-03-31',
    }),
    {
      visible: false,
      src: '',
      alt: '',
    },
  );
});
