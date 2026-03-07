export function buildRechargePayload({
  storeId,
  amount,
  date,
  screenshotUrl,
  staffName,
}) {
  return {
    storeId,
    amount: Number(amount),
    date,
    screenshotUrl,
    staffName,
  };
}
