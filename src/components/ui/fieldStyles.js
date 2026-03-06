export function getFieldContainerClassName({ hasLeadingIcon = false } = {}) {
  return [
    'group',
    'flex',
    'items-center',
    'rounded-2xl',
    'border',
    'border-slate-200',
    'bg-white/95',
    'shadow-sm',
    'shadow-slate-200/70',
    'transition-all',
    'duration-200',
    'focus-within:border-indigo-400',
    'focus-within:ring-2',
    'focus-within:ring-indigo-500/15',
    hasLeadingIcon ? 'pl-4' : 'pl-0',
  ].join(' ');
}

export function getFieldControlClassName({
  hasLeadingIcon = false,
  isSelect = false,
} = {}) {
  return [
    'min-h-12',
    'w-full',
    'rounded-2xl',
    'border-0',
    'bg-transparent',
    'px-4',
    'py-3',
    'text-sm',
    'font-medium',
    'text-slate-900',
    'outline-none',
    'placeholder:text-slate-400',
    hasLeadingIcon ? 'pl-3' : 'pl-4',
    isSelect ? 'cursor-pointer appearance-none pr-10' : 'pr-4',
  ].join(' ');
}
