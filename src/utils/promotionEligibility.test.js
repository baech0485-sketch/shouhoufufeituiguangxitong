import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getPromotionDecision,
  getPromotionDecisionLabel,
  parseOrderConversionRate30d,
} from './promotionEligibility.js';

test('parseOrderConversionRate30d 支持百分比数字并校验范围', () => {
  assert.equal(parseOrderConversionRate30d('15.5'), 15.5);
  assert.equal(parseOrderConversionRate30d(9), 9);
  assert.equal(parseOrderConversionRate30d(''), null);
  assert.equal(parseOrderConversionRate30d('abc'), null);
  assert.equal(parseOrderConversionRate30d('-1'), null);
  assert.equal(parseOrderConversionRate30d('101'), null);
});

test('getPromotionDecision 按30天下单转化率给出推广判断', () => {
  assert.equal(getPromotionDecision(15), 'promotable');
  assert.equal(getPromotionDecision(14), 'pending');
  assert.equal(getPromotionDecision(10), 'pending');
  assert.equal(getPromotionDecision(9.9), 'not_promotable');
  assert.equal(getPromotionDecision(null), 'unknown');
});

test('getPromotionDecisionLabel 返回列表展示文案', () => {
  assert.equal(getPromotionDecisionLabel(15), '可做推广');
  assert.equal(getPromotionDecisionLabel(9), '不可做推广');
  assert.equal(getPromotionDecisionLabel(12), '待观察');
  assert.equal(getPromotionDecisionLabel(null), '-');
});
