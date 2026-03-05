import React, { useState } from 'react';
import { Store, FollowUp, Recharge, CommunicationType, Intention } from '../types';
import { X, MessageCircle, DollarSign, Upload, Plus, Calendar, User } from 'lucide-react';

interface StoreDetailModalProps {
  store: Store;
  followUps: FollowUp[];
  recharges: Recharge[];
  onClose: () => void;
  onAddFollowUp: (followUp: Omit<FollowUp, 'id'>) => void;
  onAddRecharge: (recharge: Omit<Recharge, 'id'>) => void;
}

export default function StoreDetailModal({
  store,
  followUps,
  recharges,
  onClose,
  onAddFollowUp,
  onAddRecharge,
}: StoreDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'followUp' | 'recharge'>('followUp');
  
  // FollowUp Form State
  const [commType, setCommType] = useState<CommunicationType>('私聊');
  const [intention, setIntention] = useState<Intention>('未知');
  const [notes, setNotes] = useState('');
  const [staffName, setStaffName] = useState('');

  // Recharge Form State
  const [amount, setAmount] = useState('');
  const [rechargeDate, setRechargeDate] = useState(new Date().toISOString().split('T')[0]);
  const [screenshot, setScreenshot] = useState('');
  const [rechargeStaff, setRechargeStaff] = useState('');

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) return;
    
    onAddFollowUp({
      storeId: store.id,
      date: new Date().toISOString().split('T')[0],
      communicationType: commType,
      intention,
      notes,
      staffName,
    });
    
    setNotes('');
    // Keep staff name for convenience
  };

  const handleAddRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !rechargeStaff.trim()) return;
    
    onAddRecharge({
      storeId: store.id,
      amount: Number(amount),
      date: rechargeDate,
      screenshotUrl: screenshot || 'https://picsum.photos/seed/receipt/400/300', // Mock screenshot
      staffName: rechargeStaff,
    });
    
    setAmount('');
    setScreenshot('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{store.name}</h3>
            <div className="flex items-center space-x-3 mt-1 text-sm text-slate-500">
              <span className="font-medium text-emerald-600">{store.platform}</span>
              <span>•</span>
              <span>开单日期: {store.openDate}</span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                store.status === '待跟进' ? 'bg-slate-200 text-slate-700' :
                store.status === '已跟进' ? 'bg-blue-200 text-blue-800' :
                'bg-emerald-200 text-emerald-800'
              }`}>
                {store.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: History */}
          <div className="w-1/2 border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 flex space-x-4">
              <button
                onClick={() => setActiveTab('followUp')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'followUp' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                跟进记录 ({followUps.length})
              </button>
              <button
                onClick={() => setActiveTab('recharge')}
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
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Calendar size={14} />
                          <span>{record.date}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mb-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                          {record.communicationType}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                          record.intention === '高' ? 'bg-red-100 text-red-700' :
                          record.intention === '中' ? 'bg-orange-100 text-orange-700' :
                          record.intention === '低' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
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
              ) : (
                recharges.length > 0 ? (
                  recharges.map((record) => (
                    <div key={record.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-2 text-sm font-medium text-slate-900">
                          <User size={16} className="text-slate-400" />
                          <span>{record.staffName}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Calendar size={14} />
                          <span>{record.date}</span>
                        </div>
                      </div>
                      <div className="flex items-baseline space-x-1 mb-3">
                        <span className="text-lg font-bold text-emerald-600">¥{record.amount.toFixed(2)}</span>
                        <span className="text-xs text-slate-500">充值金额</span>
                      </div>
                      {record.screenshotUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                          <img src={record.screenshotUrl} alt="充值截图" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500 text-sm">暂无充值记录</div>
                )
              )}
            </div>
          </div>

          {/* Right Panel: Forms */}
          <div className="w-1/2 flex flex-col bg-white">
            <div className="p-6 flex-1 overflow-y-auto">
              {activeTab === 'followUp' ? (
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <MessageCircle size={20} className="mr-2 text-emerald-500" />
                    新增跟进记录
                  </h4>
                  <form onSubmit={handleAddFollowUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">沟通方式</label>
                        <select
                          value={commType}
                          onChange={(e) => setCommType(e.target.value as CommunicationType)}
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
                          onChange={(e) => setIntention(e.target.value as Intention)}
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
                      <input
                        type="text"
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        placeholder="请输入您的姓名"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">跟进备注</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
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
              ) : (
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <DollarSign size={20} className="mr-2 text-emerald-500" />
                    新增充值记录
                  </h4>
                  <form onSubmit={handleAddRecharge} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">充值金额 (元)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">充值日期</label>
                      <input
                        type="date"
                        value={rechargeDate}
                        onChange={(e) => setRechargeDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">售后人员</label>
                      <input
                        type="text"
                        value={rechargeStaff}
                        onChange={(e) => setRechargeStaff(e.target.value)}
                        placeholder="请输入您的姓名"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">充值截图</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-emerald-400 transition-colors cursor-pointer">
                        <Upload size={24} className="mb-2" />
                        <span className="text-sm font-medium">点击上传截图</span>
                        <span className="text-xs mt-1">支持 JPG, PNG</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">* 演示环境：提交后将自动生成模拟截图</p>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors mt-4"
                    >
                      <Plus size={18} />
                      <span>保存充值记录</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
