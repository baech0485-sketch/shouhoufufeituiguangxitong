import { ObjectId } from 'mongodb';

export function deriveStoreStatus(hasRecharge, hasFollowUp) {
  if (hasRecharge) {
    return '已充值';
  }
  if (hasFollowUp) {
    return '已跟进';
  }
  return '待跟进';
}

export async function recalculateStoreStatus(db, storeId, now = new Date()) {
  if (!ObjectId.isValid(storeId)) {
    return null;
  }

  const storeObjectId = new ObjectId(storeId);
  const [rechargeRecord, followUpRecord] = await Promise.all([
    db.collection('recharges').findOne({ storeId }, { projection: { _id: 1 } }),
    db.collection('followups').findOne({ storeId }, { projection: { _id: 1 } }),
  ]);

  const status = deriveStoreStatus(Boolean(rechargeRecord), Boolean(followUpRecord));
  await db.collection('stores').updateOne(
    { _id: storeObjectId },
    { $set: { status, updatedAt: now } },
  );

  return status;
}
