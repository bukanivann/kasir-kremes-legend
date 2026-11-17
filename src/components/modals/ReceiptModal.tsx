import React from 'react';
import { CheckCircle2, Printer, Plus } from 'lucide-react';
import { StoreSettings, Transaction } from '../../types/pos';
import { formatDateTime, formatIDR } from '../../utils/formatters';

interface ReceiptModalProps {
  receipt: Transaction | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  receipt,
  settings,
  onClose,
}) => {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-4 sm:p-6 max-h-[92dvh] overflow-y-auto space-y-4 sm:space-y-5 print:shadow-none print:border-none print:max-h-none">
        {/* Header Sukses (Disembunyikan saat print) */}
        <div className="text-center space-y-1 print:hidden">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h3 className="font-black text-base sm:text-lg text-slate-800">Transaksi Selesai!</h3>
          <p className="text-xs text-slate-500">Kembalian: {formatIDR(receipt.change)}</p>
        </div>

        {/* Area Kertas Struk Thermal */}
        <div className="border-t border-b border-dashed border-slate-300 py-4 space-y-3 text-xs font-mono text-slate-800">
          <div className="text-center space-y-0.5">
            <p className="font-bold text-sm uppercase">{settings.storeName}</p>
            <p className="text-[11px] text-slate-500">{settings.address}</p>
            <p className="text-[11px] text-slate-500">Telp: {settings.phone}</p>
          </div>

          <div className="border-t border-dashed border-slate-300 pt-2 space-y-0.5 text-[11px]">
            <div className="flex justify-between gap-2">
              <span className="truncate">No: {receipt.id}</span>
              <span className="shrink-0">{receipt.orderType}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="truncate">Plg: {receipt.customerName}</span>
              <span className="shrink-0">{formatDateTime(receipt.timestamp)}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-300 pt-2 space-y-1.5">
            {receipt.items.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between gap-2 font-semibold">
                  <span>
                    {item.qty}x {item.name}
                  </span>
                  <span className="shrink-0">{formatIDR(item.price * item.qty)}</span>
                </div>
                {item.note && <p className="text-[10px] text-slate-500 pl-3">* {item.note}</p>}
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatIDR(receipt.subtotal)}</span>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>-{formatIDR(receipt.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>PPN</span>
              <span>{formatIDR(receipt.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-dashed border-slate-300">
              <span>TOTAL</span>
              <span>{formatIDR(receipt.total)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Bayar ({receipt.paymentMethod})</span>
              <span>{formatIDR(receipt.cashReceived)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Kembali</span>
              <span>{formatIDR(receipt.change)}</span>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-500 pt-2">{settings.receiptFooter}</p>
        </div>

        {/* Tombol Print & Transaksi Baru */}
        <div className="flex gap-2.5 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 touch-manipulation"
          >
            <Printer className="w-4 h-4" />
            Cetak Struk
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  );
};
