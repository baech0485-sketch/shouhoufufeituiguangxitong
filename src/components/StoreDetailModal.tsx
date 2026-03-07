import React, { useEffect, useState } from 'react';
import {
  CommunicationType,
  FollowUp,
  Intention,
  Recharge,
  Store,
} from '../types';
import { buildRechargePayload } from '../utils/rechargeSubmission.js';
import RechargeForm from './store-detail/RechargeForm';
import FollowUpForm from './store-detail/FollowUpForm';
import StoreDetailHeader from './store-detail/StoreDetailHeader';
import StoreHistoryPanel, { StoreDetailTab } from './store-detail/StoreHistoryPanel';
import {
  getStoreDetailModalContainerClassName,
  getStoreDetailModalPaneClassNames,
} from './store-detail/modalLayout.js';
import { useImageUploadField } from './store-detail/useImageUploadField';

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
  const paneClassNames = getStoreDetailModalPaneClassNames();
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
  const followUpScreenshot = useImageUploadField();
  const rechargeScreenshot = useImageUploadField();

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
    if (!staffName || followUpScreenshot.screenshotError) {
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
      screenshotUrl: followUpScreenshot.screenshotUrl,
    });

    setNotes('');
    setOrderConversionRate30d('');
    followUpScreenshot.clearScreenshot();
  };

  const handleAddRecharge = (event: React.FormEvent) => {
    event.preventDefault();
    if (!amount || !rechargeStaff || rechargeScreenshot.screenshotError) {
      return;
    }

    onAddRecharge(
      buildRechargePayload({
        storeId: store.id,
        amount,
        date: rechargeDate,
        screenshotUrl: rechargeScreenshot.screenshotUrl,
        staffName: rechargeStaff,
      }),
    );

    setAmount('');
    rechargeScreenshot.clearScreenshot();
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
      <div className={getStoreDetailModalContainerClassName()}>
        <StoreDetailHeader store={store} onClose={onClose} />
        <div className="flex flex-1 overflow-hidden">
          <div className={paneClassNames.historyPane}>
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
          </div>
          <div className={paneClassNames.formPane}>
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'followUp' ? (
                <FollowUpForm
                  commType={commType}
                  intention={intention}
                  notes={notes}
                  orderConversionRate30d={orderConversionRate30d}
                  staffName={staffName}
                  staffOptions={staffOptions}
                  screenshotName={followUpScreenshot.screenshotName}
                  screenshotPreviewUrl={followUpScreenshot.screenshotUrl}
                  screenshotError={followUpScreenshot.screenshotError}
                  onCommTypeChange={setCommType}
                  onIntentionChange={setIntention}
                  onNotesChange={setNotes}
                  onOrderConversionRate30dChange={setOrderConversionRate30d}
                  onStaffNameChange={setStaffName}
                  onScreenshotChange={followUpScreenshot.handleScreenshotChange}
                  onScreenshotRemove={followUpScreenshot.clearScreenshot}
                  onSubmit={handleAddFollowUp}
                />
              ) : (
                <RechargeForm
                  amount={amount}
                  rechargeDate={rechargeDate}
                  rechargeStaff={rechargeStaff}
                  staffOptions={staffOptions}
                  screenshotName={rechargeScreenshot.screenshotName}
                  screenshotPreviewUrl={rechargeScreenshot.screenshotUrl}
                  screenshotError={rechargeScreenshot.screenshotError}
                  onAmountChange={setAmount}
                  onRechargeDateChange={setRechargeDate}
                  onRechargeStaffChange={setRechargeStaff}
                  onScreenshotChange={rechargeScreenshot.handleScreenshotChange}
                  onScreenshotRemove={rechargeScreenshot.clearScreenshot}
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
