import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import AppButton from './ui/AppButton';

interface StoreListPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  start: number;
  end: number;
  isLoading: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function StoreListPagination({
  page,
  totalPages,
  total,
  start,
  end,
  isLoading,
  onPrevPage,
  onNextPage,
}: StoreListPaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-border-subtle)] bg-transparent px-6 py-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-[var(--color-text-muted)]">
        显示 {start}-{end} 条，共 {total} 条
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex rounded-[var(--radius-lg)] bg-[var(--color-brand-soft)] px-3 py-2 text-sm font-semibold text-[var(--color-brand-primary)]">
          第 {page} / {Math.max(1, totalPages)} 页
        </span>
        <AppButton
          variant="secondary"
          icon={<ChevronLeft size={16} />}
          onClick={onPrevPage}
          disabled={page <= 1 || isLoading}
        >
          上一页
        </AppButton>
        <AppButton
          variant="secondary"
          icon={<ChevronRight size={16} />}
          onClick={onNextPage}
          disabled={page >= totalPages || isLoading || total === 0}
        >
          下一页
        </AppButton>
      </div>
    </div>
  );
}
