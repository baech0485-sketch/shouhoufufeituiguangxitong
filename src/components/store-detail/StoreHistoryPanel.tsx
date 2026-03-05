import React from 'react';
import { Calendar, Trash2, User } from 'lucide-react';
import { FollowUp, Recharge } from '../../types';

export type StoreDetailTab = 'followUp' | 'recharge';

interface StoreHistoryPanelProps {
  activeTab: StoreDetailTab;
  onTabChange: (tab: StoreDetailTab) => void;
  followUps: FollowUp[];
  recharges: Recharge[];
  deletingFollowUpId: string;
  deletingRechargeId: string;
  onDeleteFollowUp: (id: string) => Promise<void>;
  onDeleteRecharge: (id: string) => Promise<void>;
}

function getIntentionClass(intention: FollowUp['intention']) {
  if (intention === '高') {
    return 'bg-red-100 text-red-700';
  }
  if (intention === '中') {
    return 'bg-orange-100 text-orange-700';
  }
  if (intention === '低') {
    return 'bg-blue-100 text-blue-700';
  }
  return 'bg-slate-100 text-slate-700';
}

export default function StoreHistoryPanel({
  activeTab,
  onTabChange,
  followUps,
  recharges,
  deletingFollowUpId,
  deletingRechargeId,
  onDeleteFollowUp,
  onDeleteRecharge,
}: StoreHistoryPanelProps) {
  return (
    <div className="w-1/2 border-r border-slate-200 flex flex-col bg-slate-50/50">
      <div className="p-4 border-b border-slate-200 flex space-x-4">
        <button
          type="button"
          onClick={() => onTabChange('followUp')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'followUp' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          跟进记录 ({followUps.length})
        </button>
        <button
          type="button"
          onClick={() => onTabChange('recharge')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'recharge' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          充值记录 ({recharges.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'followUp' ? (
          followUps.length > 0 ? (
            followUps.map((record) => (
              <div key={record.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-slate-900">
                    <User size={16} className="text-slate-400" />
                    <span>{record.staffName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      <Calendar size={14} />
                      <span>{record.date}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void onDeleteFollowUp(record.id)}
                      disabled={deletingFollowUpId === record.id}
                      className="inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={14} />
                      <span>{deletingFollowUpId === record.id ? '删除中' : '删除'}</span>
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2 mb-3">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                    {record.communicationType}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-md font-medium ${getIntentionClass(record.intention)}`}>
                    意向: {record.intention}
                  </span>
                </div>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {record.notes || '无备注内容'}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 text-sm">暂无跟进记录</div>
          )
        ) : recharges.length > 0 ? (
          recharges.map((record) => (
            <div key={record.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2 text-sm font-medium text-slate-900">
                  <User size={16} className="text-slate-400" />
                  <span>{record.staffName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <Calendar size={14} />
                    <span>{record.date}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void onDeleteRecharge(record.id)}
                    disabled={deletingRechargeId === record.id}
                    className="inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} />
                    <span>{deletingRechargeId === record.id ? '删除中' : '删除'}</span>
                  </button>
                </div>
              </div>
              <div className="flex items-baseline space-x-1 mb-3">
                <span className="text-lg font-bold text-emerald-600">¥{record.amount.toFixed(2)}</span>
                <span className="text-xs text-slate-500">充值金额</span>
              </div>
              {record.screenshotUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={record.screenshotUrl}
                    alt="充值截图"
                    className="w-full h-32 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-500 text-sm">暂无充值记录</div>
        )}
      </div>
    </div>
  );
}
