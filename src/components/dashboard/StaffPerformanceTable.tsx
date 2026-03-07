import React from 'react';
import { StaffPerformanceItem } from './monthly-utils';

interface StaffPerformanceTableProps {
  title: string;
  data: StaffPerformanceItem[];
  emptyText: string;
}

export default function StaffPerformanceTable({
  title,
  data,
  emptyText,
}: StaffPerformanceTableProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-slate-900">{title}</h3>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-sm font-medium text-slate-500">
              <th className="pb-3 pt-3 pl-3">售后人员</th>
              <th className="pb-3 pt-3 text-right">跟进店铺数</th>
              <th className="pb-3 pt-3 text-right">可做推广店铺数</th>
              <th className="pb-3 pt-3 text-right">已充值店铺数</th>
              <th className="pb-3 pt-3 text-right">充值转化率</th>
              <th className="pb-3 pt-3 pr-3 text-right">充值业绩</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((staff) => (
                <tr key={staff.name} className="transition-colors hover:bg-indigo-50/40">
                  <td className="py-3 pl-3 font-medium text-slate-900">{staff.name}</td>
                  <td className="py-3 text-right text-slate-600">{staff.followedStores}</td>
                  <td className="py-3 text-right text-slate-600">{staff.promotableStores}</td>
                  <td className="py-3 text-right text-slate-600">{staff.rechargedStores}</td>
                  <td className="py-3 text-right text-slate-600">
                    {staff.conversionRate.toFixed(1)}%
                  </td>
                  <td className="py-3 pr-3 text-right font-bold text-emerald-600">
                    ¥{staff.amount.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
