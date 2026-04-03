import React from 'react';
import { getFieldContainerClassName, getFieldControlClassName } from './fieldStyles.js';

interface TextFieldProps {
  value: string;
  label?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  leadingIcon?: React.ReactNode;
  inputClassName?: string;
  containerClassName?: string;
}

export default function TextField({
  value,
  label = '',
  placeholder = '',
  onChange,
  leadingIcon,
  inputClassName = '',
  containerClassName = '',
}: TextFieldProps) {
  const hasLeadingIcon = Boolean(leadingIcon);

  return (
    <label className={`block ${containerClassName}`.trim()}>
      {label ? (
        <span className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </span>
      ) : null}
      <div className={getFieldContainerClassName({ hasLeadingIcon })}>
        {hasLeadingIcon && (
          <div className="flex shrink-0 items-center text-[var(--color-brand-primary)]">
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
    </label>
  );
}
