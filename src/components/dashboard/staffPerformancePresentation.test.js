import test from 'node:test';
import assert from 'node:assert/strict';

import { getStaffPerformanceCardPresentation } from './staffPerformancePresentation.js';

test('榜首卡片使用更突出的强调样式并占满进度条', () => {
  assert.deepEqual(
    getStaffPerformanceCardPresentation({ index: 0, amount: 26800, maxAmount: 26800 }),
    {
      isTopPerformer: true,
      containerTone: 'top',
      amountTone: 'brand',
      progressWidth: '100%',
    },
  );
});

test('普通卡片根据金额比例生成进度宽度并保持中性样式', () => {
  assert.deepEqual(
    getStaffPerformanceCardPresentation({ index: 2, amount: 13400, maxAmount: 26800 }),
    {
      isTopPerformer: false,
      containerTone: 'default',
      amountTone: 'default',
      progressWidth: '50%',
    },
  );
});
