import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Store as StoreIcon } from 'lucide-react';
import { Recharge, FollowUp } from '../types';
import StaffPerformanceTable from './dashboard/StaffPerformanceTable';
import { buildDailyTrendData, buildStaffPerformance, getAvailableMonths, getMonthKey } from './dashboard/monthly-utils';

interface DashboardProps {
  recharges: Recharge[];
  followUps: FollowUp[];
}

export default function Dashboard({ recharges, followUps }: DashboardProps) {
  const availableMonths = useMemo(() => getAvailableMonths(recharges), [recharges]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (availableMonths.includes(selectedMonth)) {
      return;
    }
    setSelectedMonth(availableMonths[0] || currentMonth);
  }, [availableMonths, selectedMonth]);

  const monthlyRecharges = useMemo(
    () => recharges.filter((item) => getMonthKey(item.date) === selectedMonth),
    [recharges, selectedMonth],
  );
  const monthlyFollowUps = useMemo(
    () => followUps.filter((item) => getMonthKey(item.date) === selectedMonth),
    [followUps, selectedMonth],
  );
  const dailyTrendData = useMemo(
    () => buildDailyTrendData(recharges, selectedMonth),
    [recharges, selectedMonth],
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">数据看板</h2>
          <p className="text-slate-500 mt-1">按月统计，月度充值趋势按日展示</p>
        </div>
        <div>
          <label htmlFor="dashboard-month" className="block text-sm font-medium text-slate-700 mb-1">
            统计月份
          </label>
          <select
            id="dashboard-month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="min-w-[160px] px-4 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {(availableMonths.length > 0 ? availableMonths : [selectedMonth]).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <StoreIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">当月跟进店铺数</p>
            <p className="text-2xl font-bold text-slate-900">{monthlyFollowedStoresCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">当月充值金额</p>
            <p className="text-2xl font-bold text-slate-900">¥{monthlyRechargeAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">当月已充值店铺</p>
            <p className="text-2xl font-bold text-slate-900">{monthlyRechargedStoresCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">当月充值转化率</p>
            <p className="text-2xl font-bold text-slate-900">{monthlyConversionRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{selectedMonth} 充值趋势（按日）</h3>
          <div className="h-80">
            {dailyTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis yAxisId="left" orientation="left" stroke="#10b981" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar yAxisId="left" dataKey="amount" name="充值金额 (元)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Line yAxisId="right" type="monotone" dataKey="count" name="充值笔数" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3, strokeWidth: 2 }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">当月暂无充值数据</div>
            )}
          </div>
        </div>
        <StaffPerformanceTable
          title={`${selectedMonth} 售后人员绩效排行`}
          data={staffPerformance}
          emptyText="当月暂无绩效数据"
        />
      </div>
    </div>
  );
}
