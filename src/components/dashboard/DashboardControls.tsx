import React from 'react';

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
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">平台筛选</label>
        <div className="flex flex-wrap items-center gap-2">
          {DASHBOARD_PLATFORM_OPTIONS.map((option) => {
            const isActive = selectedPlatform === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onPlatformChange(option.value)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label htmlFor="dashboard-month" className="mb-1 block text-sm font-medium text-slate-700">
          统计月份
        </label>
        <select
          id="dashboard-month"
          value={selectedMonth}
          onChange={(event) => onMonthChange(event.target.value)}
          className="min-w-[160px] rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {(availableMonths.length > 0 ? availableMonths : [selectedMonth]).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
