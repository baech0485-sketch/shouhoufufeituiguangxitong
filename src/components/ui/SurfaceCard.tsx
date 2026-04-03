import React from 'react';

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SurfaceCard({
  children,
  className = '',
}: SurfaceCardProps) {
  return (
    <section
      className={`rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white shadow-[var(--shadow-card)] ${className}`.trim()}
    >
      {children}
    </section>
  );
}
