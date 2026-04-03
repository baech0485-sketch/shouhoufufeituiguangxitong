import React from 'react';

import AppPill from '../ui/AppPill';
import SurfaceCard from '../ui/SurfaceCard';
import { StaffPerformanceItem } from './monthly-utils';
import { getStaffPerformanceCardPresentation } from './staffPerformancePresentation.js';

interface StaffPerformanceTableProps {
  title: string;
  data: StaffPerformanceItem[];
  emptyText: string;
}

export default function StaffPerformanceTable({
  title,
  data,
  emptyText,
}: StaffPerformanceTableProps) {
  const maxAmount = data[0]?.amount || 0;

  return (
    <SurfaceCard className="flex h-full flex-col p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          按售后人员查看跟进门店数、充值门店数和总金额
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {data.length > 0 ? (
          data.map((staff, index) => {
            const presentation = getStaffPerformanceCardPresentation({
              index,
              amount: staff.amount,
              maxAmount,
            });

            return (
              <article
                key={staff.name}
                className={`overflow-hidden rounded-[var(--radius-xl)] border ${
                  presentation.containerTone === 'top'
                    ? 'border-[var(--color-brand-primary)] bg-[linear-gradient(135deg,_#eef4ff_0%,_#ffffff_68%)] shadow-[var(--shadow-card-hover)]'
                    : 'border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)]'
                }`}
              >
                <div className="flex items-start gap-4 p-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      presentation.isTopPerformer
                        ? 'bg-[var(--color-brand-primary)] text-white'
                        : 'bg-white text-[var(--color-brand-primary)] ring-1 ring-[var(--color-border-subtle)]'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                          {staff.name}
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          跟进 {staff.followedStores} 家 / 已充值 {staff.rechargedStores} 家
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p
                          className={`text-xl font-semibold tracking-[-0.03em] ${
                            presentation.amountTone === 'brand'
                              ? 'text-[var(--color-brand-primary)]'
                              : 'text-[var(--color-text-primary)]'
                          }`}
                        >
                          ¥{staff.amount.toLocaleString()}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                          充值业绩
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-[var(--color-border-subtle)]">
                      <div
                        className={`h-full rounded-full ${
                          presentation.isTopPerformer
                            ? 'bg-[linear-gradient(90deg,_#2563eb_0%,_#5b8cff_100%)]'
                            : 'bg-[linear-gradient(90deg,_#9ebcff_0%,_#d8e5ff_100%)]'
                        }`}
                        style={{ width: presentation.progressWidth }}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <AppPill tone="default">跟进 {staff.followedStores}</AppPill>
                      <AppPill tone="successSoft">可推 {staff.promotableStores}</AppPill>
                      <AppPill tone="brandSoft">转化 {staff.conversionRate.toFixed(1)}%</AppPill>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-4 py-10 text-sm text-[var(--color-text-muted)]">
            {emptyText}
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}
