import React, { useEffect, useState } from 'react';
import {
  CommunicationType,
  FollowUp,
  Intention,
  Recharge,
  Store,
} from '../types';
import RechargeForm from './store-detail/RechargeForm';
import FollowUpForm from './store-detail/FollowUpForm';
import StoreDetailHeader from './store-detail/StoreDetailHeader';
import StoreHistoryPanel, { StoreDetailTab } from './store-detail/StoreHistoryPanel';

interface StoreDetailModalProps {
  store: Store;
  followUps: FollowUp[];
  recharges: Recharge[];
  onClose: () => void;
  onAddFollowUp: (followUp: Omit<FollowUp, 'id'>) => void;
  onAddRecharge: (recharge: Omit<Recharge, 'id'>) => void;
  onDeleteFollowUp: (followUpId: string) => Promise<void>;
  onDeleteRecharge: (rechargeId: string) => Promise<void>;
  staffOptions: string[];
}

export default function StoreDetailModal({
  store,
  followUps,
  recharges,
  onClose,
  onAddFollowUp,
  onAddRecharge,
  onDeleteFollowUp,
  onDeleteRecharge,
  staffOptions,
}: StoreDetailModalProps) {
  const [activeTab, setActiveTab] = useState<StoreDetailTab>('followUp');
  const [commType, setCommType] = useState<CommunicationType>('私聊');
  const [intention, setIntention] = useState<Intention>('未知');
  const [notes, setNotes] = useState('');
  const [orderConversionRate30d, setOrderConversionRate30d] = useState('');
  const [staffName, setStaffName] = useState(staffOptions[0] || '');
  const [amount, setAmount] = useState('');
  const [rechargeDate, setRechargeDate] = useState(new Date().toISOString().split('T')[0]);
  const [rechargeStaff, setRechargeStaff] = useState(staffOptions[0] || '');
  const [deletingFollowUpId, setDeletingFollowUpId] = useState('');
  const [deletingRechargeId, setDeletingRechargeId] = useState('');

  useEffect(() => {
    if (!staffName && staffOptions.length > 0) {
      setStaffName(staffOptions[0]);
    }
    if (!rechargeStaff && staffOptions.length > 0) {
      setRechargeStaff(staffOptions[0]);
    }
  }, [staffOptions, staffName, rechargeStaff]);

  const handleAddFollowUp = (event: React.FormEvent) => {
    event.preventDefault();
    if (!staffName) {
      return;
    }

    onAddFollowUp({
      storeId: store.id,
      date: new Date().toISOString().split('T')[0],
      communicationType: commType,
      intention,
      notes,
      staffName,
      orderConversionRate30d: orderConversionRate30d ? Number(orderConversionRate30d) : null,
    });

    setNotes('');
    setOrderConversionRate30d('');
  };

  const handleAddRecharge = (event: React.FormEvent) => {
    event.preventDefault();
    if (!amount || !rechargeStaff) {
      return;
    }

    onAddRecharge({
      storeId: store.id,
      amount: Number(amount),
      date: rechargeDate,
      screenshotUrl: 'https://picsum.photos/seed/receipt/400/300',
      staffName: rechargeStaff,
    });

    setAmount('');
  };

  const handleDeleteFollowUp = async (followUpId: string) => {
    const shouldDelete = window.confirm('确认删除这条跟进记录吗？删除后无法恢复。');
    if (!shouldDelete) {
      return;
    }

    setDeletingFollowUpId(followUpId);
    try {
      await onDeleteFollowUp(followUpId);
    } finally {
      setDeletingFollowUpId('');
    }
  };

  const handleDeleteRecharge = async (rechargeId: string) => {
    const shouldDelete = window.confirm('确认删除这条充值记录吗？删除后无法恢复。');
    if (!shouldDelete) {
      return;
    }

    setDeletingRechargeId(rechargeId);
    try {
      await onDeleteRecharge(rechargeId);
    } finally {
      setDeletingRechargeId('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <StoreDetailHeader store={store} onClose={onClose} />
        <div className="flex flex-1 overflow-hidden">
          <StoreHistoryPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            followUps={followUps}
            recharges={recharges}
            deletingFollowUpId={deletingFollowUpId}
            deletingRechargeId={deletingRechargeId}
            onDeleteFollowUp={handleDeleteFollowUp}
            onDeleteRecharge={handleDeleteRecharge}
          />
          <div className="flex w-1/2 flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'followUp' ? (
                <FollowUpForm
                  commType={commType}
                  intention={intention}
                  notes={notes}
                  orderConversionRate30d={orderConversionRate30d}
                  staffName={staffName}
                  staffOptions={staffOptions}
                  onCommTypeChange={setCommType}
                  onIntentionChange={setIntention}
                  onNotesChange={setNotes}
                  onOrderConversionRate30dChange={setOrderConversionRate30d}
                  onStaffNameChange={setStaffName}
                  onSubmit={handleAddFollowUp}
                />
              ) : (
                <RechargeForm
                  amount={amount}
                  rechargeDate={rechargeDate}
                  rechargeStaff={rechargeStaff}
                  staffOptions={staffOptions}
                  onAmountChange={setAmount}
                  onRechargeDateChange={setRechargeDate}
                  onRechargeStaffChange={setRechargeStaff}
                  onSubmit={handleAddRecharge}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
