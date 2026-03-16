import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, TrendingUp, X } from 'lucide-react';
import { Store } from '../../types';
import { copyText, getStoreIdentityCopyTargets } from './storeDetailHeaderUtils.js';

interface StoreDetailHeaderProps {
  store: Store;
  onClose: () => void;
  onMarkPromoting: () => Promise<void>;
  onRestoreAutoStatus: () => Promise<void>;
  isUpdatingStatus: boolean;
}

function getStatusClass(status: Store['status']) {
  if (status === '待跟进') {
    return 'bg-slate-100 text-slate-700';
  }
  if (status === '已跟进') {
    return 'bg-blue-100 text-blue-700';
  }
  if (status === '已在推广') {
    return 'bg-violet-100 text-violet-700';
  }
  return 'bg-emerald-100 text-emerald-700';
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
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    if (!copiedKey) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCopiedKey('');
      setCopyMessage('');
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [copiedKey]);

  const handleCopy = async (target: { key: string; value: string; copiedLabel: string }) => {
    try {
      await copyText(target.value);
      setCopiedKey(target.key);
      setCopyMessage(`已复制${target.copiedLabel}`);
    } catch {
      setCopiedKey('');
      setCopyMessage('复制失败，请手动复制');
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          {copyTargets.map((target) => {
            const isCopied = copiedKey === target.key;
            return (
              <button
                key={target.key}
                type="button"
                onClick={() => handleCopy(target)}
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-indigo-300 hover:bg-indigo-50"
                title={`点击复制${target.copiedLabel}`}
              >
                <span
                  className={`font-bold ${
                    target.key === 'name' ? 'text-xl text-slate-900' : 'text-sm text-slate-600'
                  }`}
                >
                  {target.label}
                </span>
                {isCopied ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <Copy size={16} className="text-slate-400 group-hover:text-indigo-500" />
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center space-x-3 text-sm text-slate-500">
          <span className="font-medium text-emerald-600">{store.platform}</span>
          <span>•</span>
          <span>开店日期 {store.openDate}</span>
          <span>•</span>
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${getStatusClass(store.status)}`}>
            {store.status}
          </span>
          {copyMessage ? <span className="font-medium text-indigo-600">{copyMessage}</span> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {store.status === '已在推广' ? (
          <button
            type="button"
            onClick={() => void onRestoreAutoStatus()}
            disabled={isUpdatingStatus}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw size={16} />
            {isUpdatingStatus ? '恢复中...' : '恢复自动状态'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void onMarkPromoting()}
            disabled={isUpdatingStatus}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <TrendingUp size={16} />
            {isUpdatingStatus ? '更新中...' : '标记已在推广'}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
