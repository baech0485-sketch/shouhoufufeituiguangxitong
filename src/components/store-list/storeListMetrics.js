export function buildLatestFollowUpStaffMap(followUps) {
  const map = new Map();
  followUps.forEach((record) => {
    if (!map.has(record.storeId) && record.staffName) {
      map.set(record.storeId, record.staffName);
    }
  });
  return map;
}

export function buildRecordCountMap(records) {
  const map = new Map();
  records.forEach((record) => {
    const currentCount = map.get(record.storeId) || 0;
    map.set(record.storeId, currentCount + 1);
  });
  return map;
}
