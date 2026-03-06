import React from 'react';
import { ChevronRight, Sparkles, Store as StoreIcon } from 'lucide-react';
import { Store } from '../../types';
import StorePromotionCell from './StorePromotionCell';

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

function getPlatformBadgeClass(platform: string) {
  if (platform === '美团餐饮') {
    return 'border border-amber-200 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800';
  }
  if (platform === '饿了么餐饮') {
    return 'border border-emerald-200 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800';
  }
  return 'border border-blue-200 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800';
}

function getCountBadgeClass(count: number, variant: 'followUp' | 'recharge') {
  if (count <= 0) {
    return 'border border-slate-200 bg-slate-100 text-slate-500';
  }

  if (variant === 'followUp') {
    return 'border border-indigo-200 bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700';
  }

  return 'border border-emerald-200 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700';
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

  return (
    <tr
      onClick={() => onSelectStore(store)}
      className="group cursor-pointer transition-all hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-transparent"
    >
      <td className="px-6 py-4 font-mono text-xs text-slate-600">{store.merchantId || '-'}</td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md transition-shadow group-hover:shadow-lg">
            <StoreIcon size={20} />
          </div>
          <span className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
            {store.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm ${getPlatformBadgeClass(store.platform)}`}>
          {store.platform}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">{store.openDate}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
            store.status === '待跟进'
              ? 'bg-slate-100 text-slate-700'
              : store.status === '已跟进'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {store.status === '已充值' && <Sparkles size={12} />}
          {store.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-slate-700">
        {latestFollowUpStaffMap.get(store.id) || '-'}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex min-w-[40px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${getCountBadgeClass(followUpCount, 'followUp')}`}>
          {followUpCount}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex min-w-[40px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${getCountBadgeClass(rechargeCount, 'recharge')}`}>
          {rechargeCount}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
        {totalRechargeAmountMap.has(store.id)
          ? `¥${totalRechargeAmountMap.get(store.id)?.toLocaleString()}`
          : '-'}
      </td>
      <td className="px-6 py-4">
        <StorePromotionCell
          orderConversionRate30d={promotionStatus.orderConversionRate30d}
          promotionDecisionLabel={promotionStatus.promotionDecisionLabel}
        />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="inline-flex items-center gap-1 text-slate-400 transition-colors group-hover:text-indigo-600">
          <span className="text-sm font-medium">详情</span>
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        </div>
      </td>
    </tr>
  );
}
