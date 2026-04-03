import test from 'node:test';
import assert from 'node:assert/strict';

import {
  closeStoreHistoryPreview,
  openStoreHistoryPreview,
} from './storeHistoryPreviewState.js';

test('openStoreHistoryPreview 会基于截图预览信息生成打开状态', () => {
  assert.deepEqual(
    openStoreHistoryPreview({
      visible: true,
      src: 'data:image/png;base64,abc123',
      alt: '充值截图（2026-03-31，¥520）',
    }),
    {
      isOpen: true,
      src: 'data:image/png;base64,abc123',
      alt: '充值截图（2026-03-31，¥520）',
    },
  );
});

test('openStoreHistoryPreview 遇到不可见截图时保持关闭', () => {
  assert.deepEqual(
    openStoreHistoryPreview({
      visible: false,
      src: '',
      alt: '',
    }),
    {
      isOpen: false,
      src: '',
      alt: '',
    },
  );
});

test('closeStoreHistoryPreview 会清空当前预览状态', () => {
  assert.deepEqual(closeStoreHistoryPreview(), {
    isOpen: false,
    src: '',
    alt: '',
  });
});
