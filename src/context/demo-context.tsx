'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import initialData from '../../data/demo.json';
import {
  Customer,
  Order,
  NewOrderInput,
  PaymentStatus,
  ProductionStatus,
  CustomerSummary,
  MonthlyReportRow,
} from '@/types/demo';

interface DemoContextType {
  isInitialized: boolean;
  isDemoLoggedIn: boolean;
  orders: Order[];
  customers: Customer[];
  customerSummaries: CustomerSummary[];
  selectedCustomerForDrawer: CustomerSummary | null;
  isAddOrderModalOpen: boolean;
  
  // Actions
  loginAsDemo: () => void;
  logoutDemo: () => void;
  addOrder: (input: NewOrderInput) => Order;
  cyclePaymentStatus: (orderId: string) => void;
  setPaymentStatus: (orderId: string, status: PaymentStatus) => void;
  cycleProductionStatus: (orderId: string) => void;
  setProductionStatus: (orderId: string, status: ProductionStatus) => void;
  resetDemoData: () => void;
  openCustomerDrawer: (customerId: string) => void;
  closeCustomerDrawer: () => void;
  openAddOrderModal: () => void;
  closeAddOrderModal: () => void;

  // Derived Metrics
  dashboardKpi: {
    totalOrdersThisMonth: number;
    totalPcsThisMonth: number;
    unpaidOrdersThisMonthCount: number;
    unpaidOrdersReceivableMonth: number;
    revenueThisMonth: number;
    totalValueThisMonth: number;
    activeCustomersCount: number;
    repeatCustomersCount: number;
  };
  reportsData: {
    totalAllOrderValue: number;
    totalAllRevenuePaid: number;
    totalAllReceivable: number;
    monthlyRows: MonthlyReportRow[];
    followUpOrders: Order[];
  };
  recentOrders: Order[];
}

const DemoContext = createContext<DemoContextType | null>(null);

