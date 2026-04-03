import test from 'node:test';
import assert from 'node:assert/strict';

import { getStoreListResetButtonClassName } from './storeListFiltersLayout.js';

test('重置按钮使用内容宽度而不是拉伸填满网格列', () => {
  const className = getStoreListResetButtonClassName();

  assert.match(className, /w-fit/);
  assert.match(className, /justify-self-start/);
  assert.doesNotMatch(className, /\bw-full\b/);
});
