import React from 'react';

import SelectField from '../ui/SelectField';

type DashboardPlatformFilter = 'all' | 'meituan' | 'eleme';

const DASHBOARD_PLATFORM_OPTIONS: Array<{
  label: string;
  value: DashboardPlatformFilter;
}> = [
  { label: '全部', value: 'all' },
  { label: '美团', value: 'meituan' },
  { label: '饿了么', value: 'eleme' },
];

interface DashboardControlsProps {
  selectedMonth: string;
  availableMonths: string[];
  selectedPlatform: DashboardPlatformFilter;
  onMonthChange: (month: string) => void;
  onPlatformChange: (platform: DashboardPlatformFilter) => void;
}

export default function DashboardControls({
  selectedMonth,
  availableMonths,
  selectedPlatform,
  onMonthChange,
  onPlatformChange,
}: DashboardControlsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-4 shadow-[var(--shadow-card)] lg:flex-row lg:items-end lg:justify-between">
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          平台筛选
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {DASHBOARD_PLATFORM_OPTIONS.map((option) => {
            const isActive = selectedPlatform === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onPlatformChange(option.value)}
                className={`rounded-[var(--radius-lg)] border px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-transparent bg-[var(--color-brand-soft)] text-[var(--color-brand-primary)]'
                    : 'border-[var(--color-border-subtle)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="min-w-[180px]">
        <SelectField
          value={selectedMonth}
          onChange={onMonthChange}
          label="统计月份"
          options={(availableMonths.length > 0 ? availableMonths : [selectedMonth]).map((month) => ({
            label: month,
            value: month,
          }))}
        />
      </div>
    </div>
  );
}
