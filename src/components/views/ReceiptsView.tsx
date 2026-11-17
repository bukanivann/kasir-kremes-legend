import React from 'react';
import { Search, Printer, RotateCcw, Receipt, ArrowLeft, X } from 'lucide-react';
import { Transaction } from '../../types/pos';
import { formatDateTime, formatIDR } from '../../utils/formatters';

interface ReceiptsViewProps {
  transactions: Transaction[];
  receiptSearch: string;
  setReceiptSearch: (search: string) => void;
  selectedReceiptDetail: Transaction | null;
  setSelectedReceiptDetail: (trx: Transaction | null) => void;
  onPrintReceipt: (trx: Transaction) => void;
  onRefundTransaction: (trxId: string) => void;
}

export const ReceiptsView: React.FC<ReceiptsViewProps> = ({
  transactions,
  receiptSearch,
  setReceiptSearch,
  selectedReceiptDetail,
  setSelectedReceiptDetail,
  onPrintReceipt,
  onRefundTransaction,
}) => {
  const filteredTransactions = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(receiptSearch.toLowerCase()) ||
      t.customerName.toLowerCase().includes(receiptSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100 relative">
      {/* Daftar Transaksi (Tampil penuh di HP saat belum pilih struk, atau di sisi kiri pada Tablet/Laptop) */}
      <div
        className={`${
          selectedReceiptDetail ? 'hidden md:flex' : 'flex'
        } w-full md:w-5/12 lg:w-2/5 bg-white border-r border-slate-200 flex-col overflow-hidden`}
      >
        <div className="p-3.5 sm:p-4 border-b border-slate-200 space-y-2.5 shrink-0">
          <h2 className="font-bold text-base sm:text-lg text-slate-800">Riwayat Struk Transaksi</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={receiptSearch}
              onChange={(e) => setReceiptSearch(e.target.value)}
              placeholder="Cari nomor struk atau pelanggan..."
              className="w-full pl-10 pr-9 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
            {receiptSearch && (
              <button
                onClick={() => setReceiptSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pb-20 md:pb-0">
          {filteredTransactions.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              Tidak ada struk transaksi ditemukan
            </div>
          ) : (
            filteredTransactions.map((trx) => (
              <button
                key={trx.id}
                onClick={() => setSelectedReceiptDetail(trx)}
                className={`w-full p-3.5 sm:p-4 text-left hover:bg-slate-50 active:bg-slate-100 transition-all flex items-center justify-between gap-2 touch-manipulation ${
                  selectedReceiptDetail?.id === trx.id
                    ? 'bg-emerald-50/70 border-l-4 border-emerald-600'
                    : ''
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                      {trx.id}
                    </span>
                    {trx.status === 'refunded' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        REFUND
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {trx.customerName} • {trx.orderType}
                  </p>
                  <p className="text-[11px] text-slate-400">{formatDateTime(trx.timestamp)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`font-extrabold text-xs sm:text-sm ${
                      trx.status === 'refunded' ? 'line-through text-slate-400' : 'text-emerald-700'
                    }`}
                  >
                    {formatIDR(trx.total)}
                  </p>
                  <span className="inline-block mt-1 text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {trx.paymentMethod}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail Struk Terpilih */}
      <div
        className={`${
          selectedReceiptDetail ? 'flex' : 'hidden md:flex'
        } flex-1 flex-col overflow-y-auto p-3.5 sm:p-6 pb-24 md:pb-6 items-center justify-start`}
      >
        {selectedReceiptDetail ? (
          <div className="w-full max-w-md space-y-3">
            {/* Tombol Kembali khusus HP (< md) */}
            <button
              onClick={() => setSelectedReceiptDetail(null)}
              className="md:hidden flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar Struk
            </button>

            <div className="bg-white w-full rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                    Detail Struk Digital
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    {selectedReceiptDetail.id}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPrintReceipt(selectedReceiptDetail)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 touch-manipulation"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak
                  </button>
                  {selectedReceiptDetail.status !== 'refunded' && (
                    <button
                      onClick={() => onRefundTransaction(selectedReceiptDetail.id)}
                      className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 touch-manipulation"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Refund
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3.5 rounded-xl">
                <div className="flex justify-between gap-2">
                  <span>Waktu Transaksi:</span>
                  <span className="font-semibold text-right">
                    {formatDateTime(selectedReceiptDetail.timestamp)}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Pelanggan:</span>
                  <span className="font-semibold text-right">
                    {selectedReceiptDetail.customerName}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Tipe Pesanan:</span>
                  <span className="font-semibold text-right">{selectedReceiptDetail.orderType}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Kasir:</span>
                  <span className="font-semibold text-right">{selectedReceiptDetail.cashier}</span>
                </div>
              </div>

              <div className="divide-y divide-dashed divide-slate-200 space-y-2">
                {selectedReceiptDetail.items.map((item, idx) => (
                  <div key={idx} className="pt-2 flex justify-between gap-2 text-xs sm:text-sm">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.qty}x {item.name}
                      </p>
                      {item.note && <p className="text-xs text-amber-600">Catatan: {item.note}</p>}
                    </div>
                    <span className="font-bold text-slate-700 shrink-0">
                      {formatIDR(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatIDR(selectedReceiptDetail.subtotal)}</span>
                </div>
                {selectedReceiptDetail.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Diskon</span>
                    <span>-{formatIDR(selectedReceiptDetail.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>PPN</span>
                  <span>{formatIDR(selectedReceiptDetail.tax)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t">
                  <span>TOTAL ({selectedReceiptDetail.paymentMethod})</span>
                  <span className="text-emerald-700">{formatIDR(selectedReceiptDetail.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Dibayar</span>
                  <span>{formatIDR(selectedReceiptDetail.cashReceived)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Kembalian</span>
                  <span>{formatIDR(selectedReceiptDetail.change)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Receipt className="w-14 h-14 stroke-1 mb-2" />
            <p className="font-medium text-sm text-center">
              Pilih transaksi di sebelah kiri untuk melihat detail struk
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
