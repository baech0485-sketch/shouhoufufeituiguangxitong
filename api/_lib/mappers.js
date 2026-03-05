export function mapStore(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    platform: doc.platform,
    openDate: doc.openDate,
    status: doc.status,
  };
}

export function mapFollowUp(doc) {
  return {
    id: doc._id.toString(),
    storeId: doc.storeId,
    date: doc.date,
    communicationType: doc.communicationType,
    intention: doc.intention,
    notes: doc.notes || '',
    staffName: doc.staffName,
  };
}

export function mapRecharge(doc) {
  return {
    id: doc._id.toString(),
    storeId: doc.storeId,
    amount: Number(doc.amount),
    date: doc.date,
    screenshotUrl: doc.screenshotUrl || '',
    staffName: doc.staffName,
  };
}
