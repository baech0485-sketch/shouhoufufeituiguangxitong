import React, { useState } from 'react';
import { Store, Platform } from '../types';
import { Save, CheckCircle2 } from 'lucide-react';

interface StoreEntryProps {
  onAddStore: (store: Omit<Store, 'id' | 'status' | 'storeCode'>) => void;
}

export default function StoreEntry({ onAddStore }: StoreEntryProps) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('美团餐饮');
  const [openDate, setOpenDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddStore({
      name,
      platform,
      openDate,
    });

    setName('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">每日开单店铺录入</h2>
        <p className="text-slate-500 mt-1">录入新开店铺并同步到云数据库</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
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
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="请输入店铺名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              所属平台
            </label>
            <div className="grid grid-cols-2 gap-4">
              {(['美团餐饮', '饿了么餐饮', '美团外卖', '淘宝闪购'] as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-3 rounded-lg border font-medium transition-all ${
                    platform === p
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="openDate" className="block text-sm font-medium text-slate-700 mb-2">
              开单日期
            </label>
            <input
              type="date"
              id="openDate"
              value={openDate}
              onChange={(e) => setOpenDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Save size={20} />
              <span>确认录入</span>
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 text-green-700 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 size={20} />
            <span className="font-medium">店铺录入成功！</span>
          </div>
        )}
      </div>
    </div>
  );
}
