export function getStoreDetailModalContainerClassName() {
  return [
    'flex',
    'max-h-[90vh]',
    'w-full',
    'max-w-[1400px]',
    'flex-col',
    'overflow-hidden',
    'rounded-2xl',
    'bg-white',
    'shadow-xl',
    'animate-in',
    'fade-in',
    'zoom-in-95',
    'duration-200',
  ].join(' ');
}

export function getStoreDetailModalPaneClassNames() {
  return {
    historyPane: 'flex w-[56%] flex-col overflow-hidden',
    formPane: 'flex w-[44%] flex-col bg-white',
  };
}
