export function getStoreDetailModalContainerClassName() {
  return [
    'flex',
    'max-h-[92vh]',
    'w-full',
    'max-w-[1080px]',
    'flex-col',
    'overflow-hidden',
    'rounded-[var(--radius-2xl)]',
    'bg-white',
    'shadow-[var(--shadow-modal)]',
  ].join(' ');
}

export function getStoreDetailModalPaneClassNames() {
  return {
    historyPane: 'flex w-[38%] flex-col overflow-hidden',
    formPane: 'flex w-[62%] flex-col bg-white',
  };
}
