import React, {
  type ButtonHTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

type AppButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
}
>;

const VARIANT_CLASS_NAMES = {
  primary:
    'border-transparent bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-strong)]',
  secondary:
    'border-[var(--color-border-subtle)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]',
  ghost:
    'border-transparent bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand-primary)]',
};

export default function AppButton({
  variant = 'primary',
  icon,
  children,
  className = '',
  type = 'button',
  ...props
}: AppButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-lg)] border px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASS_NAMES[variant]} ${className}`.trim()}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
