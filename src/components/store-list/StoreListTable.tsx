import React from 'react';

import { Store } from '../../types';
import StoreListTableRow from './StoreListTableRow';
import { STORE_LIST_COLUMN_TITLES } from './storeListTablePresentation.js';

interface PromotionStatusItem {
  orderConversionRate30d: number | null;
  promotionDecisionLabel: string;
}

interface StoreListTableProps {
  stores: Store[];
  isLoading: boolean;
  errorMessage: string;
  latestFollowUpStaffMap: Map<string, string>;
  latestPromotionStatusMap: Map<string, PromotionStatusItem>;
  followUpCountMap: Map<string, number>;
  rechargeCountMap: Map<string, number>;
  totalRechargeAmountMap: Map<string, number>;
  onSelectStore: (store: Store) => void;
}

export default function StoreListTable(props: StoreListTableProps) {
  const {
    stores,
    isLoading,
    errorMessage,
    latestFollowUpStaffMap,
    latestPromotionStatusMap,
    followUpCountMap,
    rechargeCountMap,
    totalRechargeAmountMap,
    onSelectStore,
  } = props;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2 text-left">
        <thead>
          <tr>
            {STORE_LIST_COLUMN_TITLES.map((title) => (
              <th
                key={title}
                className="px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {errorMessage ? (
            <StoreListMessageRow colSpan={8} tone="error" message={errorMessage} />
          ) : isLoading ? (
            <StoreListMessageRow colSpan={8} tone="loading" message="正在加载店铺数据..." />
          ) : stores.length > 0 ? (
            stores.map((store) => (
              <React.Fragment key={store.id}>
                <StoreListTableRow
                  store={store}
                  latestFollowUpStaffMap={latestFollowUpStaffMap}
                  latestPromotionStatusMap={latestPromotionStatusMap}
                  followUpCountMap={followUpCountMap}
                  rechargeCountMap={rechargeCountMap}
                  totalRechargeAmountMap={totalRechargeAmountMap}
                  onSelectStore={onSelectStore}
                />
              </React.Fragment>
            ))
          ) : (
            <StoreListMessageRow colSpan={8} tone="empty" message="没有找到符合条件的店铺" />
          )}
        </tbody>
      </table>
    </div>
  );
}

function StoreListMessageRow({
  colSpan,
  tone,
  message,
}: {
  colSpan: number;
  tone: 'error' | 'loading' | 'empty';
  message: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <div
          className={`rounded-[var(--radius-lg)] border px-4 py-10 text-sm ${
            tone === 'error'
              ? 'border-red-200 bg-[var(--color-danger-soft)] text-red-700'
              : 'border-dashed border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] text-[var(--color-text-muted)]'
          }`}
        >
          {message}
        </div>
      </td>
    </tr>
  );
}
