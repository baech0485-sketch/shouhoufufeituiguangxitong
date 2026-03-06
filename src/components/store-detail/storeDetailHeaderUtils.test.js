import test from 'node:test';
import assert from 'node:assert/strict';
import { getStoreIdentityCopyTargets } from './storeDetailHeaderUtils.js';

test('getStoreIdentityCopyTargets 返回店铺名和商家ID复制项', () => {
  const targets = getStoreIdentityCopyTargets({
    name: '火星炸货铺(卷饼·拌饼)',
    merchantId: '31880507',
  });

  assert.deepEqual(targets, [
    {
      key: 'name',
      label: '火星炸货铺(卷饼·拌饼)',
      value: '火星炸货铺(卷饼·拌饼)',
      copiedLabel: '店铺名',
    },
    {
      key: 'merchantId',
      label: '商家ID：31880507',
      value: '31880507',
      copiedLabel: '商家ID',
    },
  ]);
});

test('getStoreIdentityCopyTargets 在没有商家ID时只返回店铺名', () => {
  const targets = getStoreIdentityCopyTargets({
    name: '合力力烧烤',
    merchantId: '',
  });

  assert.deepEqual(targets, [
    {
      key: 'name',
      label: '合力力烧烤',
      value: '合力力烧烤',
      copiedLabel: '店铺名',
    },
  ]);
});