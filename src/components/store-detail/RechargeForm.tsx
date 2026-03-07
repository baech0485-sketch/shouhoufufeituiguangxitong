import React from 'react';
import { DollarSign, Plus } from 'lucide-react';
import ScreenshotUploadField from './ScreenshotUploadField';

interface RechargeFormProps {
  amount: string;
  rechargeDate: string;
  rechargeStaff: string;
  staffOptions: string[];
  screenshotName: string;
  screenshotPreviewUrl: string;
  screenshotError: string;
  onAmountChange: (value: string) => void;
  onRechargeDateChange: (value: string) => void;
  onRechargeStaffChange: (value: string) => void;
  onScreenshotChange: (file: File | null) => void;
  onScreenshotRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RechargeForm({
  amount,
  rechargeDate,
  rechargeStaff,
  staffOptions,
  screenshotName,
  screenshotPreviewUrl,
  screenshotError,
  onAmountChange,
  onRechargeDateChange,
  onRechargeStaffChange,
  onScreenshotChange,
  onScreenshotRemove,
  onSubmit,
}: RechargeFormProps) {
  return (
    <div>
      <h4 className="mb-4 flex items-center text-lg font-bold text-slate-900">
        <DollarSign size={20} className="mr-2 text-indigo-500" />
        新增充值记录
      </h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">充值金额（元）</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-lg font-medium outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">充值日期</label>
          <input
            type="date"
            value={rechargeDate}
            onChange={(event) => onRechargeDateChange(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">售后人员</label>
          <select
            value={rechargeStaff}
            onChange={(event) => onRechargeStaffChange(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            required
          >
            {staffOptions.map((option) => (
              <option key={`recharge-${option}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <ScreenshotUploadField
          label="充值截图"
          screenshotName={screenshotName}
          screenshotPreviewUrl={screenshotPreviewUrl}
          screenshotError={screenshotError}
          onFileChange={onScreenshotChange}
          onRemove={onScreenshotRemove}
        />

        <button
          type="submit"
          className="mt-4 flex w-full items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus size={18} />
          <span>保存充值记录</span>
        </button>
      </form>
    </div>
  );
}
