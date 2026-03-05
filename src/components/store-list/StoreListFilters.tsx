import React from 'react';
import { Search, Filter } from 'lucide-react';

interface StoreListFiltersProps {
  searchTerm: string;
  filterPlatform: string;
  filterStatus: string;
  onSearchTermChange: (value: string) => void;
  onFilterPlatformChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
}

export default function StoreListFilters({
  searchTerm,
  filterPlatform,
  filterStatus,
  onSearchTermChange,
  onFilterPlatformChange,
  onFilterStatusChange,
}: StoreListFiltersProps) {
  return (
    <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索店铺名称或商家ID..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            <select
              value={filterPlatform}
              onChange={(e) => onFilterPlatformChange(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-w-[150px] appearance-none cursor-pointer shadow-sm"
            >
              <option value="全部">全部平台</option>
              <option value="美团餐饮">美团餐饮</option>
              <option value="饿了么餐饮">饿了么餐饮</option>
              <option value="美团外卖">美团外卖</option>
              <option value="淘宝闪购">淘宝闪购</option>
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-w-[130px] appearance-none cursor-pointer shadow-sm"
          >
            <option value="全部">全部状态</option>
            <option value="待跟进">待跟进</option>
            <option value="已跟进">已跟进</option>
            <option value="已充值">已充值</option>
          </select>
        </div>
      </div>
    </div>
  );
}
