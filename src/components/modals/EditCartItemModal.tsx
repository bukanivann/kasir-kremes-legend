import React from 'react';
import { X } from 'lucide-react';
import { CartItem } from '../../types/pos';

interface EditCartItemModalProps {
  editingItem: CartItem | null;
  setEditingItem: React.Dispatch<React.SetStateAction<CartItem | null>>;
  onSave: (item: CartItem) => void;
}

export const EditCartItemModal: React.FC<EditCartItemModalProps> = ({
  editingItem,
  setEditingItem,
  onSave,
}) => {
  if (!editingItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-xl p-4 sm:p-5 pb-safe space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">{editingItem.name}</h3>
          <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Potongan Diskon per Item (Rp)
            </label>
            <input
              type="number"
              min="0"
              value={editingItem.itemDiscount || 0}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  itemDiscount: Math.max(0, Number(e.target.value)),
                })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Catatan Pesanan (Contoh: Tanpa Es, Pedas)
            </label>
            <input
              type="text"
              value={editingItem.note || ''}
              onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value })}
              placeholder="Ketik catatan dapur..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex gap-2.5 pt-2 pb-2 sm:pb-0">
          <button
            onClick={() => setEditingItem(null)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 touch-manipulation"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(editingItem)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold touch-manipulation"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};
