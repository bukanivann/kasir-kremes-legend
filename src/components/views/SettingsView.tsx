import React from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { StoreSettings } from '../../types/pos';

interface SettingsViewProps {
  settings: StoreSettings;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  onResetDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  onResetDemo,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 pb-24 md:pb-6 bg-slate-100">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-5 sm:space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            Pengaturan Sistem Kasir & Struk
          </h2>
          <p className="text-xs text-slate-500">
            Sesuaikan profil toko yang tercetak pada struk belanja pelanggan
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Nama Toko / Usaha
            </label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Alamat Lengkap
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Nama Kasir Aktif
              </label>
              <input
                type="text"
                value={settings.cashierName}
                onChange={(e) => setSettings({ ...settings, cashierName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Persentase PPN (%)
              </label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center sm:pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={settings.enableTax}
                  onChange={(e) => setSettings({ ...settings, enableTax: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                Aktifkan Pajak PPN Otomatis
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Catatan Kaki Struk (Footer)
            </label>
            <textarea
              rows={2}
              value={settings.receiptFooter}
              onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={onResetDemo}
            className="justify-center px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-2 touch-manipulation"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Data Demo ke Awal
          </button>
          <span className="text-xs text-emerald-600 font-semibold flex items-center justify-center sm:justify-end gap-1">
            <Check className="w-4 h-4" /> Tersimpan otomatis di Browser
          </span>
        </div>
      </div>
    </div>
  );
};
