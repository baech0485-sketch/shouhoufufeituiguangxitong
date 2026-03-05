import React from 'react';
import { LayoutDashboard, List, User } from 'lucide-react';
import { ViewState } from '../types';

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
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div>
              <h1 className="text-xl font-bold text-slate-900">售后付费推广系统</h1>
              <p className="text-xs text-slate-500 mt-0.5">美团外卖 & 淘宝闪购</p>
            </div>
            <nav className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChangeView(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <User size={16} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">系统管理员</span>
          </div>
        </div>
      </div>
    </header>
  );
}
