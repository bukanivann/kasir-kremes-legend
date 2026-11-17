import React from 'react';
import { X } from 'lucide-react';
import { Category, Product } from '../../types/pos';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  categories: Category[];
  onSaveProduct: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  editingProduct,
  categories,
  onSaveProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <form
        onSubmit={onSaveProduct}
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-4 sm:p-6 pb-safe max-h-[92dvh] overflow-y-auto space-y-4"
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-sm sm:text-base text-slate-800">
            {editingProduct ? 'Edit Barang' : 'Tambah Barang Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Nama Menu / Barang
            </label>
            <input
              name="name"
              required
              defaultValue={editingProduct?.name || ''}
              placeholder="Contoh: Ketan Susu Keju"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Kategori
            </label>
            <select
              name="category"
              defaultValue={editingProduct?.category || categories[0]?.name}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Harga Jual (Rp)
              </label>
              <input
                name="price"
                type="number"
                required
                defaultValue={editingProduct?.price || ''}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Harga Modal / HPP (Rp)
              </label>
              <input
                name="cost"
                type="number"
                required
                defaultValue={editingProduct?.cost || ''}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Stok Saat Ini
              </label>
              <input
                name="stock"
                type="number"
                required
                defaultValue={editingProduct?.stock ?? 25}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Batas Stok Rendah
              </label>
              <input
                name="minStock"
                type="number"
                defaultValue={editingProduct?.minStock ?? 5}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 pt-3 pb-2 sm:pb-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 touch-manipulation"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold touch-manipulation"
          >
            Simpan Barang
          </button>
        </div>
      </form>
    </div>
  );
};
