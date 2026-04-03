import React, { useEffect, useState } from 'react';

import {
  CommunicationType,
  FollowUp,
  Intention,
  Recharge,
  Store,
} from '../types';
import { buildRechargePayload } from '../utils/rechargeSubmission.js';
import FollowUpForm from './store-detail/FollowUpForm';
import RechargeForm from './store-detail/RechargeForm';
import StoreDetailHeader from './store-detail/StoreDetailHeader';
import StoreHistoryPanel, { StoreDetailTab } from './store-detail/StoreHistoryPanel';
import {
  getStoreDetailModalContainerClassName,
  getStoreDetailModalPaneClassNames,
} from './store-detail/modalLayout.js';
import { useStoreDetailForms } from './store-detail/useStoreDetailForms';

interface StoreDetailModalProps {
  store: Store;
  followUps: FollowUp[];
  recharges: Recharge[];
  onClose: () => void;
  onAddFollowUp: (followUp: Omit<FollowUp, 'id'>) => void;
  onAddRecharge: (recharge: Omit<Recharge, 'id'>) => void;
  onDeleteFollowUp: (followUpId: string) => Promise<void>;
  onDeleteRecharge: (rechargeId: string) => Promise<void>;
  onMarkStoreAsPromoting: (storeId: string) => Promise<void>;
  onRestoreStoreAutoStatus: (storeId: string) => Promise<void>;
  isUpdatingStoreStatus: boolean;
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
  onMarkStoreAsPromoting,
  onRestoreStoreAutoStatus,
  isUpdatingStoreStatus,
  staffOptions,
}: StoreDetailModalProps) {
  const paneClassNames = getStoreDetailModalPaneClassNames();
  const [activeTab, setActiveTab] = useState<StoreDetailTab>('followUp');
  const {
    commType,
    intention,
    notes,
    orderConversionRate30d,
    staffName,
    amount,
    rechargeDate,
    rechargeStaff,
    deletingFollowUpId,
    deletingRechargeId,
    followUpScreenshot,
    rechargeScreenshot,
    setCommType,
    setIntention,
    setNotes,
    setOrderConversionRate30d,
    setStaffName,
    setAmount,
    setRechargeDate,
    setRechargeStaff,
    handleAddFollowUp,
    handleAddRecharge,
    handleDeleteFollowUp,
    handleDeleteRecharge,
  } = useStoreDetailForms({
    storeId: store.id,
    staffOptions,
    onAddFollowUp,
    onAddRecharge,
    onDeleteFollowUp,
    onDeleteRecharge,
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgb(15_23_42_/_0.34)] px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <div className={`${getStoreDetailModalContainerClassName()} animate-modal-in p-7`}>
          <StoreDetailHeader
            store={store}
            onClose={onClose}
            onMarkPromoting={() => onMarkStoreAsPromoting(store.id)}
            onRestoreAutoStatus={() => onRestoreStoreAutoStatus(store.id)}
            isUpdatingStatus={isUpdatingStoreStatus}
          />

          <div className="mt-5 flex flex-1 flex-col gap-5 overflow-hidden lg:flex-row">
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
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-5">
                <div>
                  <h4 className="text-lg font-semibold text-[var(--color-text-primary)]">录入工作台</h4>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    使用统一字段节奏与截图区域，减少表单误填，并让状态联动更直观。
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('followUp')}
                    className={`rounded-[var(--radius-lg)] px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'followUp'
                        ? 'bg-[var(--color-brand-primary)] text-white'
                        : 'border border-[var(--color-border-subtle)] bg-white text-[var(--color-text-secondary)]'
                    }`}
                  >
                    录入跟进
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('recharge')}
                    className={`rounded-[var(--radius-lg)] px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'recharge'
                        ? 'bg-[var(--color-brand-primary)] text-white'
                        : 'border border-[var(--color-border-subtle)] bg-white text-[var(--color-text-secondary)]'
                    }`}
                  >
                    录入充值
                  </button>
                </div>

                <div className="mt-5">
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
      </div>
    </div>
  );
}
