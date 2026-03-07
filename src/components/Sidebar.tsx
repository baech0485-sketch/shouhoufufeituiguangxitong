import React from 'react';
import { LayoutDashboard, List, User } from 'lucide-react';
import { ViewState } from '../types';
import { getContentContainerClassName } from '../layout/contentWidth.js';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export default function Sidebar({ currentView, onChangeView }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as ViewState, label: '数据看板', icon: LayoutDashboard },
    { id: 'list' as ViewState, label: '店铺列表', icon: List },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-sm">
      <div
        className={`${getContentContainerClassName(currentView)} flex flex-col gap-4 px-6 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
          <div className="min-w-0 shrink-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">呈尚策划售后系统</h1>
            <p className="mt-1 text-xs font-medium text-slate-500">美团外卖 & 淘宝闪购</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 shadow-inner shadow-slate-100/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="inline-flex items-center gap-3 self-start rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-2.5 shadow-sm lg:self-auto">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ring-1 ring-indigo-200/80">
            <User size={16} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Admin</p>
            <p className="text-sm font-semibold text-slate-700">系统管理员</p>
          </div>
        </div>
      </div>
    </header>
  );
}
