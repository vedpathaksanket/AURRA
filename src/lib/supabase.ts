import { createClient } from '@supabase/supabase-js';
import { CustomerOrder, WatchProduct, SupportTicket, CustomerFeedback } from '../types/watch';

// Helper to normalize Supabase URL safely
export function normalizeSupabaseUrl(raw?: string): string {
  const defaultUrl = 'https://hsiaaqrxypjxyofhbdcc.supabase.co';
  if (!raw || typeof raw !== 'string') return defaultUrl;
  const trimmed = raw.trim();
  if (!trimmed) return defaultUrl;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const cleanId = trimmed.replace(/[^a-zA-Z0-9-]/g, '');
  if (cleanId) {
    return `https://${cleanId}.supabase.co`;
  }
  return defaultUrl;
}

export function normalizeSupabaseKey(raw?: string): string {
  const defaultKey = 'sb_publishable_xKPNMd4tz6mJIN5gsf1FZA_vMndCMWK';
  if (!raw || typeof raw !== 'string') return defaultKey;
  const trimmed = raw.trim();
  return trimmed || defaultKey;
}

export const SUPABASE_URL = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
export const SUPABASE_ANON_KEY = normalizeSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

function createSafeSupabaseClient() {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('Warning: Could not initialize Supabase browser client:', err);
    return {
      from: (_table: string) => ({
        select: () => ({
          limit: async () => ({ data: [], error: { code: 'FALLBACK', message: 'Client fallback' } }),
        }),
        insert: async () => ({ data: null, error: null }),
        upsert: async () => ({ data: null, error: null }),
      }),
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    } as unknown as ReturnType<typeof createClient>;
  }
}

export const supabase = createSafeSupabaseClient();

export interface PaymentTransactionRecord {
  id?: string;
  order_id: string;
  order_number: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at?: string;
}

/**
 * Checks connection health to the configured Supabase instance
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  url: string;
  error?: string;
  tablesAvailable?: {
    orders: boolean;
    payments: boolean;
    products: boolean;
    tickets: boolean;
  };
}> {
  try {
    // Attempt a lightweight probe against orders or auth
    const { error: ordersErr } = await supabase.from('orders').select('id').limit(1);
    const { error: paymentsErr } = await supabase.from('payments').select('id').limit(1);
    const { error: productsErr } = await supabase.from('products').select('id').limit(1);
    const { error: ticketsErr } = await supabase.from('support_tickets').select('id').limit(1);

    const tablesAvailable = {
      orders: !ordersErr || ordersErr.code !== '42P01', // 42P01 is table does not exist
      payments: !paymentsErr || paymentsErr.code !== '42P01',
      products: !productsErr || productsErr.code !== '42P01',
      tickets: !ticketsErr || ticketsErr.code !== '42P01',
    };

    return {
      connected: true,
      url: SUPABASE_URL,
      tablesAvailable,
    };
  } catch (err: any) {
    return {
      connected: false,
      url: SUPABASE_URL,
      error: err?.message || 'Failed to connect to Supabase',
    };
  }
}

/**
 * Records an order and its payment gateway details directly to Supabase
 */
