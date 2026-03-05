import React from 'react';
import { X } from 'lucide-react';
import { Store } from '../../types';

interface StoreDetailHeaderProps {
  store: Store;
  onClose: () => void;
}

function getStatusClass(status: Store['status']) {
  if (status === '待跟进') {
    return 'bg-slate-200 text-slate-700';
  }
  if (status === '已跟进') {
    return 'bg-blue-200 text-blue-800';
  }
  return 'bg-emerald-200 text-emerald-800';
}

export default function StoreDetailHeader({ store, onClose }: StoreDetailHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
      <div>
        <h3 className="text-xl font-bold text-slate-900">{store.name}</h3>
        <div className="flex items-center space-x-3 mt-1 text-sm text-slate-500">
          <span className="font-medium text-emerald-600">{store.platform}</span>
          <span>•</span>
          <span>开单日期: {store.openDate}</span>
          <span>•</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(store.status)}`}>
            {store.status}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
      >
        <X size={24} />
      </button>
    </div>
  );
}
