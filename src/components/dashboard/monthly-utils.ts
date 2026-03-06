import { FollowUp, Recharge } from '../../types';
import { normalizeAfterSalesStaffName } from '../../utils/afterSalesStaff.js';

export interface DailyTrendItem {
  day: string;
  amount: number;
  count: number;
}

export interface StaffPerformanceItem {
  name: string;
  amount: number;
  followedStores: number;
  rechargedStores: number;
  conversionRate: number;
}

export function getMonthKey(dateText: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateText) ? dateText.slice(0, 7) : '';
}

export function getAvailableMonths(recharges: Recharge[]) {
  const months = new Set<string>();
  recharges.forEach((item) => {
    const month = getMonthKey(item.date);
    if (month) {
      months.add(month);
    }
  });
  return Array.from(months).sort((a, b) => b.localeCompare(a));
}

export function buildDailyTrendData(recharges: Recharge[], monthKey: string): DailyTrendItem[] {
  if (!/^\d{4}-\d{2}$/.test(monthKey)) {
    return [];
  }

  const [yearText, monthText] = monthKey.split('-');
  const year = Number.parseInt(yearText, 10);
  const month = Number.parseInt(monthText, 10);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return [];
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const data = Array.from({ length: daysInMonth }, (_, index) => ({
    day: `${String(index + 1).padStart(2, '0')}日`,
    amount: 0,
    count: 0,
  }));

  recharges.forEach((item) => {
    if (getMonthKey(item.date) !== monthKey) {
      return;
    }
    const day = Number.parseInt(item.date.slice(8, 10), 10);
    if (!Number.isFinite(day) || day < 1 || day > daysInMonth) {
      return;
    }
    data[day - 1].amount += item.amount;
    data[day - 1].count += 1;
  });

  return data;
}

export function buildStaffPerformance(
  monthlyRecharges: Recharge[],
  monthlyFollowUps: FollowUp[],
): StaffPerformanceItem[] {
  const data: Record<
    string,
    {
      name: string;
      amount: number;
      followedStoreIds: Set<string>;
      rechargedStoreIds: Set<string>;
    }
  > = {};

  monthlyRecharges.forEach((item) => {
    const staffName = normalizeAfterSalesStaffName(item.staffName);
    if (!staffName) {
      return;
    }

    if (!data[staffName]) {
      data[staffName] = {
        name: staffName,
        amount: 0,
        followedStoreIds: new Set<string>(),
        rechargedStoreIds: new Set<string>(),
      };
    }
    data[staffName].amount += item.amount;
    data[staffName].rechargedStoreIds.add(item.storeId);
  });

  monthlyFollowUps.forEach((item) => {
    const staffName = normalizeAfterSalesStaffName(item.staffName);
    if (!staffName) {
      return;
    }

    if (!data[staffName]) {
      data[staffName] = {
        name: staffName,
        amount: 0,
        followedStoreIds: new Set<string>(),
        rechargedStoreIds: new Set<string>(),
      };
    }
    data[staffName].followedStoreIds.add(item.storeId);
  });

  return Object.values(data)
    .map((item) => {
      const followedStores = item.followedStoreIds.size;
      const rechargedStores = item.rechargedStoreIds.size;
      const conversionRate =
        followedStores > 0 ? Number(((rechargedStores / followedStores) * 100).toFixed(1)) : 0;
      return {
        name: item.name,
        amount: item.amount,
        followedStores,
        rechargedStores,
        conversionRate,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}
