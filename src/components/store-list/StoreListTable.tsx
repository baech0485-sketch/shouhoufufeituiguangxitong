import React from 'react';
import { ChevronRight, Store as StoreIcon, Sparkles } from 'lucide-react';
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
    return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200';
  }
  if (platform === '饿了么餐饮') {
    return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200';
  }
  if (platform === '美团外卖') {
    return 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border border-orange-200';
  }
  return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200';
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
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">商家ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">店铺名称</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">平台</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">开单日期</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">状态</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">售后</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">充值金额</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {errorMessage ? (
            <tr>
              <td colSpan={8} className="px-6 py-16 text-center">
                <div className="text-red-600">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <p>{errorMessage}</p>
                </div>
              </td>
            </tr>
          ) : isLoading ? (
            <tr>
              <td colSpan={8} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p>正在加载店铺数据...</p>
                </div>
              </td>
            </tr>
          ) : stores.length > 0 ? (
            stores.map((store) => (
              <tr
                key={store.id}
                onClick={() => onSelectStore(store)}
                className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-transparent transition-all cursor-pointer group"
              >
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">{store.merchantId || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                      <StoreIcon size={20} />
                    </div>
                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{store.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${getPlatformBadgeClass(store.platform)}`}
                  >
                    {store.platform}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">{store.openDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
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
                <td className="px-6 py-4 text-slate-700 font-medium text-sm">{latestFollowUpStaffMap.get(store.id) || '-'}</td>
                <td className="px-6 py-4 text-slate-900 font-semibold text-sm">
                  {totalRechargeAmountMap.has(store.id)
                    ? `¥${totalRechargeAmountMap.get(store.id)?.toLocaleString()}`
                    : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-1 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <span className="text-sm font-medium">详情</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-6 py-16 text-center">
                <div className="text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <StoreIcon size={32} className="text-slate-300" />
                  </div>
                  <p>没有找到符合条件的店铺</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
