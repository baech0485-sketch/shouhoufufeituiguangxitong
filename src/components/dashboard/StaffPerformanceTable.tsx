import React from 'react';
import { StaffPerformanceItem } from './monthly-utils';

interface StaffPerformanceTableProps {
  title: string;
  data: StaffPerformanceItem[];
  emptyText: string;
}

export default function StaffPerformanceTable({ title, data, emptyText }: StaffPerformanceTableProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 mb-6">{title}</h3>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
              <th className="pb-3">售后人员</th>
              <th className="pb-3 text-right">跟进店铺数</th>
              <th className="pb-3 text-right">已充值店铺数</th>
              <th className="pb-3 text-right">充值转化率</th>
              <th className="pb-3 text-right pr-2">充值业绩</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((staff) => (
                <tr key={staff.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-medium text-slate-900">{staff.name}</td>
                  <td className="py-3 text-right text-slate-600">{staff.followedStores}</td>
                  <td className="py-3 text-right text-slate-600">{staff.rechargedStores}</td>
                  <td className="py-3 text-right text-slate-600">{staff.conversionRate.toFixed(1)}%</td>
                  <td className="py-3 text-right pr-2 font-bold text-emerald-600">¥{staff.amount.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-500">{emptyText}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
