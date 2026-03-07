export function getFieldContainerClassName({ hasLeadingIcon = false } = {}) {
  return [
    'group',
    'flex',
    'items-center',
    'rounded-lg',
    'border',
    'border-slate-200',
    'bg-white',
    'shadow-sm',
    'transition-all',
    'duration-200',
    'focus-within:border-indigo-500',
    'focus-within:ring-2',
    'focus-within:ring-indigo-500/20',
    hasLeadingIcon ? 'pl-4' : 'pl-0',
  ].join(' ');
}

export function getFieldControlClassName({
  hasLeadingIcon = false,
  isSelect = false,
} = {}) {
  return [
    'h-10',
    'w-full',
    'rounded-lg',
    'border-0',
    'bg-transparent',
    'px-4',
    'text-sm',
    'font-medium',
    'text-slate-900',
    'outline-none',
    'placeholder:text-slate-400',
    hasLeadingIcon ? 'pl-3' : 'pl-4',
    isSelect ? 'cursor-pointer appearance-none pr-10' : 'pr-4',
  ].join(' ');
}
