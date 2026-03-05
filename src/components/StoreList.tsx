import React, { useEffect, useMemo, useState } from 'react';
import { Search, ChevronRight, Store as StoreIcon } from 'lucide-react';
import { storeApi } from '../api';
import { FollowUp, Recharge, Store } from '../types';
import StoreListPagination from './StoreListPagination';

const PAGE_SIZE = 10;

interface StoreListProps {
  onSelectStore: (store: Store) => void;
  refreshKey: number;
  followUps: FollowUp[];
  recharges: Recharge[];
}

export default function StoreList({
  onSelectStore,
  refreshKey,
  followUps,
  recharges,
}: StoreListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('全部');
  const [filterStatus, setFilterStatus] = useState<string>('全部');
  const [page, setPage] = useState(1);
  const [stores, setStores] = useState<Store[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const latestFollowUpStaffMap = useMemo(() => {
    const map = new Map<string, string>();
    followUps.forEach((record) => {
      if (!map.has(record.storeId) && record.staffName) {
        map.set(record.storeId, record.staffName);
      }
    });
    return map;
  }, [followUps]);

  const totalRechargeAmountMap = useMemo(() => {
    const map = new Map<string, number>();
    recharges.forEach((record) => {
      const currentAmount = map.get(record.storeId) || 0;
      map.set(record.storeId, currentAmount + record.amount);
    });
    return map;
  }, [recharges]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [filterPlatform, filterStatus]);

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await storeApi.list({
          page,
          pageSize: PAGE_SIZE,
          search: debouncedSearchTerm || undefined,
          platform: filterPlatform === '全部' ? undefined : filterPlatform,
          status: filterStatus === '全部' ? undefined : filterStatus,
        });

        setStores(response.items);
        setTotal(response.total);
        setTotalPages(response.totalPages);

        if (page > response.totalPages && response.totalPages > 0) {
          setPage(response.totalPages);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : '加载店铺列表失败';
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchStores();
  }, [page, debouncedSearchTerm, filterPlatform, filterStatus, refreshKey]);

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = total === 0 ? 0 : start + stores.length - 1;

  const getPlatformBadgeClass = (platform: string) => {
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
  };

  return (
    <div className="mx-auto w-full max-w-[1680px]">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">店铺列表</h2>
          <p className="text-slate-500 mt-1">每页展示 10 条，翻页时才请求云数据库下一页数据</p>
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
              className="px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white min-w-[140px]"
            >
              <option value="全部">全部平台</option>
              <option value="美团餐饮">美团餐饮</option>
              <option value="饿了么餐饮">饿了么餐饮</option>
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${getPlatformBadgeClass(store.platform)}`}>
                        {store.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{store.openDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        store.status === '待跟进'
                          ? 'bg-slate-100 text-slate-700'
                          : store.status === '已跟进'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {store.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {latestFollowUpStaffMap.get(store.id) || '-'}
                    </td>
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

        <StoreListPagination
          page={page}
          totalPages={totalPages}
          total={total}
          start={start}
          end={end}
          isLoading={isLoading}
          onPrevPage={() => setPage((prev) => Math.max(1, prev - 1))}
          onNextPage={() => setPage((prev) => Math.min(Math.max(1, totalPages), prev + 1))}
        />
      </div>
    </div>
  );
}
