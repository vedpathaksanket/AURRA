import {
  WatchProduct,
  Supplier,
  PurchaseOrder,
  QCInspection,
  CustomerOrder,
  CustomerReview,
  CustomerFeedback,
  SupportTicket,
  BusinessExpense,
  MarketingCampaign,
  Coupon,
  ComplianceItem,
  OrderItem
} from '../types/watch';
import {
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_QC_LOGS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_FEEDBACK,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_EXPENSES,
  INITIAL_CAMPAIGNS,
  INITIAL_COUPONS,
  INITIAL_COMPLIANCE
} from '../data/mockDatabase';
import {
  persistOrderToSupabase,
  persistTicketToSupabase,
  persistFeedbackToSupabase,
  supabase
} from '../lib/supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'aurra_products_v1',
  SUPPLIERS: 'aurra_suppliers_v1',
  POS: 'aurra_pos_v1',
  QC: 'aurra_qc_v1',
  ORDERS: 'aurra_orders_v1',
  REVIEWS: 'aurra_reviews_v1',
  FEEDBACK: 'aurra_feedback_v1',
  TICKETS: 'aurra_tickets_v1',
  EXPENSES: 'aurra_expenses_v1',
  CAMPAIGNS: 'aurra_campaigns_v1',
  COUPONS: 'aurra_coupons_v1',
  COMPLIANCE: 'aurra_compliance_v1',
  CART: 'aurra_cart_v1',
  WISHLIST: 'aurra_wishlist_v1',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or SSR
  }
}

export class StoreService {
  // Products
  static getProducts(): WatchProduct[] {
    const stored = getStored<WatchProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    let changed = false;
    INITIAL_PRODUCTS.forEach((initP) => {
      if (!stored.some((p) => p.id === initP.id)) {
        stored.push(initP);
        changed = true;
      }
    });
    if (changed) {
      setStored(STORAGE_KEYS.PRODUCTS, stored);
    }
    return stored;
  }

