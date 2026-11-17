import React, { useState, useEffect, useMemo } from 'react';
import {
  CartItem,
  Category,
  HeldOrder,
  OrderType,
  PaymentMethodType,
  Product,
  ReportMetrics,
  StoreSettings,
  TabType,
  ToastMessage,
  TopProductMetric,
  Transaction,
} from './types/pos';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
} from './data/initialData';
import { exportTransactionsToCSV } from './utils/formatters';
import { Toast } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { PosView } from './components/views/PosView';
import { ReceiptsView } from './components/views/ReceiptsView';
import { InventoryView } from './components/views/InventoryView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { PaymentModal } from './components/modals/PaymentModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { EditCartItemModal } from './components/modals/EditCartItemModal';
import { ProductModal } from './components/modals/ProductModal';

export default function App() {
  // ==========================================
  // STATE MANAGEMENT (DENGAN LOCALSTORAGE)
  // ==========================================
  const [activeTab, setActiveTab] = useState<TabType>('pos');

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('loyverse_pos_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('loyverse_pos_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('loyverse_pos_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>(() => {
    const saved = localStorage.getItem('loyverse_pos_held');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('loyverse_pos_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.storeName === 'Kedai Ketan & Kopi Nusantara') {
        parsed.storeName = 'Kremes Legend';
      }
      return parsed;
    }
    return INITIAL_SETTINGS;
  });

  // Simpan otomatis ke localStorage
  useEffect(() => {
    localStorage.setItem('loyverse_pos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('loyverse_pos_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('loyverse_pos_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('loyverse_pos_held', JSON.stringify(heldOrders));
  }, [heldOrders]);

  useEffect(() => {
    localStorage.setItem('loyverse_pos_settings', JSON.stringify(settings));
  }, [settings]);

  // ==========================================
  // STATE LAYAR KASIR (POS REGISTER)
  // ==========================================
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('Pelanggan Umum');
  const [orderType, setOrderType] = useState<OrderType>('Makan di Tempat');
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);

  // State Modals
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('Tunai');
  const [cashReceivedInput, setCashReceivedInput] = useState<string>('');
  const [completedReceipt, setCompletedReceipt] = useState<Transaction | null>(null);
  const [isHeldOrdersModalOpen, setIsHeldOrdersModalOpen] = useState<boolean>(false);

  // State Manajemen Barang
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [itemFilterCategory, setItemFilterCategory] = useState<string>('Semua');
  const [itemSearch, setItemSearch] = useState<string>('');

  // State Riwayat Struk
  const [selectedReceiptDetail, setSelectedReceiptDetail] = useState<Transaction | null>(null);
  const [receiptSearch, setReceiptSearch] = useState<string>('');

  // State Notifikasi Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==========================================
  // KALKULASI KERANJANG (CART CALCULATIONS)
  // ==========================================
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const itemTotal = (item.price - (item.itemDiscount || 0)) * item.qty;
      return sum + Math.max(0, itemTotal);
    }, 0);
  }, [cart]);

  const netBeforeTax = Math.max(0, cartSubtotal - globalDiscount);
  const cartTax = settings.enableTax ? Math.round(netBeforeTax * (settings.taxRate / 100)) : 0;
  const cartTotal = netBeforeTax + cartTax;
  const totalItemsInCart = cart.reduce((acc, item) => acc + item.qty, 0);

  // ==========================================
  // FUNGSI OPERASIONAL KASIR (POS FUNCTIONS)
  // ==========================================
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast(`Stok "${product.name}" habis!`, 'error');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].qty;
        if (currentQty + 1 > product.stock) {
          showToast(`Stok tidak mencukupi (Tersisa ${product.stock})`, 'error');
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existingIndex] = { ...updated[existingIndex], qty: currentQty + 1 };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            cost: product.cost,
            qty: 1,
            note: '',
            itemDiscount: 0,
            icon: product.icon,
          },
        ];
      }
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    const product = products.find((p) => p.id === productId);
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            if (delta > 0 && product && newQty > product.stock) {
              showToast(`Maksimal stok tersedia: ${product.stock}`, 'error');
              return item;
            }
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => Boolean(item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('Pelanggan Umum');
    setGlobalDiscount(0);
    setOrderType('Makan di Tempat');
  };

  // Simpan Pesanan (Open Bills / Hold Order)
  const handleHoldOrder = () => {
    if (cart.length === 0) {
      showToast('Keranjang masih kosong!', 'error');
      return;
    }
    const newHeld: HeldOrder = {
      id: `BILL-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      customerName: customerName || 'Pelanggan Umum',
      orderType,
      cart,
      globalDiscount,
      total: cartTotal,
    };
    setHeldOrders([newHeld, ...heldOrders]);
    clearCart();
    showToast('Pesanan disimpan ke Daftar Open Bill');
  };

  const handleRecallOrder = (bill: HeldOrder) => {
    setCart(bill.cart);
    setCustomerName(bill.customerName);
    setOrderType(bill.orderType);
    setGlobalDiscount(bill.globalDiscount || 0);
    setHeldOrders(heldOrders.filter((h) => h.id !== bill.id));
    setIsHeldOrdersModalOpen(false);
    showToast(`Pesanan ${bill.customerName} dibuka kembali`);
  };

  // Buka Modal Pembayaran
  const openCheckoutModal = () => {
    if (cart.length === 0) {
      showToast('Pilih minimal 1 barang untuk bayar', 'error');
      return;
    }
    setPaymentMethod('Tunai');
    setCashReceivedInput(cartTotal.toString());
    setIsPaymentModalOpen(true);
  };

  // Proses Penyelesaian Transaksi
  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cashVal = Number(cashReceivedInput) || 0;
    if (paymentMethod === 'Tunai' && cashVal < cartTotal) {
      showToast('Nominal uang tunai kurang dari total tagihan!', 'error');
      return;
    }

    const trxId = `TRX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      100 + Math.random() * 900
    )}`;
    const newTransaction: Transaction = {
      id: trxId,
      timestamp: new Date().toISOString(),
      customerName: customerName.trim() || 'Pelanggan Umum',
      orderType,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price - (item.itemDiscount || 0),
        originalPrice: item.price,
        cost: item.cost,
        qty: item.qty,
        note: item.note,
      })),
      subtotal: cartSubtotal,
      discount: globalDiscount,
      tax: cartTax,
      total: cartTotal,
      paymentMethod,
      cashReceived: paymentMethod === 'Tunai' ? cashVal : cartTotal,
      change: paymentMethod === 'Tunai' ? Math.max(0, cashVal - cartTotal) : 0,
      status: 'completed',
      cashier: settings.cashierName,
    };

    // Kurangi Stok Produk
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const boughtItem = cart.find((c) => c.id === prod.id);
        if (boughtItem) {
          return { ...prod, stock: Math.max(0, prod.stock - boughtItem.qty) };
        }
        return prod;
      })
    );

    setTransactions([newTransaction, ...transactions]);
    setIsPaymentModalOpen(false);
    setCompletedReceipt(newTransaction);
    clearCart();
    setMobileCartOpen(false);
    showToast('Transaksi Berhasil Disimpan!');
  };

  // Fitur Refund (Pengembalian Dana & Kembalikan Stok)
  const handleRefundTransaction = (trxId: string) => {
    const targetTrx = transactions.find((t) => t.id === trxId);
    if (!targetTrx || targetTrx.status === 'refunded') return;

    // Kembalikan stok barang
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const returnedItem = targetTrx.items.find((i) => i.id === prod.id);
        if (returnedItem) {
          return { ...prod, stock: prod.stock + returnedItem.qty };
        }
        return prod;
      })
    );

    const refundedAt = new Date().toISOString();
    setTransactions((prev) =>
      prev.map((t) => (t.id === trxId ? { ...t, status: 'refunded', refundedAt } : t))
    );

    if (selectedReceiptDetail?.id === trxId) {
      setSelectedReceiptDetail({ ...targetTrx, status: 'refunded', refundedAt });
    }
    showToast(`Struk ${trxId} telah di-refund & stok dikembalikan`, 'info');
  };

  // Filter Produk di Kasir
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // ==========================================
  // KALKULASI ANALITIK & LAPORAN (REPORTS)
  // ==========================================
  const reportMetrics = useMemo<ReportMetrics>(() => {
    let grossSales = 0;
    let refunds = 0;
    let totalDiscounts = 0;
    let totalTax = 0;
    let totalCost = 0;
    let completedCount = 0;

    const categorySalesMap: Record<string, number> = {};
    const productSalesMap: Record<string, TopProductMetric> = {};
    const paymentMethodMap: Record<string, number> = { Tunai: 0, QRIS: 0, 'Transfer Bank': 0 };

    transactions.forEach((trx) => {
      if (trx.status === 'refunded') {
        refunds += trx.total;
      } else {
        completedCount += 1;
        grossSales += trx.subtotal;
        totalDiscounts += trx.discount || 0;
        totalTax += trx.tax || 0;
        paymentMethodMap[trx.paymentMethod] = (paymentMethodMap[trx.paymentMethod] || 0) + trx.total;

        trx.items.forEach((item) => {
          const itemRevenue = item.price * item.qty;
          const itemCost = (item.cost || 0) * item.qty;
          totalCost += itemCost;

          // Map Produk Terlaris
          if (!productSalesMap[item.name]) {
            productSalesMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
          }
          productSalesMap[item.name].qty += item.qty;
          productSalesMap[item.name].revenue += itemRevenue;

          // Map Kategori
          const prodRef = products.find((p) => p.id === item.id);
          const catName = prodRef ? prodRef.category : 'Lainnya';
          categorySalesMap[catName] = (categorySalesMap[catName] || 0) + itemRevenue;
        });
      }
    });

    const netSales = Math.max(0, grossSales - totalDiscounts);
    const grossProfit = netSales - totalCost;
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return {
      grossSales,
      refunds,
      netSales,
      grossProfit,
      totalTax,
      completedCount,
      topProducts,
      categorySalesMap,
      paymentMethodMap,
    };
  }, [transactions, products]);

  // ==========================================
  // FUNGSI CRUD BARANG (INVENTORY CRUD)
  // ==========================================
  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemData: Product = {
      id: editingProduct?.id || `prd-${Date.now()}`,
      sku: (formData.get('sku') as string) || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      name: (formData.get('name') as string) || '',
      category: (formData.get('category') as string) || categories[0]?.name || 'Umum',
      price: Number(formData.get('price')) || 0,
      cost: Number(formData.get('cost')) || 0,
      stock: Number(formData.get('stock')) || 0,
      minStock: Number(formData.get('minStock')) || 5,
      icon: (formData.get('icon') as string) || '📦',
      color: (formData.get('color') as string) || editingProduct?.color || 'bg-emerald-600',
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? itemData : p)));
      showToast(`Barang "${itemData.name}" diperbarui`);
    } else {
      setProducts([itemData, ...products]);
      showToast(`Barang "${itemData.name}" ditambahkan`);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    showToast('Barang berhasil dihapus', 'info');
  };

  const quickAdjustStock = (id: string, delta: number) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  // Reset Demo Data
  const handleResetDemo = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setHeldOrders([]);
    setSettings(INITIAL_SETTINGS);
    clearCart();
    showToast('Seluruh data di-reset ke pengaturan awal demo!');
  };

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <div className="h-dvh w-full bg-slate-100 text-slate-800 flex flex-col md:flex-row font-sans select-none overflow-hidden">
      {/* TOAST NOTIFICATION */}
      <Toast toast={toast} />

      {/* SIDEBAR NAVIGATION */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        transactionsCount={transactions.length}
        lowStockCount={lowStockCount}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden print:hidden">
        {activeTab === 'pos' && (
          <PosView
            products={products}
            filteredProducts={filteredProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cart={cart}
            addToCart={addToCart}
            updateCartQty={updateCartQty}
            clearCart={clearCart}
            customerName={customerName}
            setCustomerName={setCustomerName}
            orderType={orderType}
            setOrderType={setOrderType}
            globalDiscount={globalDiscount}
            setGlobalDiscount={setGlobalDiscount}
            settings={settings}
            setSettings={setSettings}
            cartSubtotal={cartSubtotal}
            cartTax={cartTax}
            cartTotal={cartTotal}
            totalItemsInCart={totalItemsInCart}
            mobileCartOpen={mobileCartOpen}
            setMobileCartOpen={setMobileCartOpen}
            onEditCartItem={(item) => setEditingCartItem(item)}
            onOpenCheckout={openCheckoutModal}
          />
        )}

        {activeTab === 'receipts' && (
          <ReceiptsView
            transactions={transactions}
            receiptSearch={receiptSearch}
            setReceiptSearch={setReceiptSearch}
            selectedReceiptDetail={selectedReceiptDetail}
            setSelectedReceiptDetail={setSelectedReceiptDetail}
            onPrintReceipt={(trx) => setCompletedReceipt(trx)}
            onRefundTransaction={handleRefundTransaction}
          />
        )}

        {activeTab === 'items' && (
          <InventoryView
            products={products}
            categories={categories}
            itemSearch={itemSearch}
            setItemSearch={setItemSearch}
            itemFilterCategory={itemFilterCategory}
            setItemFilterCategory={setItemFilterCategory}
            onAddNewProduct={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onEditProduct={(item) => {
              setEditingProduct(item);
              setIsProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onQuickAdjustStock={quickAdjustStock}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            reportMetrics={reportMetrics}
            onExportCSV={() =>
              exportTransactionsToCSV(transactions, () => showToast('File CSV berhasil diunduh!'))
            }
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            setSettings={setSettings}
            onResetDemo={handleResetDemo}
          />
        )}
      </main>

      {/* MODALS */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        cartTotal={cartTotal}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        cashReceivedInput={cashReceivedInput}
        setCashReceivedInput={setCashReceivedInput}
        onCompletePayment={handleCompletePayment}
      />

      <ReceiptModal
        receipt={completedReceipt}
        settings={settings}
        onClose={() => setCompletedReceipt(null)}
      />

      <EditCartItemModal
        editingItem={editingCartItem}
        setEditingItem={setEditingCartItem}
        onSave={(updatedItem) => {
          setCart(cart.map((c) => (c.id === updatedItem.id ? updatedItem : c)));
          setEditingCartItem(null);
        }}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        categories={categories}
        onSaveProduct={handleSaveProduct}
      />
    </div>
  );
}
