import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORE_LIST_COLUMN_TITLES,
  getStoreNameTextClassName,
} from './storeListTablePresentation.js';

test('店铺列表表头不再包含操作列', () => {
  assert.deepEqual(STORE_LIST_COLUMN_TITLES, [
    '店铺信息',
    '商家ID',
    '平台',
    '状态',
    '售后',
    '跟进/充值',
    '累计充值',
    '推广判断',
  ]);
});

test('店铺名称使用更小且统一的字号', () => {
  const className = getStoreNameTextClassName();

  assert.match(className, /text-\[15px\]/);
  assert.match(className, /font-medium/);
  assert.doesNotMatch(className, /font-semibold/);
});
