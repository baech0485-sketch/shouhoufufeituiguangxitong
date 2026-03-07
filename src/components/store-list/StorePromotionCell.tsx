import React from 'react';

interface StorePromotionCellProps {
  orderConversionRate30d: number | null;
  promotionDecisionLabel: string;
}

function getPromotionBadgeClass(label: string) {
  if (label === '可做推广') {
    return 'border border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  if (label === '不可做推广') {
    return 'border border-red-200 bg-red-50 text-red-700';
  }
  if (label === '待观察') {
    return 'border border-amber-200 bg-amber-50 text-amber-700';
  }
  return 'border border-slate-200 bg-slate-100 text-slate-500';
}

export default function StorePromotionCell({
  orderConversionRate30d,
  promotionDecisionLabel,
}: StorePromotionCellProps) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${getPromotionBadgeClass(
          promotionDecisionLabel,
        )}`}
      >
        {promotionDecisionLabel}
      </span>
      <span className="text-sm text-slate-500">
        30天转化率：{orderConversionRate30d === null ? '-' : `${orderConversionRate30d}%`}
      </span>
    </div>
  );
}
