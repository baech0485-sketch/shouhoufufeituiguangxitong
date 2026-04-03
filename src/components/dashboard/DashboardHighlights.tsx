import React from 'react';

import SurfaceCard from '../ui/SurfaceCard';

interface DashboardHighlightsProps {
  promotableStoreCount: number;
  pendingScreenshotCount: number;
  pendingFollowUpCount: number;
}

function HighlightItem({
  accentClassName,
  value,
  label,
  note,
  backgroundClassName,
}: {
  accentClassName: string;
  value: string;
  label: string;
  note: string;
  backgroundClassName: string;
}) {
  return (
    <div className={`flex gap-4 rounded-[var(--radius-xl)] px-5 py-6 ${backgroundClassName}`}>
      <div className={`h-14 w-1 shrink-0 rounded-full ${accentClassName}`} />
      <div className="min-w-0">
        <p className="text-[32px] font-bold leading-none tracking-[-0.03em] text-[var(--color-text-primary)]">
          {value}
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">{label}</p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{note}</p>
      </div>
    </div>
  );
}

export default function DashboardHighlights({
  promotableStoreCount,
  pendingScreenshotCount,
  pendingFollowUpCount,
}: DashboardHighlightsProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">重点跟进提醒</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              把推广潜力、待继续跟进和截图缺失记录放在同一屏内，方便售后即时协同。
            </p>
          </div>
          <span className="inline-flex rounded-[var(--radius-lg)] bg-[var(--color-teal)] px-3 py-1.5 text-xs font-medium text-white">
            系统已自动聚合
          </span>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <HighlightItem
            accentClassName="bg-[var(--color-teal)]"
            value={`${promotableStoreCount}家`}
            label="可做推广门店"
            note="近 30 天转化率大于 14%"
            backgroundClassName="bg-[var(--color-teal-soft)]"
          />
          <HighlightItem
            accentClassName="bg-[var(--color-warning)]"
            value={`${pendingScreenshotCount}条`}
            label="待补截图记录"
            note="建议当天补齐凭证，避免后续判断失真"
            backgroundClassName="bg-[var(--color-warning-soft)]"
          />
          <HighlightItem
            accentClassName="bg-[var(--color-brand-primary)]"
            value={`${pendingFollowUpCount}家`}
            label="待继续跟进"
            note="已跟进但尚未充值的门店优先二次触达"
            backgroundClassName="bg-[var(--color-brand-soft)]"
          />
        </div>
      </div>
    </SurfaceCard>
  );
}
