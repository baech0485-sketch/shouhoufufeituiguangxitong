import React from 'react';

import AppButton from '../ui/AppButton';
import SelectField from '../ui/SelectField';
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
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-3">
        <InputField
          label="充值金额（元）"
          value={amount}
          onChange={onAmountChange}
          placeholder="0.00"
          type="number"
        />
        <InputField
          label="充值日期"
          value={rechargeDate}
          onChange={onRechargeDateChange}
          type="date"
        />
        <SelectField
          value={rechargeStaff}
          options={staffOptions.map((option) => ({ label: option, value: option }))}
          onChange={onRechargeStaffChange}
          label="售后人员"
        />
      </div>

      <ScreenshotUploadField
        label="充值截图"
        screenshotName={screenshotName}
        screenshotPreviewUrl={screenshotPreviewUrl}
        screenshotError={screenshotError}
        onFileChange={onScreenshotChange}
        onRemove={onScreenshotRemove}
      />

      <div className="flex justify-end">
        <AppButton type="submit">提交充值记录</AppButton>
      </div>
    </form>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-4 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-ring)]"
        required
      />
    </label>
  );
}
