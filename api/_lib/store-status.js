import { ObjectId } from 'mongodb';

export const MANUAL_PROMOTING_STATUS = '已在推广';

export function deriveStoreStatus(hasRecharge, hasFollowUp) {
  if (hasRecharge) {
    return '已充值';
  }
  if (hasFollowUp) {
    return '已跟进';
  }
  return '待跟进';
}

export function resolveStoreStatus({
  currentStatus = '',
  statusSource = 'derived',
  hasRecharge = false,
  hasFollowUp = false,
}) {
  if (currentStatus === MANUAL_PROMOTING_STATUS && statusSource === 'manual') {
    return {
      status: MANUAL_PROMOTING_STATUS,
      statusSource: 'manual',
    };
  }

  return {
    status: deriveStoreStatus(hasRecharge, hasFollowUp),
    statusSource: 'derived',
  };
}

export async function recalculateStoreStatus(db, storeId, now = new Date()) {
  if (!ObjectId.isValid(storeId)) {
    return null;
  }

  const storeObjectId = new ObjectId(storeId);
  const [store, rechargeRecord, followUpRecord] = await Promise.all([
    db.collection('stores').findOne({ _id: storeObjectId }, { projection: { status: 1, statusSource: 1 } }),
    db.collection('recharges').findOne({ storeId }, { projection: { _id: 1 } }),
    db.collection('followups').findOne({ storeId }, { projection: { _id: 1 } }),
  ]);

  if (!store) {
    return null;
  }

  const nextStatus = resolveStoreStatus({
    currentStatus: store.status,
    statusSource: store.statusSource || 'derived',
    hasRecharge: Boolean(rechargeRecord),
    hasFollowUp: Boolean(followUpRecord),
  });

  await db.collection('stores').updateOne(
    { _id: storeObjectId },
    {
      $set: {
        status: nextStatus.status,
        statusSource: nextStatus.statusSource,
        updatedAt: now,
      },
    },
  );

  return nextStatus.status;
}
