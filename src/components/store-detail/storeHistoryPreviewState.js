export function openStoreHistoryPreview(preview) {
  if (!preview?.visible || !preview.src) {
    return closeStoreHistoryPreview();
  }

  return {
    isOpen: true,
    src: preview.src,
    alt: preview.alt || '',
  };
}

export function closeStoreHistoryPreview() {
  return {
    isOpen: false,
    src: '',
    alt: '',
  };
}
