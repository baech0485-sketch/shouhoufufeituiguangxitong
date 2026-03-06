import React, { useEffect, useMemo, useState } from 'react';
import { storeApi } from '../api';
import { FollowUp, Recharge, Store } from '../types';
import StoreListFilters from './store-list/StoreListFilters';
import { buildLatestFollowUpStaffMap, buildRecordCountMap } from './store-list/storeListMetrics.js';
import StoreListPagination from './StoreListPagination';
import StoreListTable from './store-list/StoreListTable';

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

  const latestFollowUpStaffMap = useMemo(() => buildLatestFollowUpStaffMap(followUps), [followUps]);
  const followUpCountMap = useMemo(() => buildRecordCountMap(followUps), [followUps]);
  const rechargeCountMap = useMemo(() => buildRecordCountMap(recharges), [recharges]);

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

  return (
    <div className="mx-auto w-full max-w-[1680px]">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">店铺列表</h2>
          <p className="text-slate-500 mt-1">每页展示 10 条，翻页时才请求云数据库下一页数据</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <StoreListFilters
          searchTerm={searchTerm}
          filterPlatform={filterPlatform}
          filterStatus={filterStatus}
          onSearchTermChange={setSearchTerm}
          onFilterPlatformChange={setFilterPlatform}
          onFilterStatusChange={setFilterStatus}
        />

        <StoreListTable
          stores={stores}
          isLoading={isLoading}
          errorMessage={errorMessage}
          latestFollowUpStaffMap={latestFollowUpStaffMap}
          followUpCountMap={followUpCountMap}
          rechargeCountMap={rechargeCountMap}
          totalRechargeAmountMap={totalRechargeAmountMap}
          onSelectStore={onSelectStore}
        />

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
