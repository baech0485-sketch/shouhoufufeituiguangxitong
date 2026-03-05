import React, { useMemo } from 'react';
import { Store, Recharge, FollowUp } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Store as StoreIcon } from 'lucide-react';

interface DashboardProps {
  stores: Store[];
  recharges: Recharge[];
  followUps: FollowUp[];
}

export default function Dashboard({ stores, recharges, followUps }: DashboardProps) {
  // Calculate key metrics
  const totalStores = stores.length;
  const totalRechargeAmount = recharges.reduce((sum, r) => sum + r.amount, 0);
  const rechargedStoresCount = new Set(recharges.map(r => r.storeId)).size;
  const conversionRate = totalStores > 0 ? ((rechargedStoresCount / totalStores) * 100).toFixed(1) : '0.0';

  // Group recharges by month
  const monthlyData = useMemo(() => {
    const data: Record<string, { month: string; amount: number; count: number }> = {};
    
    recharges.forEach(r => {
      const month = r.date.substring(0, 7); // YYYY-MM
      if (!data[month]) {
        data[month] = { month, amount: 0, count: 0 };
      }
      data[month].amount += r.amount;
      data[month].count += 1;
    });

    return Object.values(data).sort((a, b) => a.month.localeCompare(b.month));
  }, [recharges]);

  // Group performance by staff
  const staffPerformance = useMemo(() => {
    const data: Record<string, { name: string; amount: number; followUps: number }> = {};
    
    recharges.forEach(r => {
      if (!data[r.staffName]) {
        data[r.staffName] = { name: r.staffName, amount: 0, followUps: 0 };
      }
      data[r.staffName].amount += r.amount;
    });

    followUps.forEach(f => {
      if (!data[f.staffName]) {
        data[f.staffName] = { name: f.staffName, amount: 0, followUps: 0 };
      }
      data[f.staffName].followUps += 1;
    });

    return Object.values(data).sort((a, b) => b.amount - a.amount);
  }, [recharges, followUps]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">数据看板</h2>
        <p className="text-slate-500 mt-1">全局运营数据概览与售后绩效统计</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <StoreIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">总录入店铺</p>
            <p className="text-2xl font-bold text-slate-900">{totalStores}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">累计充值金额</p>
            <p className="text-2xl font-bold text-slate-900">¥{totalRechargeAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">已充值店铺数</p>
            <p className="text-2xl font-bold text-slate-900">{rechargedStoresCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">充值转化率</p>
            <p className="text-2xl font-bold text-slate-900">{conversionRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">月度充值趋势</h3>
          <div className="h-80">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis yAxisId="left" orientation="left" stroke="#10b981" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar yAxisId="left" dataKey="amount" name="充值金额 (元)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Line yAxisId="right" type="monotone" dataKey="count" name="充值笔数" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">暂无数据</div>
            )}
          </div>
        </div>

        {/* Staff Performance Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">售后人员绩效排行</h3>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="pb-3 pl-2">排名</th>
                  <th className="pb-3">售后人员</th>
                  <th className="pb-3 text-right">跟进次数</th>
                  <th className="pb-3 text-right pr-2">充值业绩</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffPerformance.length > 0 ? (
                  staffPerformance.map((staff, index) => (
                    <tr key={staff.name} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pl-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-slate-200 text-slate-700' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'text-slate-500'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-slate-900">{staff.name}</td>
                      <td className="py-3 text-right text-slate-600">{staff.followUps}</td>
                      <td className="py-3 text-right pr-2 font-bold text-emerald-600">
                        ¥{staff.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-500">暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
