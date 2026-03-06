import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DollarSign, Store as StoreIcon, TrendingUp, Users } from 'lucide-react';
import { FollowUp, Recharge, Store } from '../types';
import DashboardControls from './dashboard/DashboardControls';
import DashboardStatCard from './dashboard/DashboardStatCard';
import StaffPerformanceTable from './dashboard/StaffPerformanceTable';
import {
  buildDailyTrendData,
  buildStaffPerformance,
  getAvailableMonths,
  getMonthKey,
} from './dashboard/monthly-utils';
import {
  buildStorePlatformMap,
  filterRecordsByDashboardPlatform,
} from './dashboard/platformFilter.js';

type DashboardPlatformFilter = 'all' | 'meituan' | 'eleme';

interface DashboardProps {
  stores: Store[];
  recharges: Recharge[];
  followUps: FollowUp[];
}

export default function Dashboard({ stores, recharges, followUps }: DashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedPlatform, setSelectedPlatform] =
    useState<DashboardPlatformFilter>('all');

  const storePlatformMap = useMemo(() => buildStorePlatformMap(stores), [stores]);
  const filteredRecharges = useMemo(
    () => filterRecordsByDashboardPlatform(recharges, selectedPlatform, storePlatformMap),
    [recharges, selectedPlatform, storePlatformMap],
  );
  const filteredFollowUps = useMemo(
    () => filterRecordsByDashboardPlatform(followUps, selectedPlatform, storePlatformMap),
    [followUps, selectedPlatform, storePlatformMap],
  );
  const availableMonths = useMemo(
    () => getAvailableMonths(filteredRecharges),
    [filteredRecharges],
  );

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (availableMonths.includes(selectedMonth)) {
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

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">数据看板</h2>
          <p className="mt-1 text-slate-500">按平台与月份查看充值趋势、跟进门店和人员绩效</p>
        </div>
        <DashboardControls
          selectedMonth={selectedMonth}
          availableMonths={availableMonths}
          selectedPlatform={selectedPlatform}
          onMonthChange={setSelectedMonth}
          onPlatformChange={setSelectedPlatform}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          icon={<StoreIcon size={26} />}
          title="当月跟进门店数"
          value={monthlyFollowedStoresCount}
          iconClassName="bg-blue-500 shadow-blue-500/30"
          cardClassName="from-blue-50 border-blue-100"
        />
        <DashboardStatCard
          icon={<DollarSign size={26} />}
          title="当月充值金额"
          value={`¥${monthlyRechargeAmount.toLocaleString()}`}
          iconClassName="bg-emerald-500 shadow-emerald-500/30"
          cardClassName="from-emerald-50 border-emerald-100"
        />
        <DashboardStatCard
          icon={<Users size={26} />}
          title="当月已充值门店"
          value={monthlyRechargedStoresCount}
          iconClassName="bg-purple-500 shadow-purple-500/30"
          cardClassName="from-purple-50 border-purple-100"
        />
        <DashboardStatCard
          icon={<TrendingUp size={26} />}
          title="当月充值转化率"
          value={`${monthlyConversionRate}%`}
          iconClassName="bg-orange-500 shadow-orange-500/30"
          cardClassName="from-orange-50 border-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <h3 className="mb-6 flex items-center text-lg font-bold text-slate-900">
            <span className="mr-3 h-6 w-1 rounded-full bg-emerald-500"></span>
            {selectedMonth} 充值趋势（按日）
          </h3>
          <div className="h-80">
            {dailyTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis yAxisId="left" orientation="left" stroke="#10b981" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={10} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                      padding: '12px',
                    }}
                    cursor={{ fill: '#f1f5f9', radius: 8 }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                  <Bar yAxisId="left" dataKey="amount" name="充值金额（元）" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={32} />
                  <Line yAxisId="right" type="monotone" dataKey="count" name="充值笔数" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <TrendingUp size={32} className="text-slate-300" />
                  </div>
                  <p>当前筛选条件下暂无充值数据</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <StaffPerformanceTable
          title={`${selectedMonth} 售后人员绩效排行`}
          data={staffPerformance}
          emptyText="当前筛选条件下暂无绩效数据"
        />
      </div>
    </div>
  );
}
