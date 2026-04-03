import React from 'react';

import { CommunicationType, Intention } from '../../types';
import AppButton from '../ui/AppButton';
import SelectField from '../ui/SelectField';
import ScreenshotUploadField from './ScreenshotUploadField';

interface FollowUpFormProps {
  commType: CommunicationType;
  intention: Intention;
  notes: string;
  orderConversionRate30d: string;
  staffName: string;
  staffOptions: string[];
  screenshotName: string;
  screenshotPreviewUrl: string;
  screenshotError: string;
  onCommTypeChange: (value: CommunicationType) => void;
  onIntentionChange: (value: Intention) => void;
  onNotesChange: (value: string) => void;
  onOrderConversionRate30dChange: (value: string) => void;
  onStaffNameChange: (value: string) => void;
  onScreenshotChange: (file: File | null) => void;
  onScreenshotRemove: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

const COMMUNICATION_OPTIONS = [
  { label: '未沟通', value: '未沟通' },
  { label: '私聊', value: '私聊' },
  { label: '群聊', value: '群聊' },
];

const INTENTION_OPTIONS = [
  { label: '高', value: '高' },
  { label: '中', value: '中' },
  { label: '低', value: '低' },
  { label: '未知', value: '未知' },
];

export default function FollowUpForm({
  commType,
  intention,
  notes,
  orderConversionRate30d,
  staffName,
  staffOptions,
  screenshotName,
  screenshotPreviewUrl,
  screenshotError,
  onCommTypeChange,
  onIntentionChange,
  onNotesChange,
  onOrderConversionRate30dChange,
  onStaffNameChange,
  onScreenshotChange,
  onScreenshotRemove,
  onSubmit,
}: FollowUpFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-3">
        <SelectField
          value={commType}
          options={COMMUNICATION_OPTIONS}
          onChange={(value) => onCommTypeChange(value as CommunicationType)}
          label="沟通方式"
        />
        <SelectField
          value={intention}
          options={INTENTION_OPTIONS}
          onChange={(value) => onIntentionChange(value as Intention)}
          label="客户意向"
        />
        <SelectField
          value={staffName}
          options={staffOptions.map((option) => ({ label: option, value: option }))}
          onChange={onStaffNameChange}
          label="售后人员"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <InputField
          label="30 天下单转化率"
          value={orderConversionRate30d}
          placeholder="例如 14.8%"
          type="number"
          onChange={onOrderConversionRate30dChange}
        />
        <InputField label="沟通日期" value={new Date().toISOString().slice(0, 10)} type="date" readOnly />
        <InputField label="下一步动作" value="补充截图后评估推广" readOnly />
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
          跟进备注
        </span>
        <textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          rows={4}
          placeholder="记录关键沟通结论、风险点和下一步动作，避免售后交接时信息丢失。"
          className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-ring)]"
        />
      </label>

      <ScreenshotUploadField
        label="截图上传"
        screenshotName={screenshotName}
        screenshotPreviewUrl={screenshotPreviewUrl}
        screenshotError={screenshotError}
        onFileChange={onScreenshotChange}
        onRemove={onScreenshotRemove}
      />

      <div className="flex justify-end">
        <AppButton type="submit">提交跟进记录</AppButton>
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
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-12 w-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-4 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-ring)]"
      />
    </label>
  );
}
