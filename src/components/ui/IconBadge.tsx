import React from 'react';

interface IconBadgeProps {
  tone?: 'brand' | 'teal' | 'success' | 'warning' | 'surface';
  icon: React.ReactNode;
  className?: string;
}

const TONE_CLASS_NAMES = {
  brand: 'bg-[var(--color-brand-primary)] text-white',
  teal: 'bg-[var(--color-teal)] text-white',
  success: 'bg-[var(--color-success)] text-white',
  warning: 'bg-[var(--color-warning)] text-white',
  surface: 'bg-[var(--color-brand-soft)] text-[var(--color-brand-primary)]',
};

export default function IconBadge({
  tone = 'brand',
  icon,
  className = '',
}: IconBadgeProps) {
  return (
    <span
      className={`inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] ${TONE_CLASS_NAMES[tone]} ${className}`.trim()}
    >
      {icon}
    </span>
  );
}
