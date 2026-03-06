import React from 'react';
import { ChevronRight, Store as StoreIcon, Sparkles } from 'lucide-react';
import { Store } from '../../types';

interface StoreListTableProps {
  stores: Store[];
  isLoading: boolean;
  errorMessage: string;
  latestFollowUpStaffMap: Map<string, string>;
  followUpCountMap: Map<string, number>;
  rechargeCountMap: Map<string, number>;
  totalRechargeAmountMap: Map<string, number>;
  onSelectStore: (store: Store) => void;
}

function getPlatformBadgeClass(platform: string) {
  if (platform === '\u7f8e\u56e2\u9910\u996e') {
    return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200';
  }
  if (platform === '\u997f\u4e86\u4e48\u9910\u996e') {
    return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200';
  }
  if (platform === '\u7f8e\u56e2\u5916\u5356') {
    return 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border border-orange-200';
  }
  return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200';
}

function getCountBadgeClass(count: number, variant: 'followUp' | 'recharge') {
  if (count <= 0) {
    return 'bg-slate-100 text-slate-500 border border-slate-200';
  }

  if (variant === 'followUp') {
    return 'bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 border border-indigo-200';
  }

  return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200';
}

export default function StoreListTable({
  stores,
  isLoading,
  errorMessage,
  latestFollowUpStaffMap,
  followUpCountMap,
  rechargeCountMap,
  totalRechargeAmountMap,
  onSelectStore,
}: StoreListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">\u5546\u5bb6ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">\u5e97\u94fa\u540d\u79f0</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">\u5e73\u53f0</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">\u5f00\u5e97\u65e5\u671f</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">\u72b6\u6001</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">\u552e\u540e</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">\u8ddf\u8fdb\u6b21\u6570</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">\u5145\u503c\u6b21\u6570</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">\u5145\u503c\u91d1\u989d</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">\u64cd\u4f5c</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {errorMessage ? (
            <tr>
              <td colSpan={10} className="px-6 py-16 text-center">
                <div className="text-red-600">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">\u26a0\ufe0f</span>
                  </div>
                  <p>{errorMessage}</p>
                </div>
              </td>
            </tr>
          ) : isLoading ? (
            <tr>
              <td colSpan={10} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p>\u6b63\u5728\u52a0\u8f7d\u5e97\u94fa\u6570\u636e...</p>
                </div>
              </td>
            </tr>
          ) : stores.length > 0 ? (
            stores.map((store) => {
              const followUpCount = followUpCountMap.get(store.id) || 0;
              const rechargeCount = rechargeCountMap.get(store.id) || 0;

              return (
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
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${getPlatformBadgeClass(store.platform)}`}>
                      {store.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{store.openDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                        store.status === '\u5f85\u8ddf\u8fdb'
                          ? 'bg-slate-100 text-slate-700'
                          : store.status === '\u5df2\u8ddf\u8fdb'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {store.status === '\u5df2\u5145\u503c' && <Sparkles size={12} />}
                      {store.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium text-sm">{latestFollowUpStaffMap.get(store.id) || '-'}</td>
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
                  <td className="px-6 py-4 text-slate-900 font-semibold text-sm">
                    {totalRechargeAmountMap.has(store.id)
                      ? `\u00a5${totalRechargeAmountMap.get(store.id)?.toLocaleString()}`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1 text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <span className="text-sm font-medium">\u8be6\u60c5</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={10} className="px-6 py-16 text-center">
                <div className="text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <StoreIcon size={32} className="text-slate-300" />
                  </div>
                  <p>\u6ca1\u6709\u627e\u5230\u7b26\u5408\u6761\u4ef6\u7684\u5e97\u94fa</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
