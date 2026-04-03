/**
 * @typedef {'brandSoft' | 'successSoft' | 'warningSoft' | 'tealSoft' | 'default'} SoftTone
 */

/**
 * @param {string} status
 * @returns {{ tone: SoftTone, label: string }}
 */
export function getStoreStatusAppearance(status) {
  if (status === '待跟进') {
    return { tone: 'brandSoft', label: status };
  }
  if (status === '已充值') {
    return { tone: 'successSoft', label: status };
  }
  if (status === '已在推广') {
    return { tone: 'warningSoft', label: status };
  }
  return { tone: 'default', label: status || '-' };
}

/**
 * @param {string} label
 * @returns {{ tone: SoftTone, label: string }}
 */
export function getPromotionAppearance(label) {
  if (label === '可做推广' || label === '可追加' || label === '已成交') {
    return { tone: 'successSoft', label };
  }
  if (label === '持续投放' || label === '不可做推广') {
    return { tone: 'warningSoft', label };
  }
  return { tone: 'default', label: label || '-' };
}

/**
 * @param {string} platform
 * @returns {{ tone: SoftTone, label: string }}
 */
export function getPlatformAppearance(platform) {
  if (platform === '饿了么餐饮') {
    return { tone: 'tealSoft', label: platform };
  }
  if (platform === '淘宝闪购') {
    return { tone: 'brandSoft', label: platform };
  }
  return { tone: 'brandSoft', label: platform };
}
