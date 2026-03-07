import React from 'react';
import { Store as StoreIcon } from 'lucide-react';
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
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            {STORE_LIST_COLUMN_TITLES.map((title) => (
              <th
                key={title}
                className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {errorMessage ? (
            <StoreListMessageRow colSpan={10} tone="error" message={errorMessage} />
          ) : isLoading ? (
            <StoreListMessageRow colSpan={10} tone="loading" message="正在加载店铺数据..." />
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
            <StoreListMessageRow colSpan={10} tone="empty" message="没有找到符合条件的店铺" />
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
      <td colSpan={colSpan} className="px-6 py-16 text-center">
        {tone === 'loading' ? (
          <div className="flex flex-col items-center justify-center text-slate-500">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
            <p>{message}</p>
          </div>
        ) : (
          <div className={tone === 'error' ? 'text-red-600' : 'text-slate-400'}>
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              {tone === 'error' ? (
                <span className="text-2xl">⚠️</span>
              ) : (
                <StoreIcon size={32} className="text-slate-300" />
              )}
            </div>
            <p>{message}</p>
          </div>
        )}
      </td>
    </tr>
  );
}
