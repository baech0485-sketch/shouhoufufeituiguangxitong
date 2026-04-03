export function buildDashboardReportRows({
  selectedMonth,
  monthlyFollowedStoresCount,
  monthlyRechargeAmount,
  monthlyRechargedStoresCount,
  monthlyConversionRate,
  staffPerformance,
}) {
  return [
    ['指标', '值'],
    ['统计月份', selectedMonth || '当前月份'],
    ['跟进门店数', monthlyFollowedStoresCount],
    ['充值金额', monthlyRechargeAmount],
    ['已充值门店', monthlyRechargedStoresCount],
    ['充值转化率', `${monthlyConversionRate}%`],
    [],
    ['售后人员', '跟进店铺数', '可做推广店铺数', '已充值店铺数', '充值转化率', '充值业绩'],
    ...staffPerformance.map((item) => [
      item.name,
      item.followedStores,
      item.promotableStores,
      item.rechargedStores,
      `${item.conversionRate.toFixed(1)}%`,
      item.amount,
    ]),
  ];
}

export function buildDashboardHighlights({
  monthlyFollowUps,
  monthlyRecharges,
  monthlyFollowedStoresCount,
  monthlyRechargedStoresCount,
}) {
  return {
    promotableStoreCount: new Set(
      monthlyFollowUps
        .filter((item) => item.orderConversionRate30d !== null && item.orderConversionRate30d > 14)
        .map((item) => item.storeId),
    ).size,
    pendingScreenshotCount: [...monthlyFollowUps, ...monthlyRecharges].filter(
      (item) => !item.screenshotUrl,
    ).length,
    pendingFollowUpCount: Math.max(
      monthlyFollowedStoresCount - monthlyRechargedStoresCount,
      0,
    ),
  };
}
