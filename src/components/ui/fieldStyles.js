export function getFieldContainerClassName({ hasLeadingIcon = false } = {}) {
  return [
    'group',
    'flex',
    'items-center',
    'h-12',
    'rounded-[var(--radius-lg)]',
    'border',
    'border-[var(--color-border-subtle)]',
    'bg-[var(--color-bg-canvas)]',
    'transition-all',
    'duration-200',
    'focus-within:border-[var(--color-brand-primary)]',
    'focus-within:ring-2',
    'focus-within:ring-[color:var(--color-brand-ring)]',
    hasLeadingIcon ? 'pl-4' : 'pl-0',
  ].join(' ');
}

export function getFieldControlClassName({
  hasLeadingIcon = false,
  isSelect = false,
} = {}) {
  return [
    'w-full',
    'rounded-[var(--radius-lg)]',
    'border-0',
    'bg-transparent',
    'px-4',
    'text-sm',
    'font-medium',
    'text-[var(--color-text-primary)]',
    'outline-none',
    'placeholder:text-[var(--color-text-muted)]',
    hasLeadingIcon ? 'pl-3' : 'pl-4',
    isSelect ? 'cursor-pointer appearance-none pr-10' : 'pr-4',
  ].join(' ');
}
