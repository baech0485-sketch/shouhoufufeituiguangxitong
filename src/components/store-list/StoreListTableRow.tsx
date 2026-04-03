import React from 'react';

import { Store } from '../../types';
import AppPill from '../ui/AppPill';
import {
  getPlatformAppearance,
  getStoreStatusAppearance,
} from '../ui/statusAppearance.js';
import StorePromotionCell from './StorePromotionCell';
import { getStoreNameTextClassName } from './storeListTablePresentation.js';

interface PromotionStatusItem {
  orderConversionRate30d: number | null;
  promotionDecisionLabel: string;
}

interface StoreListTableRowProps {
  store: Store;
  latestFollowUpStaffMap: Map<string, string>;
  latestPromotionStatusMap: Map<string, PromotionStatusItem>;
  followUpCountMap: Map<string, number>;
  rechargeCountMap: Map<string, number>;
  totalRechargeAmountMap: Map<string, number>;
  onSelectStore: (store: Store) => void;
}

export default function StoreListTableRow({
  store,
  latestFollowUpStaffMap,
  latestPromotionStatusMap,
  followUpCountMap,
  rechargeCountMap,
  totalRechargeAmountMap,
  onSelectStore,
}: StoreListTableRowProps) {
  const followUpCount = followUpCountMap.get(store.id) || 0;
  const rechargeCount = rechargeCountMap.get(store.id) || 0;
  const promotionStatus = latestPromotionStatusMap.get(store.id) || {
    orderConversionRate30d: null,
    promotionDecisionLabel: '-',
  };
  const statusAppearance = getStoreStatusAppearance(store.status);
  const platformAppearance = getPlatformAppearance(store.platform);

  return (
    <tr
      onClick={() => onSelectStore(store)}
      className="group cursor-pointer transition-transform hover:-translate-y-0.5"
    >
      <td className="rounded-l-[var(--radius-lg)] border border-r-0 border-[var(--color-border-subtle)] bg-white px-4 py-4 align-top group-hover:bg-[var(--color-brand-soft)]">
        <div className="space-y-1">
          <p className={getStoreNameTextClassName()}>{store.name}</p>
          <p className="text-xs text-[var(--color-text-muted)]">录入日期 {store.openDate}</p>
        </div>
      </td>
      <td className="border border-x-0 border-[var(--color-border-subtle)] bg-white px-4 py-4 align-top text-sm text-[var(--color-text-secondary)] group-hover:bg-[var(--color-brand-soft)]">
        {store.merchantId || '-'}
      </td>
      <td className="border border-x-0 border-[var(--color-border-subtle)] bg-white px-4 py-4 align-top group-hover:bg-[var(--color-brand-soft)]">
        <AppPill tone={platformAppearance.tone}>{platformAppearance.label}</AppPill>
      </td>
      <td className="border border-x-0 border-[var(--color-border-subtle)] bg-white px-4 py-4 align-top group-hover:bg-[var(--color-brand-soft)]">
        <AppPill tone={statusAppearance.tone}>{statusAppearance.label}</AppPill>
      </td>
      <td className="border border-x-0 border-[var(--color-border-subtle)] bg-white px-4 py-4 align-top text-sm font-medium text-[var(--color-text-secondary)] group-hover:bg-[var(--color-brand-soft)]">
        {latestFollowUpStaffMap.get(store.id) || '-'}
      </td>
      <td className="border border-x-0 border-[var(--color-border-subtle)] bg-white px-4 py-4 align-top text-sm text-[var(--color-text-secondary)] group-hover:bg-[var(--color-brand-soft)]">
        {followUpCount} / {rechargeCount}
      </td>
      <td className="border border-x-0 border-[var(--color-border-subtle)] bg-white px-4 py-4 align-top text-sm font-medium text-[var(--color-text-primary)] group-hover:bg-[var(--color-brand-soft)]">
        {totalRechargeAmountMap.has(store.id)
          ? `¥${totalRechargeAmountMap.get(store.id)?.toLocaleString()}`
          : '¥0'}
      </td>
      <td className="rounded-r-[var(--radius-lg)] border border-l-0 border-[var(--color-border-subtle)] bg-white px-4 py-4 align-top group-hover:bg-[var(--color-brand-soft)]">
        <StorePromotionCell promotionDecisionLabel={promotionStatus.promotionDecisionLabel} />
      </td>
    </tr>
  );
}
