export function getStoreListResetButtonClassName() {
  return [
    'justify-self-start',
    'w-fit',
    'h-12',
    'rounded-[var(--radius-lg)]',
    'border',
    'border-[var(--color-border-subtle)]',
    'bg-white',
    'px-5',
    'text-sm',
    'font-semibold',
    'text-[var(--color-text-primary)]',
    'transition-colors',
    'hover:border-[var(--color-brand-primary)]',
    'hover:text-[var(--color-brand-primary)]',
  ].join(' ');
}
