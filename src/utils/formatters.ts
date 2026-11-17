import { Transaction } from '../types/pos';

// Helper Format Rupiah
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Helper Format Tanggal
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Export CSV Laporan Transaksi
export const exportTransactionsToCSV = (transactions: Transaction[], onComplete?: () => void): void => {
  const headers = ['ID Transaksi', 'Waktu', 'Pelanggan', 'Tipe Pesanan', 'Metode Bayar', 'Subtotal', 'Diskon', 'Pajak', 'Total', 'Status'];
  const rows = transactions.map((t) => [
    t.id,
    formatDateTime(t.timestamp),
    `"${t.customerName}"`,
    t.orderType,
    t.paymentMethod,
    t.subtotal,
    t.discount,
    t.tax,
    t.total,
    t.status
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Laporan_POS_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (onComplete) {
    onComplete();
  }
};
