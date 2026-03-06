import React from 'react';
import { getFieldContainerClassName, getFieldControlClassName } from './fieldStyles.js';

interface TextFieldProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  leadingIcon?: React.ReactNode;
  inputClassName?: string;
  containerClassName?: string;
}

export default function TextField({
  value,
  placeholder = '',
  onChange,
  leadingIcon,
  inputClassName = '',
  containerClassName = '',
}: TextFieldProps) {
  const hasLeadingIcon = Boolean(leadingIcon);

  return (
    <div className={`${getFieldContainerClassName({ hasLeadingIcon })} ${containerClassName}`.trim()}>
      {hasLeadingIcon && (
        <div className="flex shrink-0 items-center text-slate-400 transition-colors group-focus-within:text-indigo-500">
          {leadingIcon}
        </div>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${getFieldControlClassName({ hasLeadingIcon })} ${inputClassName}`.trim()}
      />
    </div>
  );
}
