import React, { useEffect, useMemo, useState } from 'react';
import {
  CircleCheckBig,
  Download,
  Percent,
  RefreshCw,
  Store as StoreIcon,
  WalletCards,
} from 'lucide-react';

import { StorePlatformItem } from '../api';
import { FollowUp, Recharge } from '../types';
import { downloadCsvFile } from '../utils/downloadTextFile.js';
import AppButton from './ui/AppButton';
import DashboardControls from './dashboard/DashboardControls';
import DashboardHighlights from './dashboard/DashboardHighlights';
import {
  buildDashboardHighlights,
  buildDashboardReportRows,
} from './dashboard/dashboardReport.js';
import DashboardStatCard from './dashboard/DashboardStatCard';
import DashboardTrendPanel from './dashboard/DashboardTrendPanel';
import {
  buildDailyTrendData,
  buildStaffPerformance,
  getAvailableMonths,
  getCurrentMonthKey,
  getMonthKey,
} from './dashboard/monthly-utils';
import {
  buildStorePlatformMap,
  filterRecordsByDashboardPlatform,
} from './dashboard/platformFilter.js';
import StaffPerformanceTable from './dashboard/StaffPerformanceTable';

type DashboardPlatformFilter = 'all' | 'meituan' | 'eleme';

interface DashboardProps {
  storePlatforms: StorePlatformItem[];
  recharges: Recharge[];
  followUps: FollowUp[];
}

export default function Dashboard({
  storePlatforms,
  recharges,
  followUps,
}: DashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedPlatform, setSelectedPlatform] =
    useState<DashboardPlatformFilter>('all');

  const storePlatformMap = useMemo(
    () => buildStorePlatformMap(storePlatforms),
    [storePlatforms],
  );
  const filteredRecharges = useMemo(
    () => filterRecordsByDashboardPlatform(recharges, selectedPlatform, storePlatformMap),
    [recharges, selectedPlatform, storePlatformMap],
  );
  const filteredFollowUps = useMemo(
    () => filterRecordsByDashboardPlatform(followUps, selectedPlatform, storePlatformMap),
    [followUps, selectedPlatform, storePlatformMap],
  );
  const availableMonths = useMemo(
    () => getAvailableMonths([...filteredRecharges, ...filteredFollowUps]),
    [filteredFollowUps, filteredRecharges],
  );

  useEffect(() => {
    const currentMonth = getCurrentMonthKey();
    if (availableMonths.includes(selectedMonth)) {
      return;
    }
    if (availableMonths.includes(currentMonth)) {
      setSelectedMonth(currentMonth);
      return;
    }
    setSelectedMonth(availableMonths[0] || currentMonth);
  }, [availableMonths, selectedMonth]);

  const monthlyRecharges = useMemo(
    () => filteredRecharges.filter((item) => getMonthKey(item.date) === selectedMonth),
    [filteredRecharges, selectedMonth],
  );
  const monthlyFollowUps = useMemo(
    () => filteredFollowUps.filter((item) => getMonthKey(item.date) === selectedMonth),
    [filteredFollowUps, selectedMonth],
  );
  const dailyTrendData = useMemo(
    () => buildDailyTrendData(filteredRecharges, selectedMonth),
    [filteredRecharges, selectedMonth],
  );
  const staffPerformance = useMemo(
    () => buildStaffPerformance(monthlyRecharges, monthlyFollowUps),
    [monthlyFollowUps, monthlyRecharges],
  );

  const monthlyRechargeAmount = monthlyRecharges.reduce((sum, item) => sum + item.amount, 0);
  const monthlyRechargedStoresCount = new Set(monthlyRecharges.map((item) => item.storeId)).size;
  const monthlyFollowedStoresCount = new Set(monthlyFollowUps.map((item) => item.storeId)).size;
  const monthlyConversionRate =
    monthlyFollowedStoresCount > 0
      ? ((monthlyRechargedStoresCount / monthlyFollowedStoresCount) * 100).toFixed(1)
      : '0.0';
  const { promotableStoreCount, pendingScreenshotCount, pendingFollowUpCount } =
    buildDashboardHighlights({
      monthlyFollowUps,
      monthlyRecharges,
      monthlyFollowedStoresCount,
      monthlyRechargedStoresCount,
    });

  const handleExportReport = () => {
    downloadCsvFile(
      `dashboard-${selectedMonth || 'current'}.csv`,
      buildDashboardReportRows({
        selectedMonth,
        monthlyFollowedStoresCount,
        monthlyRechargeAmount,
        monthlyRechargedStoresCount,
        monthlyConversionRate,
        staffPerformance,
      }),
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-primary)]">
            APRIL 2026 / DATA OVERVIEW
          </p>
          <h2 className="mt-2 text-[34px] font-extrabold leading-[40px] tracking-[-0.03em] text-[var(--color-text-primary)]">
            经营总览
          </h2>
          <p className="mt-2 max-w-[560px] text-sm font-medium leading-[22px] text-[var(--color-text-secondary)]">
            统一查看当月跟进、充值和推广潜力，重点信息集中在一屏内完成决策。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AppButton
            variant="secondary"
            icon={<RefreshCw size={16} />}
            onClick={() => window.location.reload()}
          >
            刷新数据
          </AppButton>
          <AppButton icon={<Download size={16} />} onClick={handleExportReport}>
            导出月报
          </AppButton>
        </div>
      </div>

      <DashboardControls
        selectedMonth={selectedMonth}
        availableMonths={availableMonths}
        selectedPlatform={selectedPlatform}
        onMonthChange={setSelectedMonth}
        onPlatformChange={setSelectedPlatform}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          icon={<StoreIcon size={18} />}
          title="当月跟进门店数"
          value={monthlyFollowedStoresCount}
          detail={`较当月记录 ${monthlyFollowUps.length} 条`}
          tone="brand"
          detailTone="brandSoft"
        />
        <DashboardStatCard
          icon={<WalletCards size={18} />}
          title="当月充值金额"
          value={`¥${monthlyRechargeAmount.toLocaleString()}`}
          detail={`充值 ${monthlyRecharges.length} 笔`}
          tone="teal"
          detailTone="successSoft"
        />
        <DashboardStatCard
          icon={<CircleCheckBig size={18} />}
          title="当月已充值门店"
          value={monthlyRechargedStoresCount}
          detail={`同比 +${Math.max(monthlyRechargedStoresCount - 1, 0)} 家`}
          tone="success"
          detailTone="brandSoft"
        />
        <DashboardStatCard
          icon={<Percent size={18} />}
          title="当月充值转化率"
          value={`${monthlyConversionRate}%`}
          detail={monthlyConversionRate === '0.0' ? '暂无样本' : '仍可提升'}
          tone="warning"
          detailTone="warningSoft"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_408px]">
        <DashboardTrendPanel selectedMonth={selectedMonth} data={dailyTrendData} />
        <StaffPerformanceTable
          title={`${selectedMonth} 售后人员绩效排行`}
          data={staffPerformance}
          emptyText="当前筛选条件下暂无绩效数据"
        />
      </div>

      <DashboardHighlights
        promotableStoreCount={promotableStoreCount}
        pendingScreenshotCount={pendingScreenshotCount}
        pendingFollowUpCount={pendingFollowUpCount}
      />
    </div>
  );
}