const STORAGE_KEY_ORDERS = 'nalar_berkah_jaya_orders_v1';
const STORAGE_KEY_CUSTOMERS = 'nalar_berkah_jaya_customers_v1';
const STORAGE_KEY_AUTH = 'nalar_berkah_jaya_auth_v1';

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDemoLoggedIn, setIsDemoLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);

  // Initialize from localStorage or fallback to static demo.json
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (storedAuth === 'true') {
        setIsDemoLoggedIn(true);
      }

      const storedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      const storedCustomers = localStorage.getItem(STORAGE_KEY_CUSTOMERS);

      if (storedOrders && storedCustomers) {
        setOrders(JSON.parse(storedOrders));
        setCustomers(JSON.parse(storedCustomers));
      } else {
        setOrders(initialData.orders as Order[]);
        setCustomers(initialData.customers as Customer[]);
      }
    } catch {
      setOrders(initialData.orders as Order[]);
      setCustomers(initialData.customers as Customer[]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to localStorage
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedOrders));
    } catch (err) {
      console.error('Failed to save orders to localStorage', err);
    }
  };

  const saveCustomers = (updatedCustomers: Customer[]) => {
    setCustomers(updatedCustomers);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(updatedCustomers));
    } catch (err) {
      console.error('Failed to save customers to localStorage', err);
    }
  };

  const loginAsDemo = () => {
    setIsDemoLoggedIn(true);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    } catch {}
  };

  const logoutDemo = () => {
    setIsDemoLoggedIn(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {}
  };

  const resetDemoData = () => {
    const rawOrders = initialData.orders as Order[];
    const rawCustomers = initialData.customers as Customer[];
    setOrders(rawOrders);
    setCustomers(rawCustomers);
    setSelectedCustomerId(null);
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(rawOrders));
      localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(rawCustomers));
    } catch (err) {
      console.error('Failed to reset localStorage demo data', err);
    }
  };

  const addOrder = (input: NewOrderInput): Order => {
    const total = Math.round(input.qty * input.unitPrice);
    const amountPaid = Math.min(Math.max(0, Math.round(input.dpAmount)), total);
    
    let paymentStatus: PaymentStatus = 'Belum Bayar';
    if (amountPaid >= total) {
      paymentStatus = 'Lunas';
    } else if (amountPaid > 0) {
      paymentStatus = 'DP';
    }

    let customerId = input.customerId;
    let customerName = input.customerName.trim();
    let updatedCustomers = [...customers];

    if (!customerId) {
      // Find by exact name or generate new customer
      const existing = customers.find(
        (c) => c.name.toLowerCase() === customerName.toLowerCase()
      );
      if (existing) {
        customerId = existing.id;
        customerName = existing.name;
      } else {
        const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
        const newCustomer: Customer = {
          id: newId,
          name: customerName,
          organization: input.customerOrganization?.trim() || 'Pelanggan Umum',
          whatsapp: input.customerWhatsapp.trim() || '081234567890',
        };
        updatedCustomers = [newCustomer, ...customers];
        saveCustomers(updatedCustomers);
        customerId = newId;
      }
    }

    const nextOrderNum = orders.length + 1;
    const newOrderId = `ORD-2611-${String(nextOrderNum).padStart(3, '0')}`;
    const today = '2026-11-04';

    const newOrder: Order = {
      id: newOrderId,
      date: today,
      customerId,
      customerName,
      itemType: input.itemType,
      itemDetail: input.itemDetail.trim() || `${input.itemType} Custom Konveksi`,
      qty: input.qty,
      unitPrice: input.unitPrice,
      total,
      amountPaid,
      paymentStatus,
      productionStatus: 'Baru',
    };

    const nextOrders = [newOrder, ...orders];
    saveOrders(nextOrders);
    setIsAddOrderModalOpen(false);
    return newOrder;
  };

  const cyclePaymentStatus = (orderId: string) => {
    const nextOrders = orders.map((o) => {
      if (o.id !== orderId) return o;
      if (o.paymentStatus === 'Belum Bayar') {
        const dpVal = Math.round(o.total * 0.5);
        return {
          ...o,
          paymentStatus: 'DP' as PaymentStatus,
          amountPaid: dpVal,
        };
      }
      if (o.paymentStatus === 'DP') {
        return {
          ...o,
          paymentStatus: 'Lunas' as PaymentStatus,
          amountPaid: o.total,
        };
      }
      return {
        ...o,
        paymentStatus: 'Belum Bayar' as PaymentStatus,
        amountPaid: 0,
      };
    });
    saveOrders(nextOrders);
  };

  const setPaymentStatus = (orderId: string, status: PaymentStatus) => {
    const nextOrders = orders.map((o) => {
      if (o.id !== orderId) return o;
      let amountPaid = o.amountPaid;
      if (status === 'Lunas') amountPaid = o.total;
      else if (status === 'Belum Bayar') amountPaid = 0;
      else if (status === 'DP') {
        amountPaid = o.amountPaid > 0 && o.amountPaid < o.total ? o.amountPaid : Math.round(o.total * 0.5);
      }
      return {
        ...o,
        paymentStatus: status,
        amountPaid,
      };
    });
    saveOrders(nextOrders);
  };

  const cycleProductionStatus = (orderId: string) => {
    const nextOrders = orders.map((o) => {
      if (o.id !== orderId) return o;
      let nextStatus: ProductionStatus = 'Diproses';
      if (o.productionStatus === 'Baru') nextStatus = 'Diproses';
      else if (o.productionStatus === 'Diproses') nextStatus = 'Selesai';
      else nextStatus = 'Baru';
      return {
        ...o,
        productionStatus: nextStatus,
      };
    });
    saveOrders(nextOrders);
  };

  const setProductionStatus = (orderId: string, status: ProductionStatus) => {
    const nextOrders = orders.map((o) => {
      if (o.id !== orderId) return o;
      return { ...o, productionStatus: status };
    });
    saveOrders(nextOrders);
  };

  // Customer summaries
  const customerSummaries = useMemo(() => {
    return customers.map((c) => {
      const custOrders = orders.filter((o) => o.customerId === c.id || o.customerName === c.name);
      const totalSpend = custOrders.reduce((sum, o) => sum + o.total, 0);
      const totalPaid = custOrders.reduce((sum, o) => sum + o.amountPaid, 0);
      const totalReceivable = custOrders.reduce((sum, o) => sum + (o.total - o.amountPaid), 0);
      
      const sortedByDate = [...custOrders].sort((a, b) => b.date.localeCompare(a.date));
      const lastOrderDate = sortedByDate.length > 0 ? sortedByDate[0].date : '-';

      return {
        ...c,
        totalOrders: custOrders.length,
        totalSpend,
        totalPaid,
        totalReceivable,
        lastOrderDate,
        orders: sortedByDate,
      };
    });
  }, [customers, orders]);

  const selectedCustomerForDrawer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return customerSummaries.find((cs) => cs.id === selectedCustomerId) || null;
  }, [selectedCustomerId, customerSummaries]);

  // Dashboard KPI Metrics (November 2026 current month)
  const dashboardKpi = useMemo(() => {
    const currentMonthOrders = orders.filter((o) => o.date.startsWith('2026-11'));
    const totalOrdersThisMonth = currentMonthOrders.length;
    const totalPcsThisMonth = currentMonthOrders.reduce((sum, o) => sum + o.qty, 0);
    const unpaidList = currentMonthOrders.filter((o) => o.paymentStatus !== 'Lunas');
    const unpaidOrdersThisMonthCount = unpaidList.length;
    const unpaidOrdersReceivableMonth = unpaidList.reduce((sum, o) => sum + (o.total - o.amountPaid), 0);
    const revenueThisMonth = currentMonthOrders.reduce((sum, o) => sum + o.amountPaid, 0);
    const totalValueThisMonth = currentMonthOrders.reduce((sum, o) => sum + o.total, 0);

    const activeCustomerIds = new Set(orders.map((o) => o.customerId));
    const activeCustomersCount = activeCustomerIds.size;

    const repeatCustomersCount = customerSummaries.filter((cs) => cs.totalOrders > 1).length;

    return {
      totalOrdersThisMonth,
      totalPcsThisMonth,
      unpaidOrdersThisMonthCount,
      unpaidOrdersReceivableMonth,
      revenueThisMonth,
      totalValueThisMonth,
      activeCustomersCount,
      repeatCustomersCount,
    };
  }, [orders, customerSummaries]);

  // Reports data
  const reportsData = useMemo(() => {
    const totalAllOrderValue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalAllRevenuePaid = orders.reduce((sum, o) => sum + o.amountPaid, 0);
    const totalAllReceivable = orders.reduce((sum, o) => sum + (o.total - o.amountPaid), 0);

    // Assert reconciliation strictly
    if (orders.length > 0) {
      console.assert(
        totalAllRevenuePaid + totalAllReceivable === totalAllOrderValue,
        `Reconciliation mismatch: Paid (${totalAllRevenuePaid}) + Receivable (${totalAllReceivable}) !== Total (${totalAllOrderValue})`
      );
    }

    // Monthly breakdown: 2026-10 vs 2026-11
    const months = ['2026-10', '2026-11'];
    const monthlyRows: MonthlyReportRow[] = months.map((mKey) => {
      const monthOrders = orders.filter((o) => o.date.startsWith(mKey));
      const orderCount = monthOrders.length;
      const totalOrderValue = monthOrders.reduce((sum, o) => sum + o.total, 0);
      const totalRevenuePaid = monthOrders.reduce((sum, o) => sum + o.amountPaid, 0);
      const totalReceivable = monthOrders.reduce((sum, o) => sum + (o.total - o.amountPaid), 0);
      const monthLabel = mKey === '2026-10' ? 'Oktober 2026' : 'November 2026';
      return {
        monthKey: mKey,
        monthLabel,
        orderCount,
        totalOrderValue,
        totalRevenuePaid,
        totalReceivable,
      };
    });

    // Orders requiring follow-up (Belum Bayar or DP), sorted oldest first (date ascending)
    const followUpOrders = orders
      .filter((o) => o.paymentStatus !== 'Lunas')
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalAllOrderValue,
      totalAllRevenuePaid,
      totalAllReceivable,
      monthlyRows,
      followUpOrders,
    };
  }, [orders]);

  // Recent 5 orders for dashboard
  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [orders]);

  const value: DemoContextType = {
    isInitialized,
    isDemoLoggedIn,
    orders,
    customers,
    customerSummaries,
    selectedCustomerForDrawer,
    isAddOrderModalOpen,
    loginAsDemo,
    logoutDemo,
    addOrder,
    cyclePaymentStatus,
    setPaymentStatus,
    cycleProductionStatus,
    setProductionStatus,
    resetDemoData,
    openCustomerDrawer: (id: string) => setSelectedCustomerId(id),
    closeCustomerDrawer: () => setSelectedCustomerId(null),
    openAddOrderModal: () => setIsAddOrderModalOpen(true),
    closeAddOrderModal: () => setIsAddOrderModalOpen(false),
    dashboardKpi,
    reportsData,
    recentOrders,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoDataProvider');
  }
  return context;
}
