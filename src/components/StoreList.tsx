import React, { useState } from 'react';
import { Store } from '../types';
import { Search, ChevronRight, Store as StoreIcon } from 'lucide-react';

interface StoreListProps {
  stores: Store[];
  onSelectStore: (store: Store) => void;
}

export default function StoreList({ stores, onSelectStore }: StoreListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('全部');
  const [filterStatus, setFilterStatus] = useState<string>('全部');

  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === '全部' || store.platform === filterPlatform;
    const matchesStatus = filterStatus === '全部' || store.status === filterStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">店铺查询与跟进</h2>
          <p className="text-slate-500 mt-1">查询店铺信息，添加售后跟进记录及充值记录</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="搜索店铺名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white min-w-[120px]"
            >
              <option value="全部">全部平台</option>
              <option value="美团外卖">美团外卖</option>
              <option value="淘宝闪购">淘宝闪购</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white min-w-[120px]"
            >
              <option value="全部">全部状态</option>
              <option value="待跟进">待跟进</option>
              <option value="已跟进">已跟进</option>
              <option value="已充值">已充值</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                <th className="px-6 py-4">店铺名称</th>
                <th className="px-6 py-4">平台</th>
                <th className="px-6 py-4">开单日期</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <tr
                    key={store.id}
                    onClick={() => onSelectStore(store)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <StoreIcon size={20} />
                        </div>
                        <span className="font-medium text-slate-900">{store.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        store.platform === '美团外卖' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {store.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{store.openDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        store.status === '待跟进' ? 'bg-slate-100 text-slate-700' :
                        store.status === '已跟进' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {store.status}
                      </span>
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
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    没有找到符合条件的店铺
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
