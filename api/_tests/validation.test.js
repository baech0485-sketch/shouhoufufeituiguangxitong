import test from 'node:test';
import assert from 'node:assert/strict';
import { getTrimmedText, parseNonNegativeAmount, parseRequiredTextFields } from '../_lib/validation.js';

test('getTrimmedText 会返回去空格后的文本', () => {
  assert.equal(getTrimmedText('  abc  '), 'abc');
  assert.equal(getTrimmedText(123), '123');
  assert.equal(getTrimmedText(null), '');
});

test('parseRequiredTextFields 可识别缺失字段', () => {
  const result = parseRequiredTextFields(
    {
      name: ' 店铺A ',
      platform: '',
    },
    ['name', 'platform'],
  );

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.deepEqual(result.missingFields, ['platform']);
  }
});

test('parseRequiredTextFields 会返回规范化后的字段值', () => {
  const result = parseRequiredTextFields(
    {
      name: ' 店铺A ',
      platform: ' 美团餐饮 ',
    },
    ['name', 'platform'],
  );

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.values, {
      name: '店铺A',
      platform: '美团餐饮',
    });
  }
});

test('parseNonNegativeAmount 仅接受非负数值', () => {
  assert.equal(parseNonNegativeAmount('12.5'), 12.5);
  assert.equal(parseNonNegativeAmount(0), 0);
  assert.equal(parseNonNegativeAmount('-1'), null);
  assert.equal(parseNonNegativeAmount('abc'), null);
});
