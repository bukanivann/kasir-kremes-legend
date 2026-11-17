import React from 'react';
import {
  ShoppingBag,
  Receipt,
  Package,
  BarChart3,
  Settings,
} from 'lucide-react';
import { StoreSettings, TabType } from '../types/pos';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  settings: StoreSettings;
  transactionsCount: number;
  lowStockCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  transactionsCount,
  lowStockCount,
}) => {
  const navItems: {
    id: TabType;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'pos',
      label: 'Kasir',
      shortLabel: 'Kasir',
      icon: ShoppingBag,
    },
    {
      id: 'receipts',
      label: 'Riwayat Struk',
      shortLabel: 'Struk',
      icon: Receipt,
      badge: transactionsCount > 0 ? transactionsCount : undefined,
      badgeColor: 'bg-emerald-800 text-emerald-100',
    },
    {
      id: 'items',
      label: 'Barang & Stok',
      shortLabel: 'Barang',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-400 text-slate-900 font-bold',
    },
    {
      id: 'reports',
      label: 'Laporan Analitik',
      shortLabel: 'Laporan',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Pengaturan Toko',
      shortLabel: 'Toko',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* TOP BAR UNTUK HP (ANDROID & IPHONE < md) */}
      <header className="md:hidden bg-emerald-700 text-white px-4 py-2.5 pt-safe flex items-center justify-between shrink-0 shadow-md z-20 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white text-emerald-700 flex items-center justify-center font-black text-base shadow-sm shrink-0">
            K
          </div>
          <h1 className="font-bold text-base tracking-tight">Kremes Legend</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-800/70 px-2.5 py-1 rounded-full text-[11px] text-emerald-100 max-w-[160px]">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse shrink-0" />
          <span className="truncate font-medium">{settings.cashierName}</span>
        </div>
      </header>

      {/* SIDEBAR UNTUK TABLET (md) & LAPTOP/DESKTOP (lg+) */}
      <aside className="hidden md:flex bg-emerald-700 text-white md:w-20 lg:w-60 flex-col justify-between shrink-0 shadow-xl z-20 print:hidden">
        <div>
          {/* Brand Logo */}
          <div className="h-16 flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 border-b border-emerald-600/60">
            <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center font-black text-xl shadow-sm shrink-0">
              K
            </div>
            <div className="hidden lg:block overflow-hidden">
              <h1 className="font-bold text-base leading-tight truncate">Kremes Legend</h1>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col p-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex md:flex-col lg:flex-row items-center lg:justify-between px-2 lg:px-3 py-2.5 lg:py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-md font-semibold'
                      : 'text-emerald-100 hover:bg-emerald-600/60'
                  }`}
                >
                  <div className="flex md:flex-col lg:flex-row items-center gap-1 lg:gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-[10px] lg:text-sm leading-tight text-center lg:text-left">
                      <span className="lg:hidden">{item.shortLabel}</span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] lg:text-xs px-1.5 lg:px-2 py-0.5 rounded-full ${
                        item.badgeColor
                      } md:absolute md:top-1.5 md:right-1.5 lg:static`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Info Kasir Aktif */}
        <div className="flex flex-col items-center lg:items-start p-3 border-t border-emerald-600/60 text-xs text-emerald-100 gap-2">
          <div className="flex items-center gap-2" title={settings.cashierName}>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
            <span className="hidden lg:inline truncate font-medium">{settings.cashierName}</span>
          </div>
        </div>
      </aside>

      {/* BOTTOM NAVIGATION BAR UNTUK HP (ANDROID & IPHONE < md) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 pb-safe z-30 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.05)] print:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex-1 py-2 px-1 flex flex-col items-center justify-center gap-1 transition-colors touch-manipulation ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-0.5 bg-emerald-600 rounded-b-full" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center ${
                      item.id === 'items'
                        ? 'bg-amber-400 text-slate-900 font-extrabold'
                        : 'bg-emerald-600 text-white font-bold'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-none truncate max-w-full">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
