export interface WatchVariant {
  id: string;
  sku: string;
  colorName: string;
  dialColor: string;
  dialSizeMm: number;
  strapMaterial: 'Italian Leather' | '316L Stainless Steel' | 'Ceramic & Steel' | 'Fluoroelastomer Silicone';
  strapColor: string;
  price: number;
  compareAtPrice: number;
  purchaseCost: number;
  stockQuantity: number;
  reservedQuantity: number;
}

export interface WatchProduct {
  id: string;
  name: string;
  tagline: string;
  sku: string;
  collection: 'Royale' | 'Sovereign' | 'Heritage' | 'Luna' | 'HydroStealth' | 'Minimalist';
  category: 'Chronograph' | 'Automatic' | 'Classic Dress' | 'Petite Luxury' | 'Sports Diver';
  gender: 'Men' | 'Women' | 'Unisex';
  price: number;
  compareAtPrice: number;
  mrp: number; // Maximum Retail Price
  purchaseCost: number; // Factory sourcing cost
  inboundFreight: number;
  customsDuty: number;
  qcCost: number;
  packagingCost: number;
  landedCost: number; // Total landed cost per unit
  marginPercent: number;
  status: 'Active' | 'Low Stock' | 'Draft' | 'Archived';
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  description: string;
  features: string[];
  movement: {
    type: 'Japanese Quartz Caliber' | 'Seiko NH35 Automatic' | 'Miyota Chronograph Movement' | 'Swiss Ronda Quartz';
    jewels?: number;
    powerReserveHours?: number;
    accuracy: string;
  };
  caseSpecs: {
    material: string;
    diameterMm: number;
    thicknessMm: number;
    glass: 'Anti-reflective Sapphire Crystal' | 'Hardened Mineral Crystal with Sapphire Coating';
    waterResistance: '3 ATM (30m)' | '5 ATM (50m)' | '10 ATM (100m - Diver Grade)';
  };
  warrantyYears: number;
  variants: WatchVariant[];
  supplierId: string;
}

export interface Supplier {
  id: string;
  name: string;
  legalEntity: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  gstin: string;
  category: 'Cases & Assembly' | 'Movements & Calibers' | 'Leather & Steel Straps' | 'Luxury Packaging';
  paymentTerms: 'Net 30' | 'Net 45' | '50% Advance / 50% Delivery' | 'LC at Sight';
  leadTimeDays: number;
  moq: number; // Minimum Order Quantity
  rating: number; // 1 to 5
  defectRatePercent: number;
  activeContracts: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  status: 'Draft' | 'Approved' | 'Sent to Supplier' | 'Partially Received' | 'Received' | 'Cancelled';
  totalUnits: number;
  totalProcurementCost: number;
  paidAmount: number;
  paymentStatus: 'Pending' | 'Partial' | 'Paid';
  items: {
    productId: string;
    productName: string;
    sku: string;
    orderedQty: number;
    receivedQty: number;
    damagedQty: number;
    unitCost: number;
  }[];
  notes?: string;
}

export interface QCInspection {
  id: string;
  inspectionDate: string;
  batchNumber: string;
  productId: string;
  productName: string;
  inspectorName: string;
  unitsSampled: number;
  dialAlignment: 'Pass' | 'Fail';
  handClearance: 'Pass' | 'Fail';
  caseFinishing: 'Pass' | 'Fail';
  crownFunction: 'Pass' | 'Fail';
  timekeepingAccuracy: string; // e.g. "+3s/day (PASSED)"
  waterResistanceTest: 'Pass 5 ATM' | 'Pass 10 ATM' | 'Failed Seal';
  packagingCondition: 'Pristine' | 'Minor Scuff' | 'Damaged';
  overallStatus: 'Approved' | 'Quarantined' | 'Rejected';
  notes: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  variantId?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  gstAmount: number; // 18% GST in India
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'Razorpay UPI' | 'Razorpay Card' | 'Razorpay NetBanking' | 'Cash on Delivery (COD)';
  paymentStatus: 'Completed' | 'Pending Verification' | 'Failed' | 'Refunded';
  orderStatus: 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  trackingNumber: string;
  courierPartner: 'BlueDart Express' | 'Delhivery Air' | 'Shiprocket Priority';
  timeline: {
    status: string;
    timestamp: string;
    description: string;
  }[];
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status: 'Approved' | 'Pending Review' | 'Flagged';
}

export interface CustomerFeedback {
  id: string;
  ticketRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderNumber?: string;
  category: 'Product Quality' | 'Website Experience' | 'Delivery Speed' | 'Payment Ease' | 'Customer Support' | 'General Suggestion';
  overallRating: number;
  feedbackText: string;
  submittedAt: string;
  status: 'New' | 'Reviewed' | 'Action Taken';
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  orderNumber?: string;
  category: 'Delivery Delay' | 'Product Issue / Defect' | 'Return Request' | 'Warranty Claim' | 'Payment Query' | 'General Question';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Waiting on Customer' | 'Resolved' | 'Closed';
  assignedAgent?: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'customer' | 'agent' | 'system';
    senderName: string;
    text: string;
    timestamp: string;
    isInternalNote?: boolean;
  }[];
}

export interface BusinessExpense {
  id: string;
  category: 'Performance Marketing (Meta/Google)' | 'Warehouse Rent' | 'Employee Payroll' | 'Packaging & Boxes' | 'Courier & Logistics' | 'Software & Subscriptions' | 'Photography & Studio';
  vendor: string;
  amount: number;
  date: string;
  paymentMethod: 'Bank Transfer (NEFT)' | 'Corporate Card' | 'UPI';
  invoiceRef: string;
  notes?: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: 'Instagram / Meta' | 'Google Search Ads' | 'Influencer Partnerships' | 'Email Newsletter' | 'WhatsApp Direct';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenueGenerated: number;
  roas: number; // Return on Ad Spend
  status: 'Active' | 'Paused' | 'Completed';
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiresAt: string;
  usageCount: number;
  usageLimit: number;
  isActive: boolean;
}

export interface ComplianceItem {
  id: string;
  requirement: string;
  category: 'Consumer Protection (E-Commerce)' | 'GST & Taxation' | 'Legal Metrology' | 'DPDP Privacy Act' | 'BIS Standards';
  legalSource: string;
  status: 'Fully Compliant' | 'Audited & Verified' | 'In Review';
  responsiblePerson: string;
  notes: string;
}
