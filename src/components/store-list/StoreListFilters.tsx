import React from 'react';
import { Filter, Search } from 'lucide-react';

interface StoreListFiltersProps {
  searchTerm: string;
  filterPlatform: string;
  filterStatus: string;
  filterStaff: string;
  staffOptions: string[];
  onSearchTermChange: (value: string) => void;
  onFilterPlatformChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  onFilterStaffChange: (value: string) => void;
}

export default function StoreListFilters({
  searchTerm,
  filterPlatform,
  filterStatus,
  filterStaff,
  staffOptions,
  onSearchTermChange,
  onFilterPlatformChange,
  onFilterStatusChange,
  onFilterStaffChange,
}: StoreListFiltersProps) {
  return (
    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索店铺名称或商家ID..."
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Filter
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <select
              value={filterPlatform}
              onChange={(event) => onFilterPlatformChange(event.target.value)}
              className="min-w-[150px] cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
            onChange={(event) => onFilterStatusChange(event.target.value)}
            className="min-w-[130px] cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="全部">全部状态</option>
            <option value="待跟进">待跟进</option>
            <option value="已跟进">已跟进</option>
            <option value="已充值">已充值</option>
          </select>

          <select
            value={filterStaff}
            onChange={(event) => onFilterStaffChange(event.target.value)}
            className="min-w-[140px] cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="全部">全部售后</option>
            {staffOptions.map((staffName) => (
              <option key={staffName} value={staffName}>
                {staffName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
