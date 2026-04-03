import React, { useState } from 'react';
import { CheckCircle2, Store as StoreIcon } from 'lucide-react';

import type { CreateStorePayload } from '../api';
import { STORE_PLATFORM_OPTIONS } from '../constants/storePlatforms';
import { Platform } from '../types';
import AppButton from './ui/AppButton';
import IconBadge from './ui/IconBadge';
import SurfaceCard from './ui/SurfaceCard';

interface StoreEntryProps {
  onAddStore: (store: CreateStorePayload) => Promise<void>;
  onSuccess?: () => void;
  onCancel: () => void;
}

export default function StoreEntry({
  onAddStore,
  onSuccess,
  onCancel,
}: StoreEntryProps) {
  const [name, setName] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [platform, setPlatform] = useState<Platform>('美团餐饮');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !merchantId.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onAddStore({
        name: name.trim(),
        merchantId: merchantId.trim(),
        platform,
      });
      setName('');
      setMerchantId('');
      setShowSuccess(true);
      window.setTimeout(() => setShowSuccess(false), 3000);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SurfaceCard className="p-6 sm:p-8">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border-subtle)] pb-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <IconBadge tone="brand" icon={<StoreIcon size={18} />} />
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">新增店铺录入</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              录入店铺名称、商家 ID 和平台后立即写入云端。
            </p>
          </div>
        </div>
        <AppButton variant="secondary" onClick={onCancel}>
          取消
        </AppButton>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 xl:grid-cols-3">
        <FormItem label="店铺名称">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 w-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-4 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-ring)]"
            placeholder="请输入店铺名称"
            required
          />
        </FormItem>
        <FormItem label="商家ID">
          <input
            type="text"
            value={merchantId}
            onChange={(event) => setMerchantId(event.target.value)}
            className="h-12 w-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-4 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-ring)]"
            placeholder="请输入商家ID"
            required
          />
        </FormItem>
        <FormItem label="所属平台">
          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value as Platform)}
            className="h-12 w-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-4 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-ring)]"
          >
            {STORE_PLATFORM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormItem>

        <div className="xl:col-span-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <AppButton variant="secondary" onClick={onCancel}>
              关闭
            </AppButton>
            <AppButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '录入中...' : '确认录入'}
            </AppButton>
          </div>
        </div>
      </form>

      {showSuccess && (
        <div className="mt-5 flex items-center gap-3 rounded-[var(--radius-lg)] border border-emerald-200 bg-[var(--color-success-soft)] px-4 py-3 text-sm font-medium text-[var(--color-success)]">
          <CheckCircle2 size={18} />
          店铺录入成功！
        </div>
      )}
    </SurfaceCard>
  );
}

function FormItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
      </span>
      {children}
    </label>
  );
}
