export function parseOrderConversionRate30d(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const numericValue =
    typeof value === 'number' ? value : Number.parseFloat(String(value).trim());

  if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 100) {
    return null;
  }

  return Number(numericValue.toFixed(2));
}

export function getPromotionDecision(orderConversionRate30d) {
  if (orderConversionRate30d === null || orderConversionRate30d === undefined) {
    return 'unknown';
  }

  if (orderConversionRate30d > 14) {
    return 'promotable';
  }

  if (orderConversionRate30d < 10) {
    return 'not_promotable';
  }

  return 'pending';
}

export function getPromotionDecisionLabel(orderConversionRate30d) {
  const decision = getPromotionDecision(orderConversionRate30d);

  if (decision === 'promotable') {
    return '可做推广';
  }

  if (decision === 'not_promotable') {
    return '不可做推广';
  }

  if (decision === 'pending') {
    return '待观察';
  }

  return '-';
}
