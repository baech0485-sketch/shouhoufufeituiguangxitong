import { FollowUp, Recharge } from '../../types';

export interface DailyTrendItem {
  day: string;
  amount: number;
  count: number;
}

export interface StaffPerformanceItem {
  name: string;
  amount: number;
  followUps: number;
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
  const data: Record<string, StaffPerformanceItem> = {};

  monthlyRecharges.forEach((item) => {
    if (!data[item.staffName]) {
      data[item.staffName] = { name: item.staffName, amount: 0, followUps: 0 };
    }
    data[item.staffName].amount += item.amount;
  });

  monthlyFollowUps.forEach((item) => {
    if (!data[item.staffName]) {
      data[item.staffName] = { name: item.staffName, amount: 0, followUps: 0 };
    }
    data[item.staffName].followUps += 1;
  });

  return Object.values(data).sort((a, b) => b.amount - a.amount);
}
