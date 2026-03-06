export function getDashboardPlatform(platform) {
  const platformText = String(platform || '').trim();

  if (platformText.includes('美团')) {
    return 'meituan';
  }

  if (platformText.includes('饿了么')) {
    return 'eleme';
  }

  return 'other';
}

export function buildStorePlatformMap(stores) {
  return new Map(stores.map((store) => [store.id, store.platform]));
}

export function filterRecordsByDashboardPlatform(records, selectedPlatform, storePlatformMap) {
  if (selectedPlatform === 'all') {
    return records;
  }

  return records.filter((record) => {
    const storePlatform = storePlatformMap.get(record.storeId);
    return getDashboardPlatform(storePlatform) === selectedPlatform;
  });
}
