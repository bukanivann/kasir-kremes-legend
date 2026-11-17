import { Category, Product, StoreSettings, Transaction } from '../types/pos';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Makanan & Ketan', color: 'bg-emerald-500' },
  { id: 'cat-2', name: 'Minuman Kopi', color: 'bg-amber-600' },
  { id: 'cat-3', name: 'Non-Kopi & Teh', color: 'bg-teal-500' },
  { id: 'cat-4', name: 'Snack & Roti', color: 'bg-orange-500' },
  { id: 'cat-5', name: 'Paket Hemat', color: 'bg-purple-600' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'prd-1', sku: 'KTN-001', name: 'Ketan Susu Original', category: 'Makanan & Ketan', price: 12000, cost: 6000, stock: 45, minStock: 10, color: 'bg-emerald-600', icon: '🍚' },
  { id: 'prd-2', sku: 'KTN-002', name: 'Ketan Susu Keju Lumer', category: 'Makanan & Ketan', price: 16000, cost: 8500, stock: 38, minStock: 10, color: 'bg-yellow-500', icon: '🧀' },
  { id: 'prd-3', sku: 'KTN-003', name: 'Ketan Susu Coklat Keju', category: 'Makanan & Ketan', price: 18000, cost: 9500, stock: 30, minStock: 10, color: 'bg-amber-800', icon: '🍫' },
  { id: 'prd-4', sku: 'KTN-004', name: 'Ketan Durian Lumer', category: 'Makanan & Ketan', price: 22000, cost: 13000, stock: 8, minStock: 10, color: 'bg-lime-600', icon: '🍈' },
  { id: 'prd-5', sku: 'KOP-001', name: 'Es Kopi Susu Gula Aren', category: 'Minuman Kopi', price: 18000, cost: 8000, stock: 60, minStock: 15, color: 'bg-amber-700', icon: '☕' },
  { id: 'prd-6', sku: 'KOP-002', name: 'Ice Americano Arabica', category: 'Minuman Kopi', price: 15000, cost: 6000, stock: 50, minStock: 10, color: 'bg-stone-700', icon: '🧊' },
  { id: 'prd-7', sku: 'KOP-003', name: 'Caramel Macchiato', category: 'Minuman Kopi', price: 24000, cost: 11000, stock: 25, minStock: 8, color: 'bg-orange-600', icon: '🥤' },
  { id: 'prd-8', sku: 'NON-001', name: 'Uji Matcha Latte', category: 'Non-Kopi & Teh', price: 22000, cost: 10500, stock: 32, minStock: 10, color: 'bg-green-600', icon: '🍵' },
  { id: 'prd-9', sku: 'NON-002', name: 'Thai Tea Authentic', category: 'Non-Kopi & Teh', price: 15000, cost: 6500, stock: 42, minStock: 10, color: 'bg-orange-500', icon: '🧋' },
  { id: 'prd-10', sku: 'NON-003', name: 'Es Lemon Tea Segar', category: 'Non-Kopi & Teh', price: 12000, cost: 4500, stock: 55, minStock: 12, color: 'bg-yellow-400', icon: '🍋' },
  { id: 'prd-11', sku: 'SNK-001', name: 'Roti Bakar Coklat Keju', category: 'Snack & Roti', price: 18000, cost: 9000, stock: 20, minStock: 8, color: 'bg-amber-500', icon: '🍞' },
  { id: 'prd-12', sku: 'SNK-002', name: 'Kentang Goreng Crispy', category: 'Snack & Roti', price: 16000, cost: 7500, stock: 6, minStock: 10, color: 'bg-red-500', icon: '🍟' },
  { id: 'prd-13', sku: 'SNK-003', name: 'Pisang Goreng Karamel', category: 'Snack & Roti', price: 15000, cost: 7000, stock: 18, minStock: 8, color: 'bg-yellow-600', icon: '🍌' },
  { id: 'prd-14', sku: 'PKT-001', name: 'Paket Nongkrong (Ketan + Kopi)', category: 'Paket Hemat', price: 27000, cost: 13500, stock: 25, minStock: 5, color: 'bg-purple-600', icon: '🍱' },
  { id: 'prd-15', sku: 'PKT-002', name: 'Paket Berdua (2 Ketan + 2 Teh)', category: 'Paket Hemat', price: 48000, cost: 24000, stock: 15, minStock: 5, color: 'bg-indigo-600', icon: '👩‍❤️‍👨' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-20250501-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 145).toISOString(),
    customerName: 'Budi Santoso',
    orderType: 'Makan di Tempat',
    items: [
      { id: 'prd-2', name: 'Ketan Susu Keju Lumer', price: 16000, cost: 8500, qty: 2, note: 'Keju ekstra' },
      { id: 'prd-5', name: 'Es Kopi Susu Gula Aren', price: 18000, cost: 8000, qty: 2, note: 'Less sugar' }
    ],
    subtotal: 68000,
    discount: 0,
    tax: 6800,
    total: 74800,
    paymentMethod: 'QRIS',
    cashReceived: 74800,
    change: 0,
    status: 'completed',
    cashier: 'Kasir Utama'
  },
  {
    id: 'TRX-20250501-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    customerName: 'Pelanggan Umum',
    orderType: 'Bungkus',
    items: [
      { id: 'prd-14', name: 'Paket Nongkrong (Ketan + Kopi)', price: 27000, cost: 13500, qty: 1, note: '' },
      { id: 'prd-12', name: 'Kentang Goreng Crispy', price: 16000, cost: 7500, qty: 1, note: 'Saus sambal pisah' }
    ],
    subtotal: 43000,
    discount: 3000,
    tax: 4000,
    total: 44000,
    paymentMethod: 'Tunai',
    cashReceived: 50000,
    change: 6000,
    status: 'completed',
    cashier: 'Kasir Utama'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Kremes Legend',
  address: 'Jl. Merdeka Raya No. 88, Jakarta Selatan',
  phone: '0812-3456-7890',
  cashierName: 'Andi (Kasir Shift 1)',
  enableTax: true,
  taxRate: 10,
  receiptFooter: 'Terima kasih telah berkunjung!'
};
