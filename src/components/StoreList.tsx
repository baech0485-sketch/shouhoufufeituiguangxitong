import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import type { CreateStorePayload } from '../api';
import { storeApi } from '../api';
import { FollowUp, Recharge, Store } from '../types';
import StoreEntry from './StoreEntry';
import StoreListPagination from './StoreListPagination';
import StoreListFilters from './store-list/StoreListFilters';
import {
  buildLatestFollowUpStaffMap,
  buildLatestPromotionStatusMap,
  buildRecordCountMap,
} from './store-list/storeListMetrics.js';
import StoreListTable from './store-list/StoreListTable';

const PAGE_SIZE = 10;

interface StoreListProps {
  onSelectStore: (store: Store) => void;
  onAddStore: (store: CreateStorePayload) => Promise<void>;
  refreshKey: number;
  followUps: FollowUp[];
  recharges: Recharge[];
  staffOptions: string[];
}

export default function StoreList({
  onSelectStore,
  onAddStore,
  refreshKey,
  followUps,
  recharges,
  staffOptions,
}: StoreListProps) {
  const [isStoreEntryOpen, setIsStoreEntryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('全部');
  const [filterStatus, setFilterStatus] = useState('全部');
  const [filterStaff, setFilterStaff] = useState('全部');
  const [page, setPage] = useState(1);
  const [stores, setStores] = useState<Store[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const latestFollowUpStaffMap = useMemo(
    () => buildLatestFollowUpStaffMap(followUps),
    [followUps],
  );
  const latestPromotionStatusMap = useMemo(
    () => buildLatestPromotionStatusMap(followUps),
    [followUps],
  );
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
  }, [filterPlatform, filterStatus, filterStaff]);

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const query = {
          search: debouncedSearchTerm || undefined,
          platform: filterPlatform === '全部' ? undefined : filterPlatform,
          status: filterStatus === '全部' ? undefined : filterStatus,
          staff: filterStaff === '全部' ? undefined : filterStaff,
        };

        const response = await storeApi.list({
          page,
          pageSize: PAGE_SIZE,
          ...query,
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
  }, [
    debouncedSearchTerm,
    filterPlatform,
    filterStaff,
    filterStatus,
    page,
    refreshKey,
  ]);

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = total === 0 ? 0 : start + stores.length - 1;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">店铺列表</h2>
          <p className="mt-1 text-slate-500">每页展示 10 条，售后筛选开启后会自动按全部结果筛选并分页</p>
        </div>
        <button
          type="button"
          onClick={() => setIsStoreEntryOpen((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus size={18} />
          <span>{isStoreEntryOpen ? '收起录入表单' : '新增店铺录入'}</span>
        </button>
      </div>

      {isStoreEntryOpen && (
        <StoreEntry
          onAddStore={onAddStore}
          onSuccess={() => {
            setPage(1);
            setIsStoreEntryOpen(false);
          }}
          onCancel={() => setIsStoreEntryOpen(false)}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <StoreListFilters
          searchTerm={searchTerm}
          filterPlatform={filterPlatform}
          filterStatus={filterStatus}
          filterStaff={filterStaff}
          staffOptions={staffOptions}
          onSearchTermChange={setSearchTerm}
          onFilterPlatformChange={setFilterPlatform}
          onFilterStatusChange={setFilterStatus}
          onFilterStaffChange={setFilterStaff}
        />

        <StoreListTable
          stores={stores}
          isLoading={isLoading}
          errorMessage={errorMessage}
          latestFollowUpStaffMap={latestFollowUpStaffMap}
          latestPromotionStatusMap={latestPromotionStatusMap}
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
