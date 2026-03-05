import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <p className="text-sm text-slate-600">
        显示 {start}-{end} 条，共 {total} 条
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevPage}
          disabled={page <= 1 || isLoading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
        >
          <ChevronLeft size={16} />
          上一页
        </button>
        <span className="text-sm text-slate-600 min-w-[92px] text-center">
          第 {page} / {Math.max(1, totalPages)} 页
        </span>
        <button
          onClick={onNextPage}
          disabled={page >= totalPages || isLoading || total === 0}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
        >
          下一页
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
