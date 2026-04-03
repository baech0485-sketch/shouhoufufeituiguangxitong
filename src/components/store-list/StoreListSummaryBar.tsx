import React from 'react';

import AppPill from '../ui/AppPill';

interface SummaryItem {
  label: string;
  value: number;
  tone: 'brandSoft' | 'successSoft' | 'warningSoft' | 'default';
}

interface StoreListSummaryBarProps {
  items: SummaryItem[];
}

export default function StoreListSummaryBar({
  items,
}: StoreListSummaryBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <AppPill key={item.label} tone={item.tone}>
          {item.label} {item.value}
        </AppPill>
      ))}
    </div>
  );
}
