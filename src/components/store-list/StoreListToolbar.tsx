import React from 'react';
import { Download, Plus } from 'lucide-react';

import AppButton from '../ui/AppButton';

interface StoreListToolbarProps {
  isStoreEntryOpen: boolean;
  isExporting: boolean;
  onToggleEntry: () => void;
  onExport: () => void;
}

export default function StoreListToolbar({
  isStoreEntryOpen,
  isExporting,
  onToggleEntry,
  onExport,
}: StoreListToolbarProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-primary)]">
          STORE MANAGEMENT / FILTER & ACT
        </p>
        <h2 className="mt-2 text-[34px] font-extrabold leading-[40px] tracking-[-0.03em] text-[var(--color-text-primary)]">
          店铺列表
        </h2>
        <p className="mt-2 max-w-[560px] text-sm font-medium leading-[22px] text-[var(--color-text-secondary)]">
          围绕搜索、平台、状态和售后维度快速筛选，把高频操作集中到同一层级完成。
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <AppButton
          variant="secondary"
          icon={<Download size={16} />}
          onClick={onExport}
          disabled={isExporting}
        >
          {isExporting ? '导出中...' : '批量导出'}
        </AppButton>
        <AppButton icon={<Plus size={16} />} onClick={onToggleEntry}>
          {isStoreEntryOpen ? '收起录入' : '新增店铺'}
        </AppButton>
      </div>
    </div>
  );
}