export async function persistOrderToSupabase(
  order: CustomerOrder,
  paymentDetails?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Insert into orders table
    const orderPayload = {
      order_id: order.id,
      order_number: order.orderNumber,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      shipping_address: order.shippingAddress,
      items: order.items,
      subtotal: order.subtotal,
      discount_amount: order.discountAmount,
      coupon_code: order.couponCode || null,
      gst_amount: order.gstAmount,
      shipping_fee: order.shippingFee,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      tracking_number: order.trackingNumber,
      courier_partner: order.courierPartner,
      timeline: order.timeline,
      created_at: order.orderDate || new Date().toISOString(),
    };

    const { error: orderError } = await supabase.from('orders').upsert([orderPayload], {
      onConflict: 'order_number',
    });

    if (orderError) {
      console.warn('Supabase orders table upsert notice (fallback to local storage):', orderError.message);
    }

    // 2. Insert into payments table (payment gateway ledger)
    const paymentPayload: PaymentTransactionRecord = {
      order_id: order.id,
      order_number: order.orderNumber,
      amount: order.totalAmount,
      currency: 'INR',
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      razorpay_order_id: paymentDetails?.razorpayOrderId,
      razorpay_payment_id: paymentDetails?.razorpayPaymentId,
      razorpay_signature: paymentDetails?.razorpaySignature,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      created_at: new Date().toISOString(),
    };

    const { error: paymentError } = await supabase.from('payments').insert([paymentPayload]);
    if (paymentError) {
      console.warn('Supabase payments table insert notice:', paymentError.message);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to sync order to Supabase:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Persists a support ticket to Supabase
 */
export async function persistTicketToSupabase(ticket: SupportTicket): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      ticket_id: ticket.id,
      ticket_number: ticket.ticketNumber,
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail,
      order_number: ticket.orderNumber || null,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      assigned_agent: ticket.assignedAgent,
      messages: ticket.messages,
      created_at: ticket.createdAt,
      updated_at: ticket.updatedAt,
    };

    const { error } = await supabase.from('support_tickets').upsert([payload], {
      onConflict: 'ticket_number',
    });

    if (error) {
      console.warn('Supabase support_tickets notice:', error.message);
    }
    return { success: !error, error: error?.message };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Persists customer feedback to Supabase
 */
export async function persistFeedbackToSupabase(feedback: CustomerFeedback): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      feedback_id: feedback.id,
      ticket_ref: feedback.ticketRef,
      customer_name: feedback.customerName,
      customer_email: feedback.customerEmail,
      customer_phone: feedback.customerPhone || null,
      order_number: feedback.orderNumber || null,
      category: feedback.category,
      overall_rating: feedback.overallRating,
      feedback_text: feedback.feedbackText,
      submitted_at: feedback.submittedAt,
      status: feedback.status,
    };

    const { error } = await supabase.from('customer_feedback').upsert([payload], {
      onConflict: 'ticket_ref',
    });

    if (error) {
      console.warn('Supabase customer_feedback notice:', error.message);
    }
    return { success: !error, error: error?.message };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Records an individual payment transaction to Supabase payments table
 */
export async function recordPaymentTransaction(
  record: PaymentTransactionRecord
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      order_id: record.order_id,
      order_number: record.order_number,
      amount: record.amount,
      currency: record.currency || 'INR',
      payment_method: record.payment_method,
      payment_status: record.payment_status,
      razorpay_order_id: record.razorpay_order_id || null,
      razorpay_payment_id: record.razorpay_payment_id || null,
      razorpay_signature: record.razorpay_signature || null,
      customer_name: record.customer_name || null,
      customer_email: record.customer_email || null,
      customer_phone: record.customer_phone || null,
      created_at: record.created_at || new Date().toISOString(),
    };

    const { error } = await supabase.from('payments').insert([payload]);
    if (error) {
      console.warn('Supabase payment transaction logging notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Syncs the watch product catalog to Supabase
 */
export async function syncProductsToSupabase(products: WatchProduct[]): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const payloads = products.map((p) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      sku: p.sku,
      collection: p.collection,
      category: p.category,
      gender: p.gender,
      price: p.price,
      mrp: p.mrp,
      purchase_cost: p.purchaseCost,
      landed_cost: p.landedCost,
      margin_percent: p.marginPercent,
      description: p.description,
      features: p.features,
      specs: {
        movement: p.movement,
        caseSpecs: p.caseSpecs,
        warrantyYears: p.warrantyYears,
      },
      image: p.image,
      gallery_images: p.galleryImages,
      variants: p.variants,
      status: p.status,
      rating: p.rating,
      review_count: p.reviewCount,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('products').upsert(payloads, {
      onConflict: 'id',
    });

    if (error) {
      console.warn('Supabase products table upsert notice:', error.message);
      return { success: false, count: 0, error: error.message };
    }

    return { success: true, count: payloads.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message };
  }
}

/**
 * Fetches latest orders from Supabase
 */
export async function fetchOrdersFromSupabase(): Promise<CustomerOrder[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) return null;

    return data.map((d: any) => ({
      id: d.order_id || d.id,
      orderNumber: d.order_number,
      orderDate: d.created_at,
      customerName: d.customer_name,
      customerEmail: d.customer_email,
      customerPhone: d.customer_phone,
      shippingAddress: d.shipping_address,
      items: d.items,
      subtotal: Number(d.subtotal),
      discountAmount: Number(d.discount_amount || 0),
      couponCode: d.coupon_code,
      gstAmount: Number(d.gst_amount),
      shippingFee: Number(d.shipping_fee || 0),
      totalAmount: Number(d.total_amount),
      paymentMethod: d.payment_method,
      paymentStatus: d.payment_status,
      orderStatus: d.order_status,
      trackingNumber: d.tracking_number,
      courierPartner: d.courier_partner,
      timeline: d.timeline || [],
    }));
  } catch {
    return null;
  }
}

