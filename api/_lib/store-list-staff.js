import { normalizeAfterSalesStaffName } from '../../src/utils/afterSalesStaff.js';

export function buildLatestStoreIdsByStaff(followUps, targetStaff) {
  const normalizedTargetStaff = normalizeAfterSalesStaffName(targetStaff);
  const latestStaffByStore = new Map();

  followUps.forEach((record) => {
    if (!record.storeId || latestStaffByStore.has(record.storeId)) {
      return;
    }

    latestStaffByStore.set(
      record.storeId,
      normalizeAfterSalesStaffName(record.staffName),
    );
  });

  return Array.from(latestStaffByStore.entries())
    .filter(([, staffName]) => staffName === normalizedTargetStaff)
    .map(([storeId]) => storeId);
}
