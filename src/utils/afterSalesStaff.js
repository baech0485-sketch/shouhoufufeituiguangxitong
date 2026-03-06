export const DEFAULT_AFTER_SALES_STAFF = ['朱雯雯', '测试1', '测试2'];

export function normalizeAfterSalesStaffName(name) {
  const staffName = String(name || '').trim();

  if (!staffName) {
    return '';
  }

  if (staffName === '测试') {
    return '测试1';
  }

  return staffName;
}

export function buildAfterSalesStaffOptions(staffNames = []) {
  const uniqueStaffNames = new Set();

  DEFAULT_AFTER_SALES_STAFF.forEach((staffName) => {
    uniqueStaffNames.add(normalizeAfterSalesStaffName(staffName));
  });

  staffNames.forEach((staffName) => {
    const normalizedStaffName = normalizeAfterSalesStaffName(staffName);
    if (normalizedStaffName) {
      uniqueStaffNames.add(normalizedStaffName);
    }
  });

  return Array.from(uniqueStaffNames).sort((left, right) => left.localeCompare(right, 'zh-CN'));
}
