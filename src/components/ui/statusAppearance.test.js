import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getPlatformAppearance,
  getPromotionAppearance,
  getStoreStatusAppearance,
} from './statusAppearance.js';

test('店铺状态映射到新的视觉语义', () => {
  assert.deepEqual(getStoreStatusAppearance('待跟进'), {
    tone: 'brandSoft',
    label: '待跟进',
  });
  assert.deepEqual(getStoreStatusAppearance('已充值'), {
    tone: 'successSoft',
    label: '已充值',
  });
  assert.deepEqual(getStoreStatusAppearance('已在推广'), {
    tone: 'warningSoft',
    label: '已在推广',
  });
});

test('平台与推广判断映射到统一标签语义', () => {
  assert.equal(getPlatformAppearance('美团外卖').tone, 'brandSoft');
  assert.equal(getPlatformAppearance('饿了么餐饮').tone, 'tealSoft');
  assert.equal(getPromotionAppearance('可做推广').tone, 'successSoft');
  assert.equal(getPromotionAppearance('待观察').tone, 'default');
});
