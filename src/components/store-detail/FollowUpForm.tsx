import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { CommunicationType, Intention } from '../../types';
import ScreenshotUploadField from './ScreenshotUploadField';

interface FollowUpFormProps {
  commType: CommunicationType;
  intention: Intention;
  notes: string;
  orderConversionRate30d: string;
  staffName: string;
  staffOptions: string[];
  screenshotName: string;
  screenshotPreviewUrl: string;
  screenshotError: string;
  onCommTypeChange: (value: CommunicationType) => void;
  onIntentionChange: (value: Intention) => void;
  onNotesChange: (value: string) => void;
  onOrderConversionRate30dChange: (value: string) => void;
  onStaffNameChange: (value: string) => void;
  onScreenshotChange: (file: File | null) => void;
  onScreenshotRemove: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function FollowUpForm({
  commType,
  intention,
  notes,
  orderConversionRate30d,
  staffName,
  staffOptions,
  screenshotName,
  screenshotPreviewUrl,
  screenshotError,
  onCommTypeChange,
  onIntentionChange,
  onNotesChange,
  onOrderConversionRate30dChange,
  onStaffNameChange,
  onScreenshotChange,
  onScreenshotRemove,
  onSubmit,
}: FollowUpFormProps) {
  return (
    <div>
      <h4 className="mb-4 flex items-center text-lg font-bold text-slate-900">
        <MessageCircle size={20} className="mr-2 text-indigo-500" />
        新增跟进记录
      </h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">沟通方式</label>
            <select
              value={commType}
              onChange={(event) => onCommTypeChange(event.target.value as CommunicationType)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="未沟通">未沟通</option>
              <option value="私聊">私聊</option>
              <option value="群聊">群聊</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">推广意向</label>
            <select
              value={intention}
              onChange={(event) => onIntentionChange(event.target.value as Intention)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="高">高</option>
              <option value="中">中</option>
              <option value="低">低</option>
              <option value="未知">未知</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">售后人员</label>
          <select
            value={staffName}
            onChange={(event) => onStaffNameChange(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            required
          >
            {staffOptions.map((option) => (
              <option key={`followup-${option}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            30天下单转化率（%）
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={orderConversionRate30d}
            onChange={(event) => onOrderConversionRate30dChange(event.target.value)}
            placeholder="例如 14.5"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <p className="mt-1 text-xs text-slate-500">
            大于 14% 可做推广，小于 10% 不可做推广。
          </p>
        </div>

        <ScreenshotUploadField
          label="跟进截图"
          screenshotName={screenshotName}
          screenshotPreviewUrl={screenshotPreviewUrl}
          screenshotError={screenshotError}
          onFileChange={onScreenshotChange}
          onRemove={onScreenshotRemove}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">跟进备注</label>
          <textarea
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            rows={4}
            placeholder="记录沟通详情、商家诉求等..."
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus size={18} />
          <span>保存跟进记录</span>
        </button>
      </form>
    </div>
  );
}
