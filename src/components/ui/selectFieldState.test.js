import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveSelectedOption } from './selectFieldState.js';

test('resolveSelectedOption 返回当前 value 对应的选项', () => {
  const option = resolveSelectedOption(
    [
      { label: '全部状态', value: '全部' },
      { label: '待跟进', value: '待跟进' },
    ],
    '待跟进',
  );

  assert.deepEqual(option, {
    label: '待跟进',
    value: '待跟进',
  });
});

test('resolveSelectedOption 在未命中时回退到第一个选项', () => {
  const option = resolveSelectedOption(
    [
      { label: '全部状态', value: '全部' },
      { label: '待跟进', value: '待跟进' },
    ],
    '不存在',
  );

  assert.deepEqual(option, {
    label: '全部状态',
    value: '全部',
  });
});
