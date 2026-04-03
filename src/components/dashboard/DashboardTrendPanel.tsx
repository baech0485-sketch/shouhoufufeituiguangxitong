import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AppPill from '../ui/AppPill';
import SurfaceCard from '../ui/SurfaceCard';
import { getDashboardTrendPalette } from './dashboardTrendPalette.js';
import { DailyTrendItem } from './monthly-utils';

interface DashboardTrendPanelProps {
  selectedMonth: string;
  data: DailyTrendItem[];
}

export default function DashboardTrendPanel({
  selectedMonth,
  data,
}: DashboardTrendPanelProps) {
  const palette = getDashboardTrendPalette();

  return (
    <SurfaceCard className="flex h-full flex-col p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">充值趋势</h3>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            按日查看本月充值金额与充值笔数波动
          </p>
        </div>
        <AppPill tone="brandSoft">{selectedMonth || '当前月份'}</AppPill>
      </div>
      <div className="h-[320px] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-2 py-4 sm:px-4">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
              <defs>
                <linearGradient id="dashboardTrendBarFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.barGradientFrom} />
                  <stop offset="100%" stopColor={palette.barGradientTo} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={palette.gridStroke} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: palette.axisText, fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: palette.axisText, fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: palette.axisText, fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: `1px solid ${palette.tooltipBorder}`,
                  boxShadow: '0 12px 32px 0 rgba(15,23,42,0.08)',
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="amount"
                name="充值金额（元）"
                fill="url(#dashboardTrendBarFill)"
                stroke={palette.barStroke}
                strokeWidth={1}
                radius={[12, 12, 12, 12]}
                maxBarSize={28}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="count"
                name="充值笔数"
                stroke={palette.lineStroke}
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: palette.lineDotFill,
                  stroke: palette.lineDotStroke,
                  strokeWidth: 2,
                }}
                activeDot={{ r: 5, fill: palette.lineDotFill }}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-muted)]">
            当前筛选条件下暂无充值数据
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}
