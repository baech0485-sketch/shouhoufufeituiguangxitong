import React, { useEffect, useMemo, useRef, useState } from 'react';
import AppIcon from './AppIcon';
import { getFieldContainerClassName, getFieldControlClassName } from './fieldStyles.js';
import { resolveSelectedOption } from './selectFieldState.js';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  value: string;
  label?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  leadingIcon?: React.ReactNode;
  selectClassName?: string;
  containerClassName?: string;
}

export default function SelectField({
  value,
  label = '',
  options,
  onChange,
  leadingIcon,
  selectClassName = '',
  containerClassName = '',
}: SelectFieldProps) {
  const hasLeadingIcon = Boolean(leadingIcon);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = useMemo(
    () => resolveSelectedOption(options, value),
    [options, value],
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <label className={`block ${containerClassName}`.trim()}>
      {label ? (
        <span className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </span>
      ) : null}
      <div
        ref={containerRef}
        className={`${getFieldContainerClassName({ hasLeadingIcon })} relative`}
      >
        {hasLeadingIcon && (
          <div className="flex shrink-0 items-center text-[var(--color-brand-primary)]">
            {leadingIcon}
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`${getFieldControlClassName({ hasLeadingIcon, isSelect: true })} flex items-center justify-between text-left ${selectClassName}`.trim()}
        >
          <span className="truncate">{selectedOption.label}</span>
          <span
            className={`ml-3 shrink-0 text-[var(--color-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <AppIcon name="chevron" size={18} />
          </span>
        </button>
        {isOpen ? (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-2 shadow-[var(--shadow-elevated)]">
            <div className="max-h-64 overflow-y-auto">
              {options.map((option) => {
                const isSelected = option.value === selectedOption.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-[var(--radius-lg)] px-3 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-[var(--color-brand-soft)] font-medium text-[var(--color-brand-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-canvas)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected ? (
                      <span className="text-[var(--color-brand-primary)]">
                        <AppIcon name="check" size={16} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </label>
  );
}
