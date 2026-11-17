import React from 'react';
import { Plus, Search, Edit3, Trash2, X } from 'lucide-react';
import { Category, Product } from '../../types/pos';
import { formatIDR } from '../../utils/formatters';

interface InventoryViewProps {
  products: Product[];
  categories: Category[];
  itemSearch: string;
  setItemSearch: (search: string) => void;
  itemFilterCategory: string;
  setItemFilterCategory: (category: string) => void;
  onAddNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onQuickAdjustStock: (id: string, delta: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  categories,
  itemSearch,
  setItemSearch,
  itemFilterCategory,
  setItemFilterCategory,
  onAddNewProduct,
  onEditProduct,
  onDeleteProduct,
  onQuickAdjustStock,
}) => {
  const filteredItems = products.filter(
    (p) =>
      (itemFilterCategory === 'Semua' || p.category === itemFilterCategory) &&
      (p.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(itemSearch.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-100 p-3 sm:p-6 pb-20 md:pb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        {/* Header Manajemen Barang */}
        <div className="p-3.5 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Manajemen Barang & Inventaris
            </h2>
            <p className="text-xs text-slate-500">
              Kelola harga jual, harga modal (HPP), dan pantau stok secara real-time
            </p>
          </div>
          <button
            onClick={onAddNewProduct}
            className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            Tambah Barang Baru
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder="Cari nama barang..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {itemSearch && (
              <button
                onClick={() => setItemSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={itemFilterCategory}
            onChange={(e) => setItemFilterCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Semua">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Daftar Produk (Kartu Responsif di HP < md, Tabel di Tablet & Laptop md+) */}
        <div className="flex-1 overflow-y-auto">
          {/* Tampilan Kartu Mobile (< md) */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <p className="text-center py-12 text-sm text-slate-400">Tidak ada barang ditemukan</p>
            ) : (
              filteredItems.map((item) => {
                const margin = item.price - item.cost;
                const marginPct = item.price > 0 ? Math.round((margin / item.price) * 100) : 0;
                const isLow = item.stock <= item.minStock;

                return (
                  <div key={item.id} className="p-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm text-slate-800">{item.name}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onEditProduct(item)}
                          className="p-2 text-slate-500 hover:text-emerald-600 bg-slate-50 rounded-lg touch-manipulation"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(item.id)}
                          className="p-2 text-slate-500 hover:text-red-600 bg-slate-50 rounded-lg touch-manipulation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Harga Jual</span>
                        <span className="font-bold text-slate-800">{formatIDR(item.price)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">HPP / Modal</span>
                        <span className="font-medium text-slate-600">{formatIDR(item.cost)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Margin ({marginPct}%)</span>
                        <span className="font-semibold text-emerald-700">+{formatIDR(margin)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-xs text-slate-500 font-medium">Stok Saat Ini:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onQuickAdjustStock(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-slate-100 active:bg-slate-200 flex items-center justify-center text-slate-700 font-bold touch-manipulation"
                        >
                          -
                        </button>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold min-w-[44px] text-center ${
                            isLow ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {item.stock}
                        </span>
                        <button
                          onClick={() => onQuickAdjustStock(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-slate-100 active:bg-slate-200 flex items-center justify-center text-slate-700 font-bold touch-manipulation"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Tampilan Tabel Tablet & Laptop (md+) */}
          <table className="hidden md:table w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <th className="py-3.5 px-4">Barang</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-right">Harga Jual</th>
                <th className="py-3.5 px-4 text-right">HPP / Modal</th>
                <th className="py-3.5 px-4 text-right">Margin</th>
                <th className="py-3.5 px-4 text-center">Stok Saat Ini</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredItems.map((item) => {
                const margin = item.price - item.cost;
                const marginPct = item.price > 0 ? Math.round((margin / item.price) * 100) : 0;
                const isLow = item.stock <= item.minStock;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{item.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">
                      {formatIDR(item.price)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">{formatIDR(item.cost)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-emerald-700 font-semibold text-xs">
                        +{formatIDR(margin)} ({marginPct}%)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onQuickAdjustStock(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
                        >
                          -
                        </button>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isLow ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {item.stock}
                        </span>
                        <button
                          onClick={() => onQuickAdjustStock(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditProduct(item)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(item.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
