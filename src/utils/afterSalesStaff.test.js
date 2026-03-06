import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_AFTER_SALES_STAFF,
  buildAfterSalesStaffOptions,
  normalizeAfterSalesStaffName,
} from './afterSalesStaff.js';

test('normalizeAfterSalesStaffName 会把测试归一为测试1', () => {
  assert.equal(normalizeAfterSalesStaffName('测试'), '测试1');
  assert.equal(normalizeAfterSalesStaffName(' 测试 '), '测试1');
  assert.equal(normalizeAfterSalesStaffName('测试2'), '测试2');
  assert.equal(normalizeAfterSalesStaffName(''), '');
});

test('buildAfterSalesStaffOptions 会保留默认售后并补齐测试1和测试2', () => {
  const options = buildAfterSalesStaffOptions(['测试', '王五', '测试2']);

  assert.deepEqual(
    options,
    [...new Set([...DEFAULT_AFTER_SALES_STAFF, '测试1', '测试2', '王五'])].sort((left, right) =>
      left.localeCompare(right, 'zh-CN'),
    ),
  );
});
