import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALLOWED_STORE_LIST_PLATFORMS,
  buildStoreListQuery,
} from '../_lib/store-list-query.js';

test('buildStoreListQuery 默认只返回店铺列表允许的平台', () => {
  assert.deepEqual(buildStoreListQuery({}), {
    platform: { $in: ALLOWED_STORE_LIST_PLATFORMS },
  });
});

test('buildStoreListQuery 支持允许的平台精确筛选', () => {
  assert.deepEqual(
    buildStoreListQuery({ platform: '美团餐饮', status: '已跟进' }),
    {
      platform: '美团餐饮',
      status: '已跟进',
    },
  );
});

test('buildStoreListQuery 会拒绝列表中已移除的平台', () => {
  assert.deepEqual(buildStoreListQuery({ platform: '美团外卖' }), {
    platform: '__UNSUPPORTED_STORE_LIST_PLATFORM__',
  });
});

test('buildStoreListQuery 会转义搜索关键字', () => {
  assert.deepEqual(buildStoreListQuery({ search: '门店(测试)' }), {
    name: { $regex: '门店\\(测试\\)', $options: 'i' },
    platform: { $in: ALLOWED_STORE_LIST_PLATFORMS },
  });
});
