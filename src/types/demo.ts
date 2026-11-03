export type PaymentStatus = 'Belum Bayar' | 'DP' | 'Lunas';
export type ProductionStatus = 'Baru' | 'Diproses' | 'Selesai';
export type GarmentItemType = 'Kemeja' | 'Kaos Sablon' | 'Jaket' | 'Seragam';

export interface Customer {
  id: string;
  name: string;
  organization: string;
  whatsapp: string;
}

export interface Order {
  id: string;
  date: string; // ISO format: YYYY-MM-DD
  customerId: string;
  customerName: string;
  itemType: GarmentItemType;
  itemDetail: string;
  qty: number;
  unitPrice: number;
  total: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  productionStatus: ProductionStatus;
}

export interface NewOrderInput {
  customerId?: string;
  customerName: string;
  customerOrganization?: string;
  customerWhatsapp: string;
  itemType: GarmentItemType;
  itemDetail: string;
  qty: number;
  unitPrice: number;
  dpAmount: number;
}

export interface CustomerSummary extends Customer {
  totalOrders: number;
  totalSpend: number;
  totalPaid: number;
  totalReceivable: number;
  lastOrderDate: string;
  orders: Order[];
}

export interface MonthlyReportRow {
  monthKey: string; // e.g. "2026-10" or "2026-11"
  monthLabel: string; // e.g. "Oktober 2026"
  orderCount: number;
  totalOrderValue: number;
  totalRevenuePaid: number;
  totalReceivable: number;
}

