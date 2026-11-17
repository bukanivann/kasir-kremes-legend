import React from 'react';
import { X, Banknote, QrCode, CreditCard, CheckCircle2 } from 'lucide-react';
import { PaymentMethodType } from '../../types/pos';
import { formatIDR } from '../../utils/formatters';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
  cashReceivedInput: string;
  setCashReceivedInput: (val: string) => void;
  onCompletePayment: (e: React.FormEvent) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cartTotal,
  paymentMethod,
  setPaymentMethod,
  cashReceivedInput,
  setCashReceivedInput,
  onCompletePayment,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 print:hidden">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 max-h-[92dvh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-emerald-200 font-semibold">
              Penyelesaian Pembayaran
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-0.5">{formatIDR(cartTotal)}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onCompletePayment} className="p-4 sm:p-5 pb-safe space-y-4 sm:space-y-5 overflow-y-auto">
          {/* Pilihan Metode Bayar */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {[
                { id: 'Tunai', icon: Banknote, desc: 'Uang Kas' },
                { id: 'QRIS', icon: QrCode, desc: 'Scan QR' },
                { id: 'Transfer Bank', icon: CreditCard, desc: 'Debit/TF' },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex flex-col justify-between touch-manipulation ${
                      paymentMethod === m.id
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        paymentMethod === m.id ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <div className="mt-2">
                      <p className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">{m.id}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-400">{m.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Jika Tunai: Tampilkan Kalkulator Kembalian */}
          {paymentMethod === 'Tunai' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Uang Diterima (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={cashReceivedInput}
                  onChange={(e) => setCashReceivedInput(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-lg font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Tombol Nominal Cepat */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {[
                  { label: 'Uang Pas', val: cartTotal },
                  { label: 'Rp 20.000', val: 20000 },
                  { label: 'Rp 50.000', val: 50000 },
                  { label: 'Rp 100.000', val: 100000 },
                ].map((btn) => (
                  <button
                    type="button"
                    key={btn.label}
                    onClick={() => setCashReceivedInput(btn.val.toString())}
                    className="px-3 py-2 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors touch-manipulation"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-600">Kembalian Pelanggan:</span>
                <span className="text-base sm:text-lg font-black text-emerald-700">
                  {formatIDR(Math.max(0, Number(cashReceivedInput) - cartTotal))}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <p className="text-sm font-bold text-emerald-800">
                Pembayaran Non-Tunai ({paymentMethod})
              </p>
              <p className="text-xs text-emerald-600">
                Pastikan pembayaran senilai {formatIDR(cartTotal)} telah berhasil diterima sebelum menekan tombol konfirmasi.
              </p>
            </div>
          )}

          <div className="pt-2 pb-2 sm:pb-0 flex gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-50 touch-manipulation"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 touch-manipulation"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Konfirmasi & Cetak</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
