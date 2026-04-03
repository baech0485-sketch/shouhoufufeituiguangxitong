import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStoreDetailModalContainerClassName,
  getStoreDetailModalPaneClassNames,
} from './modalLayout.js';

test('店铺详情弹窗使用更宽的容器宽度', () => {
  const className = getStoreDetailModalContainerClassName();

  assert.match(className, /max-w-\[1080px\]/);
  assert.doesNotMatch(className, /max-w-\[1400px\]/);
});

test('店铺详情弹窗左右栏使用更舒展的比例', () => {
  const classNames = getStoreDetailModalPaneClassNames();

  assert.match(classNames.historyPane, /w-\[38%\]/);
  assert.match(classNames.formPane, /w-\[62%\]/);
  assert.doesNotMatch(classNames.historyPane, /w-1\/2/);
  assert.doesNotMatch(classNames.formPane, /w-1\/2/);
});
