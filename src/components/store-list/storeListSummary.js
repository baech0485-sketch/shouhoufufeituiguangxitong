const STATUS_ORDER = [
  ['待跟进', 'brandSoft'],
  ['已跟进', 'default'],
  ['已充值', 'successSoft'],
  ['已在推广', 'warningSoft'],
];

export function countStoresByStatus(stores = []) {
  return stores.reduce((result, store) => {
    const status = store?.status || '';
    result[status] = (result[status] || 0) + 1;
    return result;
  }, {});
}

export function buildStoreListSummaryItems({ total = 0, statusCounts = {} } = {}) {
  return [
    { label: '全部', value: total, tone: 'default' },
    ...STATUS_ORDER.map(([label, tone]) => ({
      label,
      value: statusCounts[label] || 0,
      tone,
    })),
  ];
}
