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
              <th className="pb-3 pl-2">排名</th>
              <th className="pb-3">售后人员</th>
              <th className="pb-3 text-right">跟进次数</th>
              <th className="pb-3 text-right pr-2">充值业绩</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((staff, index) => (
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
                  <td className="py-3 text-right pr-2 font-bold text-emerald-600">¥{staff.amount.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-slate-500">{emptyText}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
