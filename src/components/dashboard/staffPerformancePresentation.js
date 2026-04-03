export function getStaffPerformanceCardPresentation({
  index = 0,
  amount = 0,
  maxAmount = 0,
} = {}) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const safeMaxAmount = Number.isFinite(maxAmount) ? maxAmount : 0;
  const ratio = safeMaxAmount > 0 ? safeAmount / safeMaxAmount : 0;
  const clampedRatio = Math.min(1, Math.max(0, ratio));

  return {
    isTopPerformer: index === 0,
    containerTone: index === 0 ? 'top' : 'default',
    amountTone: index === 0 ? 'brand' : 'default',
    progressWidth: `${Math.round(clampedRatio * 100)}%`,
  };
}
