import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { Store } from '../../types';
import { copyText, getStoreIdentityCopyTargets } from './storeDetailHeaderUtils.js';

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
    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
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
                <span className={`font-bold ${target.key === 'name' ? 'text-xl text-slate-900' : 'text-sm text-slate-600'}`}>
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
        <div className="flex items-center space-x-3 mt-2 text-sm text-slate-500">
          <span className="font-medium text-emerald-600">{store.platform}</span>
          <span>•</span>
          <span>开店日期 {store.openDate}</span>
          <span>•</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(store.status)}`}>
            {store.status}
          </span>
          {copyMessage ? <span className="text-indigo-600 font-medium">{copyMessage}</span> : null}
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
