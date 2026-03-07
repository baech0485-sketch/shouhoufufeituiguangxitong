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
      <p className="text-sm text-slate-600 font-medium">
        显示 <span className="text-indigo-600 font-semibold">{start}-{end}</span> 条，共 <span className="text-slate-900 font-semibold">{total}</span> 条
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onPrevPage}
          disabled={page <= 1 || isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
        >
          <ChevronLeft size={16} />
          上一页
        </button>
        <span className="inline-flex items-center justify-center rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-200/50 min-w-[100px] text-center">
          第 {page} / {Math.max(1, totalPages)} 页
        </span>
        <button
          onClick={onNextPage}
          disabled={page >= totalPages || isLoading || total === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
        >
          下一页
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
