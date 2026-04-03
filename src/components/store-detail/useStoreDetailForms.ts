import { type FormEvent, useEffect, useState } from 'react';

import { FollowUp, Recharge, CommunicationType, Intention } from '../../types';
import { buildRechargePayload } from '../../utils/rechargeSubmission.js';
import { useImageUploadField } from './useImageUploadField';

interface UseStoreDetailFormsOptions {
  storeId: string;
  staffOptions: string[];
  onAddFollowUp: (followUp: Omit<FollowUp, 'id'>) => void;
  onAddRecharge: (recharge: Omit<Recharge, 'id'>) => void;
  onDeleteFollowUp: (followUpId: string) => Promise<void>;
  onDeleteRecharge: (rechargeId: string) => Promise<void>;
}

export function useStoreDetailForms({
  storeId,
  staffOptions,
  onAddFollowUp,
  onAddRecharge,
  onDeleteFollowUp,
  onDeleteRecharge,
}: UseStoreDetailFormsOptions) {
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

  const handleAddFollowUp = (event: FormEvent) => {
    event.preventDefault();
    if (!staffName || followUpScreenshot.screenshotError) {
      return;
    }
    onAddFollowUp({
      storeId,
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

  const handleAddRecharge = (event: FormEvent) => {
    event.preventDefault();
    if (!amount || !rechargeStaff || rechargeScreenshot.screenshotError) {
      return;
    }
    onAddRecharge(
      buildRechargePayload({
        storeId,
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
    if (!window.confirm('确认删除这条跟进记录吗？删除后无法恢复。')) {
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
    if (!window.confirm('确认删除这条充值记录吗？删除后无法恢复。')) {
      return;
    }
    setDeletingRechargeId(rechargeId);
    try {
      await onDeleteRecharge(rechargeId);
    } finally {
      setDeletingRechargeId('');
    }
  };

  return {
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
  };
}
