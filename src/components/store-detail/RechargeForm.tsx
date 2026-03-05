import React from 'react';
import { DollarSign, Plus, Upload } from 'lucide-react';

interface RechargeFormProps {
  amount: string;
  rechargeDate: string;
  rechargeStaff: string;
  staffOptions: string[];
  onAmountChange: (value: string) => void;
  onRechargeDateChange: (value: string) => void;
  onRechargeStaffChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RechargeForm({
  amount,
  rechargeDate,
  rechargeStaff,
  staffOptions,
  onAmountChange,
  onRechargeDateChange,
  onRechargeStaffChange,
  onSubmit,
}: RechargeFormProps) {
  return (
    <div>
      <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
        <DollarSign size={20} className="mr-2 text-emerald-500" />
        新增充值记录
      </h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">充值金额 (元)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">充值日期</label>
          <input
            type="date"
            value={rechargeDate}
            onChange={(e) => onRechargeDateChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">售后人员</label>
          <select
            value={rechargeStaff}
            onChange={(e) => onRechargeStaffChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          >
            {staffOptions.map((option) => (
              <option key={`recharge-${option}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">充值截图</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-emerald-400 transition-colors cursor-pointer">
            <Upload size={24} className="mb-2" />
            <span className="text-sm font-medium">点击上传截图</span>
            <span className="text-xs mt-1">支持 JPG, PNG</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">* 演示环境：提交后将自动生成模拟截图</p>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors mt-4"
        >
          <Plus size={18} />
          <span>保存充值记录</span>
        </button>
      </form>
    </div>
  );
}
