export function buildStoreExportRows({
  stores,
  latestFollowUpStaffMap,
  followUpCountMap,
  rechargeCountMap,
  totalRechargeAmountMap,
}) {
  return [
    ['店铺名称', '商家ID', '平台', '状态', '售后', '跟进次数', '充值次数', '累计充值'],
    ...stores.map((store) => [
      store.name,
      store.merchantId || '',
      store.platform,
      store.status,
      latestFollowUpStaffMap.get(store.id) || '',
      followUpCountMap.get(store.id) || 0,
      rechargeCountMap.get(store.id) || 0,
      totalRechargeAmountMap.get(store.id) || 0,
    ]),
  ];
}
