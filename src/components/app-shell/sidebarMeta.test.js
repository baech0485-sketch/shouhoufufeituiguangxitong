import test from 'node:test';
import assert from 'node:assert/strict';

import { getSidebarMeta } from './sidebarMeta.js';

test('侧边栏不再展示 Vercel + MongoDB 标签', () => {
  const meta = getSidebarMeta();

  assert.equal(meta.showTechBadge, false);
  assert.equal(meta.title, '呈尚策划售后系统');
});
