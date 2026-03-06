import { normalizeAfterSalesStaffName } from '../../utils/afterSalesStaff.js';

export function buildLatestFollowUpStaffMap(followUps) {
  const map = new Map();
  followUps.forEach((record) => {
    const normalizedStaffName = normalizeAfterSalesStaffName(record.staffName);
    if (!map.has(record.storeId) && normalizedStaffName) {
      map.set(record.storeId, normalizedStaffName);
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

export function filterStoresByStaff(stores, selectedStaff, latestFollowUpStaffMap) {
  if (selectedStaff === '全部') {
    return stores;
  }

  return stores.filter((store) => latestFollowUpStaffMap.get(store.id) === selectedStaff);
}
