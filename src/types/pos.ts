export type TabType = 'pos' | 'receipts' | 'items' | 'reports' | 'settings';

export type OrderType = 'Makan di Tempat' | 'Bungkus' | 'Delivery' | string;

export type PaymentMethodType = 'Tunai' | 'QRIS' | 'Transfer Bank' | string;

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  color: string;
  icon: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  cost: number;
  qty: number;
  note: string;
  itemDiscount?: number;
  icon?: string;
}

export interface TransactionItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  cost: number;
  qty: number;
  note: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  customerName: string;
  orderType: OrderType;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethodType;
  cashReceived: number;
  change: number;
  status: 'completed' | 'refunded';
  cashier: string;
  refundedAt?: string;
}

export interface HeldOrder {
  id: string;
  timestamp: string;
  customerName: string;
  orderType: OrderType;
  cart: CartItem[];
  globalDiscount: number;
  total: number;
}

export interface StoreSettings {
  storeName: string;
  address: string;
  phone: string;
  cashierName: string;
  enableTax: boolean;
  taxRate: number;
  receiptFooter: string;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface TopProductMetric {
  name: string;
  qty: number;
  revenue: number;
}

export interface ReportMetrics {
  grossSales: number;
  refunds: number;
  netSales: number;
  grossProfit: number;
  totalTax: number;
  completedCount: number;
  topProducts: TopProductMetric[];
  categorySalesMap: Record<string, number>;
  paymentMethodMap: Record<string, number>;
}
