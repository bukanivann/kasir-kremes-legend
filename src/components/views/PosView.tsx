import React from 'react';
import {
  Search,
  X,
  Package,
  ShoppingBag,
  Receipt,
  Trash2,
  User,
  Utensils,
  ShoppingBag as TakeawayIcon,
  Truck,
  Edit3,
  Minus,
  Plus,
  Tag,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import {
  CartItem,
  Category,
  OrderType,
  Product,
  StoreSettings,
} from '../../types/pos';
import { formatIDR } from '../../utils/formatters';

interface PosViewProps {
  products: Product[];
  filteredProducts: Product[];
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  globalDiscount: number;
  setGlobalDiscount: (discount: number) => void;
  settings: StoreSettings;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  totalItemsInCart: number;
  mobileCartOpen: boolean;
  setMobileCartOpen: (open: boolean) => void;
  onEditCartItem: (item: CartItem) => void;
  onOpenCheckout: () => void;
}

export const PosView: React.FC<PosViewProps> = ({
  products,
  filteredProducts,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  cart,
  addToCart,
  updateCartQty,
  clearCart,
  customerName,
  setCustomerName,
  orderType,
  setOrderType,
  globalDiscount,
  setGlobalDiscount,
  settings,
  setSettings,
  cartSubtotal,
  cartTax,
  cartTotal,
  totalItemsInCart,
  mobileCartOpen,
  setMobileCartOpen,
  onEditCartItem,
  onOpenCheckout,
}) => {
  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      {/* Kiri: Katalog Produk */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
        {/* Top Bar Pencarian */}
        <div className="bg-white p-2.5 sm:p-3.5 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama menu..."
              className="w-full pl-10 sm:pl-11 pr-9 py-2 sm:py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Kategori (Pills) */}
        <div className="bg-white px-3 sm:px-4 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 touch-manipulation ${
              selectedCategory === 'Semua'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Menu ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 touch-manipulation ${
                selectedCategory === cat.name
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid Kartu Produk */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-36 md:pb-6">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <Package className="w-12 h-12 mb-2 stroke-1" />
              <p className="font-medium text-sm">Tidak ada menu yang cocok</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
              {filteredProducts.map((product) => {
                const inCartItem = cart.find((c) => c.id === product.id);
                const isOutOfStock = product.stock <= 0;

                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={isOutOfStock}
                    className={`group relative bg-white rounded-2xl p-3.5 sm:p-4 text-left border transition-all flex flex-col justify-between min-h-[96px] sm:min-h-[108px] shadow-sm hover:shadow-md active:scale-[0.97] touch-manipulation ${
                      inCartItem
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                        : 'border-slate-200/80'
                    } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {/* Nama & Harga */}
                    <div className="flex flex-col justify-between h-full w-full">
                      <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 group-hover:text-emerald-700 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-emerald-700 font-extrabold text-xs sm:text-sm mt-2">
                        {formatIDR(product.price)}
                      </p>
                    </div>

                    {/* Badge Qty di Keranjang */}
                    {inCartItem && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                        {inCartItem.qty}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tombol Floating Keranjang untuk Layar HP (< md) */}
      <div className="md:hidden fixed bottom-[56px] inset-x-0 z-20 p-2.5 pb-safe pointer-events-none">
        <div className="bg-emerald-800 text-white rounded-2xl p-3 shadow-xl border border-emerald-600/40 flex items-center justify-between pointer-events-auto">
          <div className="pl-1">
            <p className="text-[11px] text-emerald-200 font-medium">
              {totalItemsInCart > 0 ? `${totalItemsInCart} Menu dipilih` : 'Keranjang kosong'}
            </p>
            <p className="text-base font-black text-white leading-tight">{formatIDR(cartTotal)}</p>
          </div>
          <button
            onClick={() => setMobileCartOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-extrabold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-transform touch-manipulation"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Lihat Pesanan</span>
            {totalItemsInCart > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px]">
                {totalItemsInCart}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Kanan: Panel Struk / Tiket Kasir (Cart Panel - Side-by-Side di Tablet/Laptop, Full Drawer di HP) */}
      <div
        className={`${
          mobileCartOpen ? 'fixed inset-0 z-50 flex' : 'hidden md:flex'
        } w-full md:w-80 lg:w-96 xl:w-[420px] bg-white border-l border-slate-200 flex-col justify-between shrink-0 shadow-xl`}
      >
        {/* Header Tiket: Pelanggan & Tipe Pesanan */}
        <div className="p-3.5 sm:p-4 pt-safe border-b border-slate-200 space-y-2.5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileCartOpen(false)}
                className="md:hidden p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg"
                aria-label="Kembali ke menu"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Receipt className="w-5 h-5 text-emerald-600 hidden md:inline" />
              <h2 className="font-bold text-slate-800 text-sm sm:text-base">Tiket Pesanan Baru</h2>
            </div>
            <div className="flex items-center gap-1">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  title="Kosongkan Tiket"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="md:hidden">Hapus Semua</span>
                </button>
              )}
              <button
                onClick={() => setMobileCartOpen(false)}
                className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Input Nama Pelanggan */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <User className="w-4 h-4 text-emerald-600 shrink-0" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama Pelanggan / Meja..."
              className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 w-full focus:outline-none"
            />
          </div>

          {/* Pilihan Tipe Pesanan */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { label: 'Makan di Tempat', icon: Utensils },
              { label: 'Bungkus', icon: TakeawayIcon },
              { label: 'Delivery', icon: Truck },
            ].map((type) => {
              const IconComp = type.icon;
              return (
                <button
                  key={type.label}
                  onClick={() => setOrderType(type.label)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg transition-all touch-manipulation ${
                    orderType === type.label
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{type.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daftar Item di Keranjang */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 px-3.5 sm:px-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <ShoppingBag className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
              <p className="text-sm font-medium">Belum ada menu dipilih</p>
              <p className="text-xs text-slate-400 mt-0.5 text-center">
                Ketuk kartu menu untuk menambahkan pesanan
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-3 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onEditCartItem(item)}
                    className="text-left group flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-600 truncate">
                        {item.name}
                      </span>
                      <Edit3 className="w-3 h-3 text-slate-400 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatIDR(item.price)}
                      {(item.itemDiscount || 0) > 0 && (
                        <span className="text-red-500 ml-1">(-{formatIDR(item.itemDiscount || 0)})</span>
                      )}
                    </p>
                    {item.note && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block mt-1">
                        Catatan: {item.note}
                      </p>
                    )}
                  </button>

                  {/* Kontrol Kuantitas (+ / -) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        className="p-2 sm:p-1.5 text-slate-600 hover:text-red-600 active:bg-slate-200 rounded-l-lg transition-colors touch-manipulation"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-slate-800">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        className="p-2 sm:p-1.5 text-slate-600 hover:text-emerald-600 active:bg-slate-200 rounded-r-lg transition-colors touch-manipulation"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-20 text-right font-bold text-xs sm:text-sm text-slate-800">
                      {formatIDR((item.price - (item.itemDiscount || 0)) * item.qty)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Tiket: Ringkasan Tagihan & Tombol Bayar */}
        <div className="p-3.5 sm:p-4 pb-safe bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
          <div className="space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({totalItemsInCart} item)</span>
              <span className="font-semibold">{formatIDR(cartSubtotal)}</span>
            </div>

            {/* Input Diskon Global */}
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                Potongan Diskon (Rp)
              </span>
              <input
                type="number"
                min="0"
                value={globalDiscount || ''}
                onChange={(e) => setGlobalDiscount(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                className="w-28 text-right bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Pajak PPN Toggle */}
            <div className="flex items-center justify-between text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableTax}
                  onChange={(e) => setSettings({ ...settings, enableTax: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>PPN ({settings.taxRate}%)</span>
              </label>
              <span className="font-semibold">{formatIDR(cartTax)}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-slate-800 text-sm sm:text-base">Total Tagihan</span>
              <span className="font-black text-lg sm:text-xl text-emerald-700">{formatIDR(cartTotal)}</span>
            </div>
          </div>

          {/* Tombol Bayar */}
          <div className="pt-1">
            <button
              onClick={onOpenCheckout}
              disabled={cart.length === 0}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white shadow-lg shadow-emerald-600/20 disabled:opacity-40 transition-all flex items-center justify-between touch-manipulation"
            >
              <span>BAYAR</span>
              <div className="flex items-center gap-1">
                <span>{formatIDR(cartTotal)}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
