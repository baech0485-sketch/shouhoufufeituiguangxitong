import test from 'node:test';
import assert from 'node:assert/strict';
import { getContentContainerClassName } from './contentWidth.js';

test('getContentContainerClassName 为数据看板保留默认宽度', () => {
  assert.match(getContentContainerClassName('dashboard'), /max-w-\[1600px\]/);
});

test('getContentContainerClassName 为店铺列表返回更宽的容器', () => {
  const className = getContentContainerClassName('list');

  assert.match(className, /max-w-\[1880px\]/);
  assert.doesNotMatch(className, /max-w-\[1600px\]/);
});
