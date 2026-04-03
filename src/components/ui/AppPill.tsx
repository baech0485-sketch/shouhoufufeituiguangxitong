import React, { type PropsWithChildren } from 'react';

type AppPillProps = PropsWithChildren<{
  tone?: 'brandSoft' | 'successSoft' | 'warningSoft' | 'tealSoft' | 'dark' | 'default';
  className?: string;
}>;

const TONE_CLASS_NAMES = {
  brandSoft: 'bg-[var(--color-brand-soft)] text-[var(--color-brand-primary)]',
  successSoft: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  warningSoft: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  tealSoft: 'bg-[var(--color-teal-soft)] text-[var(--color-teal)]',
  dark: 'bg-[var(--color-brand-primary)] text-white',
  default: 'border border-[var(--color-border-subtle)] bg-white text-[var(--color-text-secondary)]',
};

export default function AppPill({
  tone = 'default',
  children,
  className = '',
}: AppPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-lg)] px-3 py-1.5 text-xs font-medium ${TONE_CLASS_NAMES[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
