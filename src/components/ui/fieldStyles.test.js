import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getFieldContainerClassName,
  getFieldControlClassName,
} from './fieldStyles.js';

test('getFieldContainerClassName 为输入和下拉返回统一外层样式', () => {
  const inputContainer = getFieldContainerClassName({ hasLeadingIcon: true });
  const selectContainer = getFieldContainerClassName({ hasLeadingIcon: false });

  assert.match(inputContainer, /rounded-2xl/);
  assert.match(inputContainer, /border-slate-200/);
  assert.match(inputContainer, /focus-within:ring-2/);
  assert.match(selectContainer, /rounded-2xl/);
  assert.match(selectContainer, /shadow-sm/);
});

test('getFieldControlClassName 为输入和下拉返回统一控件样式', () => {
  const inputClassName = getFieldControlClassName({ hasLeadingIcon: true });
  const selectClassName = getFieldControlClassName({
    hasLeadingIcon: false,
    isSelect: true,
  });

  assert.match(inputClassName, /bg-transparent/);
  assert.match(inputClassName, /text-slate-900/);
  assert.match(inputClassName, /placeholder:text-slate-400/);
  assert.match(selectClassName, /appearance-none/);
  assert.match(selectClassName, /cursor-pointer/);
});
