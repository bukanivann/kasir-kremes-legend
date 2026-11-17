import React from 'react';
import { Download } from 'lucide-react';
import { ReportMetrics } from '../../types/pos';
import { formatIDR } from '../../utils/formatters';

interface ReportsViewProps {
  reportMetrics: ReportMetrics;
  onExportCSV: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reportMetrics,
  onExportCSV,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 pb-24 md:pb-6 space-y-5 sm:space-y-6 bg-slate-100">
      {/* Header Laporan */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-800">Ringkasan Penjualan & Laba</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Analitik real-time performa toko Kremes Legend
          </p>
        </div>
        <button
          onClick={onExportCSV}
          className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform touch-manipulation"
        >
          <Download className="w-4 h-4" />
          Ekspor CSV
        </button>
      </div>

      {/* KPI Cards (2 kolom di HP & Tablet, 4 kolom di Laptop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400 block">
            Penjualan Kotor
          </span>
          <p className="text-base sm:text-2xl font-black text-slate-800 mt-1 break-words">
            {formatIDR(reportMetrics.grossSales)}
          </p>
          <p className="text-[11px] sm:text-xs text-emerald-600 mt-1.5 sm:mt-2 font-medium">
            {reportMetrics.completedCount} Transaksi Selesai
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400 block">
            Refund
          </span>
          <p className="text-base sm:text-2xl font-black text-red-600 mt-1 break-words">
            {formatIDR(reportMetrics.refunds)}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2">
            Dana dikembalikan
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400 block">
            Penjualan Bersih
          </span>
          <p className="text-base sm:text-2xl font-black text-emerald-700 mt-1 break-words">
            {formatIDR(reportMetrics.netSales)}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2">
            Setelah dikurangi diskon
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/50 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase text-emerald-700 block">
            Laba Kotor
          </span>
          <p className="text-base sm:text-2xl font-black text-emerald-800 mt-1 break-words">
            {formatIDR(reportMetrics.grossProfit)}
          </p>
          <p className="text-[11px] sm:text-xs text-emerald-600 mt-1.5 sm:mt-2 font-semibold">
            Margin Bersih dari HPP
          </p>
        </div>
      </div>

      {/* Grafik Bar & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Produk Terlaris */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">5 Menu Paling Laris</h3>
          {reportMetrics.topProducts.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">Belum ada data penjualan</p>
          ) : (
            <div className="space-y-3">
              {reportMetrics.topProducts.map((prod, index) => {
                const maxRevenue = reportMetrics.topProducts[0]?.revenue || 1;
                const widthPct = Math.max(12, Math.round((prod.revenue / maxRevenue) * 100));
                return (
                  <div key={prod.name} className="space-y-1">
                    <div className="flex justify-between gap-2 text-xs font-semibold">
                      <span className="text-slate-700 truncate">
                        #{index + 1} {prod.name} ({prod.qty}x)
                      </span>
                      <span className="text-emerald-700 shrink-0">{formatIDR(prod.revenue)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Metode Pembayaran & Kategori */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-3">
              Rincian Metode Pembayaran
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {Object.entries(reportMetrics.paymentMethodMap).map(([method, amount]) => (
                <div
                  key={method}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex sm:flex-col items-center sm:items-start justify-between"
                >
                  <span className="text-xs text-slate-500 font-medium">{method}</span>
                  <p className="font-extrabold text-xs sm:text-sm text-slate-800 sm:mt-1">
                    {formatIDR(amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-3">
              Penjualan per Kategori
            </h3>
            <div className="space-y-2">
              {Object.entries(reportMetrics.categorySalesMap).map(([cat, val]) => (
                <div
                  key={cat}
                  className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-slate-100"
                >
                  <span className="font-medium text-slate-600">{cat}</span>
                  <span className="font-bold text-slate-800">{formatIDR(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
