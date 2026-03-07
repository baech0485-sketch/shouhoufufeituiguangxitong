import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORE_LIST_COLUMN_TITLES,
  getStoreNameTextClassName,
} from './storeListTablePresentation.js';

test('店铺列表表头不再包含操作列', () => {
  assert.deepEqual(STORE_LIST_COLUMN_TITLES, [
    '商家ID',
    '店铺名称',
    '平台',
    '开店日期',
    '状态',
    '售后',
    '跟进次数',
    '充值次数',
    '充值金额',
    '推广判断',
  ]);
});

test('店铺名称使用更小且统一的字号', () => {
  const className = getStoreNameTextClassName();

  assert.match(className, /text-sm/);
  assert.match(className, /font-medium/);
  assert.doesNotMatch(className, /font-semibold/);
});
