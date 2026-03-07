import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FOLLOW_UP_SCREENSHOT_MAX_SIZE_BYTES,
  validateImageFile,
} from './imageUpload.js';

test('validateImageFile 接受常见截图格式', () => {
  assert.equal(
    validateImageFile({ type: 'image/png', size: 1024 }),
    '',
  );
  assert.equal(
    validateImageFile({ type: 'image/jpeg', size: 2048 }),
    '',
  );
  assert.equal(
    validateImageFile({ type: 'image/webp', size: 4096 }),
    '',
  );
});

test('validateImageFile 拒绝非图片或超大文件', () => {
  assert.equal(
    validateImageFile({ type: 'application/pdf', size: 1024 }),
    '请上传 JPG、PNG 或 WEBP 图片',
  );
  assert.equal(
    validateImageFile({ type: 'image/png', size: FOLLOW_UP_SCREENSHOT_MAX_SIZE_BYTES + 1 }),
    '截图大小不能超过 2MB',
  );
});
