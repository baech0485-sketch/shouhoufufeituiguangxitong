import test from 'node:test';
import assert from 'node:assert/strict';

import { APP_NAV_ITEMS, getViewMeta } from './navigation.js';

test('侧边导航按设计稿顺序提供四个入口', () => {
  assert.deepEqual(
    APP_NAV_ITEMS.map((item) => item.id),
    ['dashboard', 'list', 'detail', 'sync'],
  );
  assert.deepEqual(
    APP_NAV_ITEMS.map((item) => item.label),
    ['数据看板', '店铺列表', '详情弹窗', '导入同步'],
  );
});

test('列表页标题文案与设计稿一致', () => {
  const meta = getViewMeta('list');

  assert.equal(meta.eyebrow, 'STORE MANAGEMENT / FILTER & ACT');
  assert.equal(meta.title, '店铺列表');
  assert.match(meta.description, /搜索、平台、状态和售后维度/);
});
