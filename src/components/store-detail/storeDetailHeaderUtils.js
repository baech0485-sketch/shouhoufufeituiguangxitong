export function getStoreIdentityCopyTargets(store) {
  const targets = [
    {
      key: 'name',
      label: store.name,
      value: store.name,
      copiedLabel: '店铺名',
    },
  ];

  if (store.merchantId) {
    targets.push({
      key: 'merchantId',
      label: `商家ID：${store.merchantId}`,
      value: store.merchantId,
      copiedLabel: '商家ID',
    });
  }

  return targets;
}

export async function copyText(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
