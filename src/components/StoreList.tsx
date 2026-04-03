import React, { useEffect, useMemo, useState } from 'react';

import type { CreateStorePayload } from '../api';
import { storeApi } from '../api';
import { FollowUp, Recharge, Store } from '../types';
import { downloadCsvFile } from '../utils/downloadTextFile.js';
import StoreEntry from './StoreEntry';
import StoreListPagination from './StoreListPagination';
import StoreListFilters from './store-list/StoreListFilters';
import {
  buildStoreListSummaryItems,
  countStoresByStatus,
} from './store-list/storeListSummary.js';
import StoreListSummaryBar from './store-list/StoreListSummaryBar';
import StoreListTable from './store-list/StoreListTable';
import StoreListToolbar from './store-list/StoreListToolbar';
import { buildStoreExportRows } from './store-list/storeListExport.js';
import SurfaceCard from './ui/SurfaceCard';
import {
  buildLatestFollowUpStaffMap,
  buildLatestPromotionStatusMap,
  buildRecordCountMap,
} from './store-list/storeListMetrics.js';

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
  const [isExporting, setIsExporting] = useState(false);
  const [summaryItems, setSummaryItems] = useState(() =>
    buildStoreListSummaryItems({ total: 0, statusCounts: {} }),
  );

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
  }, [debouncedSearchTerm, filterPlatform, filterStaff, filterStatus, page, refreshKey]);

  useEffect(() => {
    const fetchSummaryItems = async () => {
      try {
        const summaryStores = await storeApi.listAll({
          search: debouncedSearchTerm || undefined,
          platform: filterPlatform === '全部' ? undefined : filterPlatform,
          staff: filterStaff === '全部' ? undefined : filterStaff,
        });

        setSummaryItems(
          buildStoreListSummaryItems({
            total: summaryStores.length,
            statusCounts: countStoresByStatus(summaryStores),
          }),
        );
      } catch {
        setSummaryItems(buildStoreListSummaryItems({ total: 0, statusCounts: {} }));
      }
    };

    void fetchSummaryItems();
  }, [debouncedSearchTerm, filterPlatform, filterStaff, refreshKey]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      downloadCsvFile(
        `stores-page-${page}.csv`,
        buildStoreExportRows({
          stores,
          latestFollowUpStaffMap,
          followUpCountMap,
          rechargeCountMap,
          totalRechargeAmountMap,
        }),
      );
    } finally {
      setIsExporting(false);
    }
  };

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = total === 0 ? 0 : start + stores.length - 1;

  return (
    <div className="w-full space-y-6">
      <StoreListToolbar
        isStoreEntryOpen={isStoreEntryOpen}
        isExporting={isExporting}
        onToggleEntry={() => setIsStoreEntryOpen((prev) => !prev)}
        onExport={() => void handleExport()}
      />

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

      <SurfaceCard className="p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">智能筛选</h3>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                搜索与多维筛选同层呈现，减少来回切换和误操作。
              </p>
            </div>
            <span className="inline-flex rounded-[var(--radius-lg)] bg-[var(--color-brand-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-brand-primary)]">
              支持售后筛选分页
            </span>
          </div>

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

          <StoreListSummaryBar items={summaryItems} />
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">店铺数据总表</h3>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                保留高频列，状态与推广判断改成胶囊标签，方便快速扫描。
              </p>
            </div>
            <span className="inline-flex rounded-[var(--radius-lg)] bg-[var(--color-brand-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-brand-primary)]">
              当前展示 {start} - {end} / {total}
            </span>
          </div>

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
      </SurfaceCard>
    </div>
  );
}
