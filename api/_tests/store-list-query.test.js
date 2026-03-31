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
    buildStoreListQuery({ platform: '淘宝闪购', status: '已跟进' }),
    {
      platform: '淘宝闪购',
      status: '已跟进',
    },
  );
});

test('buildStoreListQuery 会拒绝列表中已移除的平台', () => {
  assert.deepEqual(buildStoreListQuery({ platform: '京东到家' }), {
    platform: '__UNSUPPORTED_STORE_LIST_PLATFORM__',
  });
});

test('buildStoreListQuery 会转义搜索关键字', () => {
  assert.deepEqual(buildStoreListQuery({ search: '门店(测试)' }), {
    $or: [
      { name: { $regex: '门店\\(测试\\)', $options: 'i' } },
      { merchantId: { $regex: '门店\\(测试\\)', $options: 'i' } },
    ],
    platform: { $in: ALLOWED_STORE_LIST_PLATFORMS },
  });
});

test('buildStoreListQuery 搜索时会同时匹配店铺名和商家ID', () => {
  assert.deepEqual(buildStoreListQuery({ search: '31147173' }), {
    $or: [
      { name: { $regex: '31147173', $options: 'i' } },
      { merchantId: { $regex: '31147173', $options: 'i' } },
    ],
    platform: { $in: ALLOWED_STORE_LIST_PLATFORMS },
  });
});
