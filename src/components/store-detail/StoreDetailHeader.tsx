import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, TrendingUp } from 'lucide-react';

import { Store } from '../../types';
import AppButton from '../ui/AppButton';
import AppIcon from '../ui/AppIcon';
import AppPill from '../ui/AppPill';
import { copyText, getStoreIdentityCopyTargets } from './storeDetailHeaderUtils.js';

interface StoreDetailHeaderProps {
  store: Store;
  onClose: () => void;
  onMarkPromoting: () => Promise<void>;
  onRestoreAutoStatus: () => Promise<void>;
  isUpdatingStatus: boolean;
}

export default function StoreDetailHeader({
  store,
  onClose,
  onMarkPromoting,
  onRestoreAutoStatus,
  isUpdatingStatus,
}: StoreDetailHeaderProps) {
  const copyTargets = useMemo(() => getStoreIdentityCopyTargets(store), [store]);
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    if (!copiedKey) {
      return undefined;
    }
    const timer = window.setTimeout(() => setCopiedKey(''), 1500);
    return () => window.clearTimeout(timer);
  }, [copiedKey]);

  const handleCopy = async (key: string, value: string) => {
    try {
      await copyText(value);
      setCopiedKey(key);
    } catch {
      setCopiedKey('');
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b border-[var(--color-border-subtle)] pb-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-primary)]">
          STORE DETAIL / FOLLOW-UP WORKBENCH
        </p>
        <div className="mt-2 flex items-center gap-3">
          <h3 className="text-[34px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[var(--color-text-primary)]">
            {store.name}
          </h3>
          <button
            type="button"
            onClick={() => handleCopy('name', store.name)}
            className="rounded-full border border-[var(--color-border-subtle)] p-2 text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
            title="复制店铺名"
          >
            {copiedKey === 'name' ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <AppPill tone="brandSoft">{store.platform}</AppPill>
          {copyTargets
            .filter((item) => item.key === 'merchantId')
            .map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleCopy(item.key, item.value)}
                className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
              >
                <span>{item.label}</span>
                {copiedKey === item.key ? <Check size={14} /> : <Copy size={14} />}
              </button>
            ))}
          <AppPill tone="default">录入 {store.openDate}</AppPill>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <AppPill tone={store.status === '已在推广' ? 'warningSoft' : 'brandSoft'}>
          当前状态：{store.status}
        </AppPill>
        {store.status === '已在推广' ? (
          <AppButton
            variant="secondary"
            icon={<RotateCcw size={16} />}
            onClick={() => void onRestoreAutoStatus()}
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? '恢复中...' : '恢复自动状态'}
          </AppButton>
        ) : (
          <AppButton
            icon={<TrendingUp size={16} />}
            onClick={() => void onMarkPromoting()}
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? '更新中...' : '标记已在推广'}
          </AppButton>
        )}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
        >
          <AppIcon name="close" size={18} />
        </button>
      </div>
    </div>
  );
}
