import React from 'react';
import { LayoutDashboard, Store as StoreIcon, List } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export default function Sidebar({ currentView, onChangeView }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as ViewState, label: '数据看板', icon: LayoutDashboard },
    { id: 'entry' as ViewState, label: '店铺录入', icon: StoreIcon },
    { id: 'list' as ViewState, label: '店铺查询与跟进', icon: List },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-indigo-400">运营数据系统</h1>
        <p className="text-xs text-slate-400 mt-1">美团外卖 & 淘宝闪购</p>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <span className="text-sm font-medium text-slate-300">AD</span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-200">系统管理员</p>
          </div>
        </div>
      </div>
    </div>
  );
}
