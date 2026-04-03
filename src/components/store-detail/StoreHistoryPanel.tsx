import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

import { FollowUp, Recharge } from '../../types';
import { normalizeAfterSalesStaffName } from '../../utils/afterSalesStaff.js';
import { getPromotionDecisionLabel } from '../../utils/promotionEligibility.js';
import AppIcon from '../ui/AppIcon';
import AppPill from '../ui/AppPill';
import IconBadge from '../ui/IconBadge';
import StoreHistoryPreviewDialog from './StoreHistoryPreviewDialog';
import { getRechargeScreenshotPreview } from './storeHistoryMedia.js';
import {
  closeStoreHistoryPreview,
  openStoreHistoryPreview,
} from './storeHistoryPreviewState.js';

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
  const [previewState, setPreviewState] = useState(closeStoreHistoryPreview());
  const summaryText =
    activeTab === 'followUp'
      ? `跟进 ${followUps.length} 次 / 充值 ${recharges.length} 次 / 当前以${followUps.length > 0 ? '跟进' : '待跟进'}为主`
      : `充值 ${recharges.length} 次 / 最近一次金额 ${recharges[0]?.amount ?? 0} 元`;

  return (
    <div className="flex h-full w-full flex-col rounded-[var(--radius-xl)] bg-[var(--color-bg-canvas)] p-4">
      <div>
        <h4 className="text-lg font-semibold text-[var(--color-text-primary)]">历史记录</h4>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          跟进记录与充值记录集中展示，便于回溯状态变化与沟通动作。
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <TabButton
          active={activeTab === 'followUp'}
          label={`跟进记录 (${followUps.length})`}
          onClick={() => onTabChange('followUp')}
        />
        <TabButton
          active={activeTab === 'recharge'}
          label={`充值记录 (${recharges.length})`}
          onClick={() => onTabChange('recharge')}
        />
      </div>

      <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
        {activeTab === 'followUp' ? (
          followUps.length > 0 ? (
            followUps.map((record) => {
              const promotionLabel = getPromotionDecisionLabel(record.orderConversionRate30d);
              const iconName =
                promotionLabel === '可做推广'
                  ? 'spark'
                  : record.screenshotUrl
                    ? 'image'
                    : 'message';

              return (
                <article
                  key={record.id}
                  className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <IconBadge
                        tone="surface"
                        icon={<AppIcon name={iconName} size={16} />}
                        className="h-9 w-9"
                      />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          {normalizeAfterSalesStaffName(record.staffName)}
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{record.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AppPill
                        tone={
                          promotionLabel === '可做推广'
                            ? 'successSoft'
                            : promotionLabel === '待观察'
                              ? 'warningSoft'
                              : 'brandSoft'
                        }
                      >
                        {record.intention === '未知' ? promotionLabel : `${record.intention}意向`}
                      </AppPill>
                      <button
                        type="button"
                        onClick={() => void onDeleteFollowUp(record.id)}
                        disabled={deletingFollowUpId === record.id}
                        className="inline-flex rounded-full p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-danger-soft)] hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-[var(--color-text-secondary)]">
                    {record.notes || '暂无备注内容'}
                  </p>
                </article>
              );
            })
          ) : (
            <EmptyState text="暂无跟进记录" />
          )
        ) : recharges.length > 0 ? (
          recharges.map((record) => {
            const screenshotPreview = getRechargeScreenshotPreview(record);

            return (
              <article
                key={record.id}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <IconBadge
                      tone="surface"
                      icon={<AppIcon name="wallet" size={16} />}
                      className="h-9 w-9"
                    />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {normalizeAfterSalesStaffName(record.staffName)}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">{record.date}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void onDeleteRecharge(record.id)}
                    disabled={deletingRechargeId === record.id}
                    className="inline-flex rounded-full p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-danger-soft)] hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  ¥{record.amount.toFixed(2)}
                </p>
                {screenshotPreview.visible ? (
                  <button
                    type="button"
                    onClick={() => setPreviewState(openStoreHistoryPreview(screenshotPreview))}
                    className="mt-4 block w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] text-left transition-transform hover:scale-[1.01]"
                  >
                    <img
                      src={screenshotPreview.src}
                      alt={screenshotPreview.alt}
                      className="max-h-56 w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <span className="block border-t border-[var(--color-border-subtle)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
                      点击图片可放大查看
                    </span>
                  </button>
                ) : null}
              </article>
            );
          })
        ) : (
          <EmptyState text="暂无充值记录" />
        )}

        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs text-[var(--color-text-muted)]">当月轨迹摘要</p>
          <p className="mt-3 text-sm font-medium text-[var(--color-text-primary)]">{summaryText}</p>
        </div>
      </div>
      <StoreHistoryPreviewDialog
        isOpen={previewState.isOpen}
        src={previewState.src}
        alt={previewState.alt}
        onClose={() => setPreviewState(closeStoreHistoryPreview())}
      />
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[var(--radius-lg)] px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-[var(--color-brand-primary)] text-white'
          : 'border border-[var(--color-border-subtle)] bg-white text-[var(--color-text-secondary)]'
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-36 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-subtle)] bg-white text-sm text-[var(--color-text-muted)]">
      {text}
    </div>
  );
}
