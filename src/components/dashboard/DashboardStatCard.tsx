import React from 'react';

interface DashboardStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  iconClassName: string;
  cardClassName: string;
}

export default function DashboardStatCard({
  icon,
  title,
  value,
  iconClassName,
  cardClassName,
}: DashboardStatCardProps) {
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br to-white p-6 shadow-sm transition-shadow hover:shadow-md ${cardClassName}`}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white shadow-lg ${iconClassName}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
