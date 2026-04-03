import React from 'react';

import AppPill from '../ui/AppPill';
import IconBadge from '../ui/IconBadge';
import SurfaceCard from '../ui/SurfaceCard';

interface DashboardStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  detail: string;
  tone?: 'brand' | 'teal' | 'success' | 'warning';
  detailTone?: 'brandSoft' | 'successSoft' | 'warningSoft' | 'default';
}

export default function DashboardStatCard({
  icon,
  title,
  value,
  detail,
  tone = 'brand',
  detailTone = 'brandSoft',
}: DashboardStatCardProps) {
  return (
    <SurfaceCard className="p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <IconBadge tone={tone} icon={icon} />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">{title}</p>
            <p className="mt-2 text-[32px] font-bold leading-none tracking-[-0.03em] text-[var(--color-text-primary)]">
              {value}
            </p>
          </div>
        </div>
        <AppPill tone={detailTone}>{detail}</AppPill>
      </div>
    </SurfaceCard>
  );
}
