import React from 'react';
import { Sparkles } from 'lucide-react';

import { APP_NAV_ITEMS } from './app-shell/navigation.js';
import { getSidebarMeta } from './app-shell/sidebarMeta.js';
import AppIcon from './ui/AppIcon';
import IconBadge from './ui/IconBadge';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export default function Sidebar({ currentView, onChangeView }: SidebarProps) {
  const sidebarMeta = getSidebarMeta();

  return (
    <aside className="w-full lg:w-[248px] lg:shrink-0">
      <div className="flex h-full flex-col gap-6 rounded-[var(--radius-2xl)] bg-[var(--color-bg-sidebar)] p-5 text-white shadow-[var(--shadow-elevated)] lg:min-h-screen lg:rounded-none">
        <div>
          <div className="flex items-start gap-4">
            <IconBadge tone="brand" icon={<Sparkles size={18} />} className="mt-0.5" />
            <div className="min-w-0">
              <h1 className="text-lg font-semibold tracking-[-0.02em]">{sidebarMeta.title}</h1>
              <p className="mt-1 text-xs text-[#a0b2c9]">{sidebarMeta.subtitle}</p>
            </div>
          </div>
        </div>

        <nav className="grid gap-2">
          {APP_NAV_ITEMS.map((item) => {
            const isActive = item.id === currentView;
            const isDisabled = !item.actionable;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.actionable) {
                    onChangeView(item.id as ViewState);
                  }
                }}
                disabled={isDisabled}
                className={`flex items-center gap-3 rounded-[var(--radius-lg)] px-3.5 py-3 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-brand-primary)] text-white'
                    : 'text-[#cfdbed] hover:bg-white/8'
                } ${isDisabled ? 'cursor-default opacity-85' : ''}`.trim()}
              >
                <AppIcon
                  name={item.icon as React.ComponentProps<typeof AppIcon>['name']}
                  size={18}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden flex-1 lg:block" />

        <div className="rounded-[20px] border border-white/8 bg-white/8 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
            Admin
          </p>
          <p className="mt-3 text-lg font-semibold">系统管理员</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#d6e7f8]">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
            云端同步正常
          </div>
        </div>
      </div>
    </aside>
  );
}
