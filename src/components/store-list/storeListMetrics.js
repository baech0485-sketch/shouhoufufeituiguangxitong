import { normalizeAfterSalesStaffName } from '../../utils/afterSalesStaff.js';
import { getPromotionDecisionLabel } from '../../utils/promotionEligibility.js';

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

export function buildLatestPromotionStatusMap(followUps) {
  const map = new Map();

  followUps.forEach((record) => {
    if (map.has(record.storeId)) {
      return;
    }

    const orderConversionRate30d =
      record.orderConversionRate30d === null || record.orderConversionRate30d === undefined
        ? null
        : Number(record.orderConversionRate30d);

    map.set(record.storeId, {
      orderConversionRate30d,
      promotionDecisionLabel: getPromotionDecisionLabel(orderConversionRate30d),
    });
  });

  return map;
}
