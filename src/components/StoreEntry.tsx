import React, { useState } from 'react';
import { CheckCircle2, Save, Store as StoreIcon } from 'lucide-react';
import type { CreateStorePayload } from '../api';
import { STORE_PLATFORM_OPTIONS } from '../constants/storePlatforms';
import { Platform } from '../types';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <StoreIcon size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">新增店铺录入</h3>
            <p className="mt-1 text-sm text-slate-500">录入店铺名称、商家ID和平台后立即写入云端</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-900"
        >
          取消
        </button>
      </div>

      <div className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              店铺名称
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              placeholder="请输入店铺名称"
              required
            />
          </div>

          <div>
            <label htmlFor="merchantId" className="mb-2 block text-sm font-medium text-slate-700">
              商家ID
            </label>
            <input
              type="text"
              id="merchantId"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="请输入商家ID"
              required
            />
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-slate-700 mb-2">
              所属平台
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {STORE_PLATFORM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              关闭
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
            >
              <Save size={20} />
              <span>{isSubmitting ? '录入中...' : '确认录入'}</span>
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="mt-4 flex items-center space-x-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 animate-slide-up">
            <CheckCircle2 size={20} />
            <span className="font-medium">店铺录入成功！</span>
          </div>
        )}
      </div>
    </div>
  );
}
