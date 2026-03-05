import React from 'react';
import { ChevronRight, Store as StoreIcon } from 'lucide-react';
import { Store } from '../../types';

interface StoreListTableProps {
  stores: Store[];
  isLoading: boolean;
  errorMessage: string;
  latestFollowUpStaffMap: Map<string, string>;
  totalRechargeAmountMap: Map<string, number>;
  onSelectStore: (store: Store) => void;
}

function getPlatformBadgeClass(platform: string) {
  if (platform === '美团餐饮') {
    return 'bg-amber-100 text-amber-800 border border-amber-200';
  }
  if (platform === '饿了么餐饮') {
    return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  }
  if (platform === '美团外卖') {
    return 'bg-orange-100 text-orange-800 border border-orange-200';
  }
  return 'bg-slate-100 text-slate-700 border border-slate-200';
}

export default function StoreListTable({
  stores,
  isLoading,
  errorMessage,
  latestFollowUpStaffMap,
  totalRechargeAmountMap,
  onSelectStore,
}: StoreListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
            <th className="px-6 py-4">商家ID</th>
            <th className="px-6 py-4">店铺名称</th>
            <th className="px-6 py-4">平台</th>
            <th className="px-6 py-4">开单日期</th>
            <th className="px-6 py-4">状态</th>
            <th className="px-6 py-4">售后</th>
            <th className="px-6 py-4">充值金额</th>
            <th className="px-6 py-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {errorMessage ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-red-600">
                {errorMessage}
              </td>
            </tr>
          ) : isLoading ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                正在加载店铺数据...
              </td>
            </tr>
          ) : stores.length > 0 ? (
            stores.map((store) => (
              <tr
                key={store.id}
                onClick={() => onSelectStore(store)}
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">{store.merchantId || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <StoreIcon size={20} />
                    </div>
                    <span className="font-medium text-slate-900">{store.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${getPlatformBadgeClass(store.platform)}`}
                  >
                    {store.platform}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{store.openDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      store.status === '待跟进'
                        ? 'bg-slate-100 text-slate-700'
                        : store.status === '已跟进'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {store.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{latestFollowUpStaffMap.get(store.id) || '-'}</td>
                <td className="px-6 py-4 text-slate-600">
                  {totalRechargeAmountMap.has(store.id)
                    ? `¥${totalRechargeAmountMap.get(store.id)?.toFixed(2)}`
                    : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <span className="text-sm mr-1">详情</span>
                    <ChevronRight size={18} />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                没有找到符合条件的店铺
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
