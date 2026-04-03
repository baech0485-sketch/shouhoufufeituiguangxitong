import test from 'node:test';
import assert from 'node:assert/strict';

import { getDashboardTrendPalette } from './dashboardTrendPalette.js';

test('充值趋势图使用统一的品牌蓝柱状图和青绿色折线配色', () => {
  assert.deepEqual(getDashboardTrendPalette(), {
    gridStroke: '#dbe5f3',
    axisText: '#64748b',
    tooltipBorder: '#d7e2f0',
    barGradientFrom: '#eff5ff',
    barGradientTo: '#cfe0ff',
    barStroke: '#c2d6fb',
    lineStroke: '#0f766e',
    lineDotFill: '#0f766e',
    lineDotStroke: '#ffffff',
  });
});
