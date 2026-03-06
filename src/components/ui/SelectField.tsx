import React from 'react';
import { ChevronDown } from 'lucide-react';
import { getFieldContainerClassName, getFieldControlClassName } from './fieldStyles.js';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  leadingIcon?: React.ReactNode;
  selectClassName?: string;
  containerClassName?: string;
}

export default function SelectField({
  value,
  options,
  onChange,
  leadingIcon,
  selectClassName = '',
  containerClassName = '',
}: SelectFieldProps) {
  const hasLeadingIcon = Boolean(leadingIcon);

  return (
    <div className={`${getFieldContainerClassName({ hasLeadingIcon })} relative ${containerClassName}`.trim()}>
      {hasLeadingIcon && (
        <div className="flex shrink-0 items-center text-slate-400 transition-colors group-focus-within:text-indigo-500">
          {leadingIcon}
        </div>
      )}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${getFieldControlClassName({ hasLeadingIcon, isSelect: true })} ${selectClassName}`.trim()}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
      />
    </div>
  );
}