/**
 * Fetches latest payment transactions from Supabase payments ledger
 */
export async function fetchPaymentsFromSupabase(): Promise<PaymentTransactionRecord[] | null> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Comprehensive sync of all local and state data to Supabase
 */
export async function syncAllStoreDataToSupabase(data: {
  products: WatchProduct[];
  orders: CustomerOrder[];
  tickets: SupportTicket[];
  feedback: CustomerFeedback[];
}): Promise<{
  success: boolean;
  counts: { products: number; orders: number; tickets: number; feedback: number };
  errors: string[];
}> {
  const counts = { products: 0, orders: 0, tickets: 0, feedback: 0 };
  const errors: string[] = [];

  // 1. Sync Products
  const prodRes = await syncProductsToSupabase(data.products);
  if (prodRes.success) counts.products = prodRes.count;
  else if (prodRes.error) errors.push(`Products: ${prodRes.error}`);

  // 2. Sync Orders & Payments
  for (const order of data.orders) {
    const ordRes = await persistOrderToSupabase(order);
    if (ordRes.success) counts.orders += 1;
    else if (ordRes.error && !errors.includes(`Orders: ${ordRes.error}`)) {
      errors.push(`Orders: ${ordRes.error}`);
    }
  }

  // 3. Sync Tickets
  for (const ticket of data.tickets) {
    const tRes = await persistTicketToSupabase(ticket);
    if (tRes.success) counts.tickets += 1;
  }

  // 4. Sync Feedback
  for (const fb of data.feedback) {
    const fbRes = await persistFeedbackToSupabase(fb);
    if (fbRes.success) counts.feedback += 1;
  }

  return {
    success: errors.length === 0,
    counts,
    errors,
  };
}

/**
 * Returns SQL snippet to execute in the Supabase SQL editor
 */
export function getSupabaseSqlSchema(): string {
  return `-- ===================================================
-- AURRA HOROLOGY - SUPABASE SCHEMA & PAYMENT GATEWAY LEDGER
-- Run this in your Supabase SQL Editor: https://hsiaaqrxypjxyofhbdcc.supabase.co
-- ===================================================

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    discount_amount NUMERIC DEFAULT 0,
    coupon_code TEXT,
    gst_amount NUMERIC NOT NULL,
    shipping_fee NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    order_status TEXT NOT NULL,
    tracking_number TEXT,
    courier_partner TEXT,
    timeline JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Payments Table (Razorpay & COD Gateway Ledger)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT,
    order_number TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT,
    ticket_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    order_number TEXT,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    assigned_agent TEXT,
    messages JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Customer Feedback Table
CREATE TABLE IF NOT EXISTS public.customer_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id TEXT,
    ticket_ref TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    order_number TEXT,
    category TEXT NOT NULL,
    overall_rating INT NOT NULL,
    feedback_text TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'New'
);

-- 5. Products Catalog Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    collection TEXT,
    price NUMERIC NOT NULL,
    mrp NUMERIC NOT NULL,
    purchase_cost NUMERIC,
    landed_cost NUMERIC,
    margin_percent NUMERIC,
    description TEXT,
    features JSONB,
    specs JSONB,
    images JSONB,
    variants JSONB,
    is_bestseller BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) with public access policies for anon client demo
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anon read & write for storefront demo
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public select on orders" ON public.orders FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow public insert on payments" ON public.payments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public select on payments" ON public.payments FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public insert on support_tickets" ON public.support_tickets FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public select on support_tickets" ON public.support_tickets FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public insert on customer_feedback" ON public.customer_feedback FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public select on customer_feedback" ON public.customer_feedback FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public insert on products" ON public.products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public select on products" ON public.products FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public update on products" ON public.products FOR UPDATE TO anon USING (true);
`;
}
