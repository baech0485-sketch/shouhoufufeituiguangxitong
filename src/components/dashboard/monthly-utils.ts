import type { FollowUp, Recharge } from '../../types.ts';
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
  promotableStores: number;
  conversionRate: number;
}

interface DatedRecord {
  date: string;
}

export function getMonthKey(dateText: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateText) ? dateText.slice(0, 7) : '';
}

function parseMonthIndex(monthKey: string) {
  if (!/^\d{4}-\d{2}$/.test(monthKey)) {
    return null;
  }

  const [yearText, monthText] = monthKey.split('-');
  const year = Number.parseInt(yearText, 10);
  const month = Number.parseInt(monthText, 10);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null;
  }

  return year * 12 + (month - 1);
}

function formatMonthIndex(monthIndex: number) {
  const year = Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function getCurrentMonthKey(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getAvailableMonths(records: DatedRecord[], now = new Date()) {
  const monthIndexes = new Set<number>();

  records.forEach((item) => {
    const monthIndex = parseMonthIndex(getMonthKey(item.date));
    if (monthIndex !== null) {
      monthIndexes.add(monthIndex);
    }
  });

  const currentMonthIndex = parseMonthIndex(getCurrentMonthKey(now));
  if (currentMonthIndex !== null) {
    monthIndexes.add(currentMonthIndex);
  }

  if (monthIndexes.size === 0) {
    return [];
  }

  const sortedMonthIndexes = Array.from(monthIndexes).sort((left, right) => left - right);
  const startMonthIndex = sortedMonthIndexes[0];
  const endMonthIndex = sortedMonthIndexes[sortedMonthIndexes.length - 1];
  const months = [];

  for (let monthIndex = endMonthIndex; monthIndex >= startMonthIndex; monthIndex -= 1) {
    months.push(formatMonthIndex(monthIndex));
  }

  return months;
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
      promotableStoreIds: Set<string>;
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
        promotableStoreIds: new Set<string>(),
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
        promotableStoreIds: new Set<string>(),
      };
    }
    data[staffName].followedStoreIds.add(item.storeId);
    if (
      item.orderConversionRate30d !== null
      && item.orderConversionRate30d !== undefined
      && Number(item.orderConversionRate30d) > 14
    ) {
      data[staffName].promotableStoreIds.add(item.storeId);
    }
  });

  return Object.values(data)
    .map((item) => {
      const followedStores = item.followedStoreIds.size;
      const rechargedStores = item.rechargedStoreIds.size;
      const promotableStores = item.promotableStoreIds.size;
      const conversionRate =
        followedStores > 0 ? Number(((rechargedStores / followedStores) * 100).toFixed(1)) : 0;
      return {
        name: item.name,
        amount: item.amount,
        followedStores,
        rechargedStores,
        promotableStores,
        conversionRate,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}
