import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { CommunicationType, Intention } from '../../types';

interface FollowUpFormProps {
  commType: CommunicationType;
  intention: Intention;
  notes: string;
  staffName: string;
  staffOptions: string[];
  onCommTypeChange: (value: CommunicationType) => void;
  onIntentionChange: (value: Intention) => void;
  onNotesChange: (value: string) => void;
  onStaffNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FollowUpForm({
  commType,
  intention,
  notes,
  staffName,
  staffOptions,
  onCommTypeChange,
  onIntentionChange,
  onNotesChange,
  onStaffNameChange,
  onSubmit,
}: FollowUpFormProps) {
  return (
    <div>
      <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
        <MessageCircle size={20} className="mr-2 text-emerald-500" />
        新增跟进记录
      </h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">沟通方式</label>
            <select
              value={commType}
              onChange={(e) => onCommTypeChange(e.target.value as CommunicationType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="未沟通">未沟通</option>
              <option value="私聊">私聊</option>
              <option value="群聊">群聊</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">推广意向</label>
            <select
              value={intention}
              onChange={(e) => onIntentionChange(e.target.value as Intention)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="高">高</option>
              <option value="中">中</option>
              <option value="低">低</option>
              <option value="未知">未知</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">售后人员</label>
          <select
            value={staffName}
            onChange={(e) => onStaffNameChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
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
          <label className="block text-sm font-medium text-slate-700 mb-1">跟进备注</label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={4}
            placeholder="记录沟通详情、商家诉求等..."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium transition-colors mt-2"
        >
          <Plus size={18} />
          <span>保存跟进记录</span>
        </button>
      </form>
    </div>
  );
}
