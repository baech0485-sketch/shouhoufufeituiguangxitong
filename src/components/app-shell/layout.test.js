import test from 'node:test';
import assert from 'node:assert/strict';

import { getAppShellClassNames } from './layout.js';

test('应用壳层在桌面端铺满视口且不再限制最大宽度', () => {
  const classNames = getAppShellClassNames();

  assert.match(classNames.root, /h-screen/);
  assert.match(classNames.root, /overflow-hidden/);
  assert.match(classNames.shell, /h-full/);
  assert.match(classNames.shell, /w-full/);
  assert.doesNotMatch(classNames.shell, /max-w/);
  assert.doesNotMatch(classNames.shell, /mx-auto/);
  assert.doesNotMatch(classNames.shell, /px-4/);
  assert.doesNotMatch(classNames.shell, /py-4/);
});
