export function getRechargeScreenshotPreview(record) {
  const screenshotUrl =
    typeof record?.screenshotUrl === 'string' ? record.screenshotUrl.trim() : '';

  if (!screenshotUrl) {
    return {
      visible: false,
      src: '',
      alt: '',
    };
  }

  const amountText = Number.isFinite(Number(record?.amount))
    ? `¥${Number(record.amount)}`
    : '未知金额';
  const dateText = typeof record?.date === 'string' && record.date.trim()
    ? record.date.trim()
    : '未知日期';

  return {
    visible: true,
    src: screenshotUrl,
    alt: `充值截图（${dateText}，${amountText}）`,
  };
}
