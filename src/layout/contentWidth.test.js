import test from 'node:test';
import assert from 'node:assert/strict';
import { getContentContainerClassName } from './contentWidth.js';

test('getContentContainerClassName 为数据看板返回统一宽度', () => {
  assert.match(getContentContainerClassName('dashboard'), /max-w-\[1880px\]/);
});

test('getContentContainerClassName 为店铺列表返回统一宽度', () => {
  const className = getContentContainerClassName('list');

  assert.match(className, /max-w-\[1880px\]/);
  assert.doesNotMatch(className, /max-w-\[1600px\]/);
});