  static getProductById(id: string): WatchProduct | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  static updateProduct(product: WatchProduct): void {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      products[idx] = product;
    } else {
      products.push(product);
    }
    setStored(STORAGE_KEYS.PRODUCTS, products);
  }

  // Suppliers
  static getSuppliers(): Supplier[] {
    return getStored<Supplier[]>(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  }

  static addSupplier(supplier: Supplier): void {
    const list = this.getSuppliers();
    list.unshift(supplier);
    setStored(STORAGE_KEYS.SUPPLIERS, list);
  }

  // Purchase Orders
  static getPurchaseOrders(): PurchaseOrder[] {
    return getStored<PurchaseOrder[]>(STORAGE_KEYS.POS, INITIAL_PURCHASE_ORDERS);
  }

  static createPurchaseOrder(po: PurchaseOrder): void {
    const list = this.getPurchaseOrders();
    list.unshift(po);
    setStored(STORAGE_KEYS.POS, list);
  }

  static receivePOItems(poId: string, receivedMap: Record<string, { received: number; damaged: number }>): void {
    const pos = this.getPurchaseOrders();
    const po = pos.find((p) => p.id === poId);
    if (!po) return;

    const products = this.getProducts();

    po.items.forEach((item) => {
      const rec = receivedMap[item.sku];
      if (rec) {
        item.receivedQty = (item.receivedQty || 0) + rec.received;
        item.damagedQty = (item.damagedQty || 0) + rec.damaged;

        // Increase product stock for non-damaged received items
        const prod = products.find((p) => p.sku === item.sku || p.id === item.productId);
        if (prod) {
          if (prod.variants && prod.variants.length > 0) {
            const v = prod.variants.find((v) => v.sku === item.sku) || prod.variants[0];
            v.stockQuantity += rec.received;
          }
        }
      }
    });

    const allReceived = po.items.every((it) => it.receivedQty >= it.orderedQty);
    po.status = allReceived ? 'Received' : 'Partially Received';

    setStored(STORAGE_KEYS.POS, pos);
    setStored(STORAGE_KEYS.PRODUCTS, products);
  }

  // Quality Control
  static getQCLogs(): QCInspection[] {
    return getStored<QCInspection[]>(STORAGE_KEYS.QC, INITIAL_QC_LOGS);
  }

  static logQCInspection(inspection: QCInspection): void {
    const list = this.getQCLogs();
    list.unshift(inspection);
    setStored(STORAGE_KEYS.QC, list);
  }

  // Orders
  static getOrders(): CustomerOrder[] {
    return getStored<CustomerOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  static createOrder(order: CustomerOrder, paymentDetails?: { razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string }): void {
    const orders = this.getOrders();
    orders.unshift(order);
    setStored(STORAGE_KEYS.ORDERS, orders);

    // Deduct available stock & increment reserved/sold
    const products = this.getProducts();
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId || p.sku === item.sku);
      if (prod && prod.variants && prod.variants.length > 0) {
        const v = prod.variants.find((vr) => vr.sku === item.sku) || prod.variants[0];
        v.stockQuantity = Math.max(0, v.stockQuantity - item.quantity);
      }
    });
    setStored(STORAGE_KEYS.PRODUCTS, products);

    // Persist to Supabase Database and Payment Gateway Ledger
    persistOrderToSupabase(order, paymentDetails).catch((err) => {
      console.warn('Supabase order client persistence notice:', err);
    });

    // Also post to server-side sync endpoint for robust dual persistence
    try {
      fetch('/api/v1/orders/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, paymentDetails })
      }).catch((e) => console.warn('Backend order sync notice:', e));
    } catch {
      // ignore offline
    }
  }

  static updateOrderStatus(orderId: string, status: CustomerOrder['orderStatus'], description?: string): void {
    const orders = this.getOrders();
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;

    ord.orderStatus = status;
    ord.timeline.push({
      status: `Status changed to ${status}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: description || `Operational status updated to ${status}`
    });

    setStored(STORAGE_KEYS.ORDERS, orders);
  }

  // Reviews
  static getReviews(): CustomerReview[] {
    return getStored<CustomerReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static addReview(review: CustomerReview): void {
    const list = this.getReviews();
    list.unshift(review);
    setStored(STORAGE_KEYS.REVIEWS, list);
  }

  // Feedback
  static getFeedback(): CustomerFeedback[] {
    return getStored<CustomerFeedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
  }

  static submitFeedback(feedback: CustomerFeedback): void {
    const list = this.getFeedback();
    list.unshift(feedback);
    setStored(STORAGE_KEYS.FEEDBACK, list);

    persistFeedbackToSupabase(feedback).catch((err) => {
      console.warn('Supabase feedback persistence deferred/offline:', err);
    });
  }

  // Support Tickets
  static getTickets(): SupportTicket[] {
    return getStored<SupportTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_SUPPORT_TICKETS);
  }

  static createTicket(ticket: SupportTicket): void {
    const list = this.getTickets();
    list.unshift(ticket);
    setStored(STORAGE_KEYS.TICKETS, list);

    persistTicketToSupabase(ticket).catch((err) => {
      console.warn('Supabase ticket persistence deferred/offline:', err);
    });
  }

  static addTicketMessage(ticketId: string, message: SupportTicket['messages'][0]): void {
    const tickets = this.getTickets();
    const t = tickets.find((tk) => tk.id === ticketId);
    if (!t) return;

    t.messages.push(message);
    t.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setStored(STORAGE_KEYS.TICKETS, tickets);
  }

  static updateTicketStatus(ticketId: string, status: SupportTicket['status']): void {
    const tickets = this.getTickets();
    const t = tickets.find((tk) => tk.id === ticketId);
    if (!t) return;
    t.status = status;
    t.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setStored(STORAGE_KEYS.TICKETS, tickets);
  }

  // Expenses
  static getExpenses(): BusinessExpense[] {
    return getStored<BusinessExpense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  }

  static addExpense(expense: BusinessExpense): void {
    const list = this.getExpenses();
    list.unshift(expense);
    setStored(STORAGE_KEYS.EXPENSES, list);
  }

  // Campaigns
  static getCampaigns(): MarketingCampaign[] {
    return getStored<MarketingCampaign[]>(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  }

  // Coupons
  static getCoupons(): Coupon[] {
    return getStored<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  static addCoupon(coupon: Coupon): void {
    const list = this.getCoupons();
    list.unshift(coupon);
    setStored(STORAGE_KEYS.COUPONS, list);
  }

  static validateCoupon(code: string, cartTotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.getCoupons().find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or inactive coupon code.' };
    }

    if (cartTotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue.toLocaleString('en-IN')}`
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      discount: Math.round(discount),
      message: `Coupon ${coupon.code} applied successfully!`,
      coupon
    };
  }

  // Compliance
  static getComplianceItems(): ComplianceItem[] {
    return getStored<ComplianceItem[]>(STORAGE_KEYS.COMPLIANCE, INITIAL_COMPLIANCE);
  }

  // Cart
  static getCart(): OrderItem[] {
    return getStored<OrderItem[]>(STORAGE_KEYS.CART, []);
  }

  static setCart(cart: OrderItem[]): void {
    setStored(STORAGE_KEYS.CART, cart);
  }

  // Wishlist
  static getWishlist(): string[] {
    return getStored<string[]>(STORAGE_KEYS.WISHLIST, ['prod-chrono-royale']);
  }

  static toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const idx = list.indexOf(productId);
    let added = false;
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(productId);
      added = true;
    }
    setStored(STORAGE_KEYS.WISHLIST, list);
    return added;
  }

  // Calculations for Financial Dashboard
  static getFinancialSummary() {
    const orders = this.getOrders();
    const completedOrders = orders.filter((o) => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Returned');

    const grossSales = completedOrders.reduce((sum, o) => sum + o.subtotal, 0);
    const totalDiscounts = completedOrders.reduce((sum, o) => sum + o.discountAmount, 0);
    const netSales = grossSales - totalDiscounts;

    // Estimate COGS from product landed costs
    const products = this.getProducts();
    const prodMap = new Map(products.map((p) => [p.id, p.landedCost]));

    let totalCOGS = 0;
    completedOrders.forEach((o) => {
      o.items.forEach((item) => {
        const landed = prodMap.get(item.productId) || item.price * 0.4;
        totalCOGS += landed * item.quantity;
      });
    });

    const grossProfit = netSales - totalCOGS;
    const grossMarginPercent = netSales > 0 ? (grossProfit / netSales) * 100 : 0;

    // Expenses
    const expenses = this.getExpenses();
    const totalOperatingExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Variable delivery & payment fees
    const paymentGatewayFees = netSales * 0.02; // 2% avg Razorpay fee
    const shippingAndPackagingCosts = completedOrders.length * (110 + 95); // ~₹205 per order

    const contributionMargin = netSales - totalCOGS - paymentGatewayFees - shippingAndPackagingCosts;
    const contributionMarginPercent = netSales > 0 ? (contributionMargin / netSales) * 100 : 0;

    // Net Operating Profit
    const operatingProfit = contributionMargin - totalOperatingExpenses;

    const aov = completedOrders.length > 0 ? Math.round(netSales / completedOrders.length) : 0;

    // Inventory Valuation
    let totalInventoryValue = 0;
    let totalStockUnits = 0;
    products.forEach((p) => {
      const units = p.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 20;
      totalStockUnits += units;
      totalInventoryValue += units * p.landedCost;
    });

    return {
      grossSales: Math.round(grossSales),
      totalDiscounts: Math.round(totalDiscounts),
      netSales: Math.round(netSales),
      totalCOGS: Math.round(totalCOGS),
      grossProfit: Math.round(grossProfit),
      grossMarginPercent: Number(grossMarginPercent.toFixed(1)),
      contributionMargin: Math.round(contributionMargin),
      contributionMarginPercent: Number(contributionMarginPercent.toFixed(1)),
      totalOperatingExpenses: Math.round(totalOperatingExpenses),
      operatingProfit: Math.round(operatingProfit),
      totalOrders: completedOrders.length,
      aov,
      totalInventoryValue: Math.round(totalInventoryValue),
      totalStockUnits,
      cashPosition: 1245000 + Math.round(netSales) - Math.round(totalOperatingExpenses)
    };
  }
}
