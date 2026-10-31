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
  ComplianceItem
} from '../types/watch';

export const INITIAL_PRODUCTS: WatchProduct[] = [
  {
    id: 'prod-chrono-royale',
    name: 'AURRA Chrono Royale 42mm',
    tagline: 'Precision Chronograph in Obsidian Black & Champagne Gold Fluted Bezel',
    sku: 'AUR-CR-01-GLD',
    collection: 'Royale',
    category: 'Chronograph',
    gender: 'Men',
    price: 4499,
    compareAtPrice: 6999,
    mrp: 7999,
    purchaseCost: 1420,
    inboundFreight: 95,
    customsDuty: 140,
    qcCost: 45,
    packagingCost: 110,
    landedCost: 1810,
    marginPercent: 59.8,
    status: 'Active',
    rating: 4.9,
    reviewCount: 48,
    image: '/src/assets/images/aurra_hero_chronograph_1793347856312.jpg',
    galleryImages: [
      '/src/assets/images/aurra_hero_chronograph_1793347856312.jpg',
      '/src/assets/images/aurra_monaco_leather_1793347857927.jpg'
    ],
    description: 'The flagship AURRA Chrono Royale is engineered for the modern man who values commanding presence and meticulous precision. Featuring an obsidian sunburst sub-dial layout, fluted champagne gold bezel, date aperture, and an Italian embossed alligator-grain leather strap.',
    features: [
      'Multi-function 60-minute chronograph & 24-hour sub-dial',
      'Solid 316L surgical-grade stainless steel with PVD champagne gold',
      'Anti-reflective coated sapphire crystal for maximum scratch resistance',
      '5 ATM water resistance rated for everyday rain and splash confidence',
      'Genuine Italian calfskin leather strap with quick-release spring bars'
    ],
    movement: {
      type: 'Miyota Chronograph Movement',
      accuracy: '±15 seconds/month'
    },
    caseSpecs: {
      material: '316L Stainless Steel with PVD Gold Fluting',
      diameterMm: 42,
      thicknessMm: 11.2,
      glass: 'Anti-reflective Sapphire Crystal',
      waterResistance: '5 ATM (50m)'
    },
    warrantyYears: 2,
    supplierId: 'sup-apex-cases',
    variants: [
      {
        id: 'var-cr-black-gold',
        sku: 'AUR-CR-01-GLD',
        colorName: 'Obsidian Black / Gold',
        dialColor: '#111111',
        dialSizeMm: 42,
        strapMaterial: 'Italian Leather',
        strapColor: 'Obsidian Black',
        price: 4499,
        compareAtPrice: 6999,
        purchaseCost: 1420,
        stockQuantity: 42,
        reservedQuantity: 4
      },
      {
        id: 'var-cr-cognac-gold',
        sku: 'AUR-CR-02-COG',
        colorName: 'Cognac Brown / Gold',
        dialColor: '#1C1917',
        dialSizeMm: 42,
        strapMaterial: 'Italian Leather',
        strapColor: 'Cognac Brown',
        price: 4499,
        compareAtPrice: 6999,
        purchaseCost: 1420,
        stockQuantity: 18,
        reservedQuantity: 2
      }
    ]
  },
  {
    id: 'prod-sovereign-emerald',
    name: 'AURRA Sovereign Emerald 40mm',
    tagline: 'Vibrant Sunburst Emerald Dial with Brushed 316L Gold Oyster Bracelet',
    sku: 'AUR-SV-03-EMR',
    collection: 'Sovereign',
    category: 'Automatic',
    gender: 'Men',
    price: 5299,
    compareAtPrice: 8499,
    mrp: 9999,
    purchaseCost: 1850,
    inboundFreight: 110,
    customsDuty: 190,
    qcCost: 65,
    packagingCost: 125,
    landedCost: 2340,
    marginPercent: 55.8,
    status: 'Active',
    rating: 4.8,
    reviewCount: 36,
    image: '/src/assets/images/aurra_regal_gold_mens_1793347857210.jpg',
    galleryImages: [
      '/src/assets/images/aurra_regal_gold_mens_1793347857210.jpg',
      '/src/assets/images/aurra_hero_chronograph_1793347856312.jpg'
    ],
    description: 'Inspired by the regal heritage of Indian royalty reinterpreted through contemporary horological design. A brilliant radial sunburst emerald dial encased in a champagne gold fluted bezel with cyclops date magnifier.',
    features: [
      'High-grade sunburst emerald green dial with faceted indices',
      'Solid link 316L stainless steel oyster bracelet with micro-adjust clasp',
      'Cyclops date magnifier window at 3 o’clock position',
      'SuperLuminova coated hands for low-light legibility'
    ],
    movement: {
      type: 'Seiko NH35 Automatic',
      jewels: 24,
      powerReserveHours: 41,
      accuracy: '-20 to +40 seconds/day'
    },
    caseSpecs: {
      material: '316L Stainless Steel PVD Champagne Gold',
      diameterMm: 40,
      thicknessMm: 12.0,
      glass: 'Anti-reflective Sapphire Crystal',
      waterResistance: '10 ATM (100m - Diver Grade)'
    },
    warrantyYears: 2,
    supplierId: 'sup-miyota-calibers',
    variants: [
      {
        id: 'var-sv-gold-emerald',
        sku: 'AUR-SV-03-EMR',
        colorName: 'Emerald Dial / Gold Bracelet',
        dialColor: '#064E3B',
        dialSizeMm: 40,
        strapMaterial: '316L Stainless Steel',
        strapColor: 'Champagne Gold',
        price: 5299,
        compareAtPrice: 8499,
        purchaseCost: 1850,
        stockQuantity: 28,
        reservedQuantity: 3
      }
    ]
  },
  {
    id: 'prod-luna-rose',
    name: 'AURRA Luna Nacre Petite 32mm',
    tagline: 'Iridescent Natural Mother-of-Pearl Dial with Rose Gold Slender Case',
    sku: 'AUR-LN-07-RGD',
    collection: 'Luna',
    category: 'Petite Luxury',
    gender: 'Women',
    price: 3699,
    compareAtPrice: 5499,
    mrp: 5999,
    purchaseCost: 1180,
    inboundFreight: 75,
    customsDuty: 110,
    qcCost: 40,
    packagingCost: 95,
    landedCost: 1500,
    marginPercent: 59.4,
    status: 'Active',
    rating: 4.9,
    reviewCount: 52,
    image: '/src/assets/images/aurra_luna_rose_womens_1793347857336.jpg',
    galleryImages: [
      '/src/assets/images/aurra_luna_rose_womens_1793347857336.jpg'
    ],
    description: 'Graceful, understated, and radiant. The Luna Nacre features a genuine hand-cut South Sea mother-of-pearl dial that reflects ethereal pastel hues at every angle. Complemented by a blush Italian leather strap.',
    features: [
      'Genuine natural mother-of-pearl dial (each piece unique)',
      'Subtle diamond-cut hour pips in rose gold',
      'Ultra-slim 6.8mm profile engineered for effortless wrist comfort',
      'Surgical 316L steel with IP rose gold plating'
    ],
    movement: {
      type: 'Swiss Ronda Quartz',
      accuracy: '±10 seconds/month'
    },
    caseSpecs: {
      material: '316L Stainless Steel IP Rose Gold',
      diameterMm: 32,
      thicknessMm: 6.8,
      glass: 'Anti-reflective Sapphire Crystal',
      waterResistance: '3 ATM (30m)'
    },
    warrantyYears: 2,
    supplierId: 'sup-sovereign-dials',
    variants: [
      {
        id: 'var-ln-blush-rose',
        sku: 'AUR-LN-07-RGD',
        colorName: 'Blush Leather / Rose Gold',
        dialColor: '#F5E6E8',
        dialSizeMm: 32,
        strapMaterial: 'Italian Leather',
        strapColor: 'Blush Pink',
        price: 3699,
        compareAtPrice: 5499,
        purchaseCost: 1180,
        stockQuantity: 34,
        reservedQuantity: 5
      },
      {
        id: 'var-ln-mesh-rose',
        sku: 'AUR-LN-08-MSH',
        colorName: 'Milanese Mesh / Rose Gold',
        dialColor: '#FFFFFF',
        dialSizeMm: 32,
        strapMaterial: '316L Stainless Steel',
        strapColor: 'Rose Gold',
        price: 3899,
        compareAtPrice: 5999,
        purchaseCost: 1240,
        stockQuantity: 15,
        reservedQuantity: 1
      }
    ]
  },
  {
    id: 'prod-heritage-navy',
    name: 'AURRA Heritage Roman 39mm',
    tagline: 'Deep Sunray Navy Blue Dial with Hand-Stitched Cognac Saddle Leather',
    sku: 'AUR-HT-04-NVY',
    collection: 'Heritage',
    category: 'Classic Dress',
    gender: 'Unisex',
    price: 3499,
    compareAtPrice: 4999,
    mrp: 5499,
    purchaseCost: 1090,
    inboundFreight: 80,
    customsDuty: 105,
    qcCost: 40,
    packagingCost: 90,
    landedCost: 1405,
    marginPercent: 59.8,
    status: 'Active',
    rating: 4.8,
    reviewCount: 41,
    image: '/src/assets/images/aurra_monaco_leather_1793347857927.jpg',
    galleryImages: [
      '/src/assets/images/aurra_monaco_leather_1793347857927.jpg'
    ],
    description: 'An ode to mid-century European dress watches crafted with contemporary precision. The Heritage Roman features classic applied silver Roman numerals over a mesmerizing sunray midnight navy dial.',
    features: [
      'Applied polished silver Roman indices with leaf hands',
      'Date window at 3 o’clock with quick-set mechanism',
      'Full-grain Italian cognac leather strap with embossed crocodile texture',
      'Low-profile 39mm universal case fits comfortably on all wrists'
    ],
    movement: {
      type: 'Japanese Quartz Caliber',
      accuracy: '±15 seconds/month'
    },
    caseSpecs: {
      material: '316L Mirror-Polished Stainless Steel',
      diameterMm: 39,
      thicknessMm: 8.5,
      glass: 'Hardened Mineral Crystal with Sapphire Coating',
      waterResistance: '5 ATM (50m)'
    },
    warrantyYears: 2,
    supplierId: 'sup-apex-cases',
    variants: [
      {
        id: 'var-ht-navy-cognac',
        sku: 'AUR-HT-04-NVY',
        colorName: 'Navy Dial / Cognac Strap',
        dialColor: '#1E3A8A',
        dialSizeMm: 39,
        strapMaterial: 'Italian Leather',
        strapColor: 'Cognac Tan',
        price: 3499,
        compareAtPrice: 4999,
        purchaseCost: 1090,
        stockQuantity: 45,
        reservedQuantity: 6
      }
    ]
  },
  {
    id: 'prod-hydrostealth-diver',
    name: 'AURRA HydroStealth 300M 43mm',
    tagline: 'Tactical Matte Black Diver with Unidirectional Ceramic Bezel',
    sku: 'AUR-HS-09-BLK',
    collection: 'HydroStealth',
    category: 'Sports Diver',
    gender: 'Men',
    price: 4999,
    compareAtPrice: 7499,
    mrp: 8499,
    purchaseCost: 1680,
    inboundFreight: 110,
    customsDuty: 160,
    qcCost: 60,
    packagingCost: 120,
    landedCost: 2130,
    marginPercent: 57.4,
    status: 'Active',
    rating: 4.9,
    reviewCount: 29,
    image: '/src/assets/images/aurra_stealth_sport_1793347859670.jpg',
    galleryImages: [
      '/src/assets/images/aurra_stealth_sport_1793347859670.jpg'
    ],
    description: 'Built for intense performance in all weather conditions. The HydroStealth features a high-grade 120-click unidirectional scratch-proof ceramic diving bezel, screw-down crown with double gasket sealing, and breathable waffle silicone strap.',
    features: [
      'High-grade 120-click rotating ceramic dive bezel with luminous pip',
      'Dual gasket screw-down crown with custom crown guard',
      'Swiss Super-LumiNova BGW9 on indices and hands (glows ice blue)',
      'High-tensile vulcanized fluoroelastomer waterproof waffle strap'
    ],
    movement: {
      type: 'Japanese Quartz Caliber',
      accuracy: '±12 seconds/month'
    },
    caseSpecs: {
      material: '316L Stainless Steel Matte Black DLC Coating',
      diameterMm: 43,
      thicknessMm: 12.8,
      glass: 'Anti-reflective Sapphire Crystal',
      waterResistance: '10 ATM (100m - Diver Grade)'
    },
    warrantyYears: 2,
    supplierId: 'sup-miyota-calibers',
    variants: [
      {
        id: 'var-hs-matte-black',
        sku: 'AUR-HS-09-BLK',
        colorName: 'Matte Stealth Black',
        dialColor: '#18181B',
        dialSizeMm: 43,
        strapMaterial: 'Fluoroelastomer Silicone',
        strapColor: 'Charcoal Black',
        price: 4999,
        compareAtPrice: 7499,
        purchaseCost: 1680,
        stockQuantity: 19,
        reservedQuantity: 2
      }
    ]
  },
  {
    id: 'prod-horizon-silver',
    name: 'AURRA Horizon Silver Minimalist 40mm',
    tagline: 'Brushed Sunburst White Dial with Heated Blued Hands & Slate Calfskin',
    sku: 'AUR-HZ-05-SLV',
    collection: 'Minimalist',
    category: 'Classic Dress',
    gender: 'Unisex',
    price: 3999,
    compareAtPrice: 5999,
    mrp: 6499,
    purchaseCost: 1250,
    inboundFreight: 85,
    customsDuty: 120,
    qcCost: 45,
    packagingCost: 100,
    landedCost: 1600,
    marginPercent: 60.0,
    status: 'Active',
    rating: 4.9,
    reviewCount: 38,
    image: '/src/assets/images/aurra_silver_minimalist_1793349406195.jpg',
    galleryImages: [
      '/src/assets/images/aurra_silver_minimalist_1793349406195.jpg'
    ],
    description: 'An architectural tribute to Bauhaus purity and modern restraint. Features an ultra-clean brushed silver-white dial with slender baton indices, cobalt blued feuille hands, and an ultra-thin 7.8mm mirror-polished 316L case.',
    features: [
      'Bespoke heated cobalt blued hands (subtle blue reflection in light)',
      'Radial brushed silver-white dial with micro-beveled markers',
      'Ultra-thin 7.8mm profile engineered for effortless cuff clearance',
      'Hand-stitched dark slate Italian calfskin leather strap with quick release'
    ],
    movement: {
      type: 'Seiko NH35 Automatic',
      jewels: 24,
      powerReserveHours: 41,
      accuracy: '-20 to +40 seconds/day'
    },
    caseSpecs: {
      material: '316L Mirror-Polished Surgical Stainless Steel',
      diameterMm: 40,
      thicknessMm: 7.8,
      glass: 'Anti-reflective Sapphire Crystal',
      waterResistance: '5 ATM (50m)'
    },
    warrantyYears: 2,
    supplierId: 'sup-apex-cases',
    variants: [
      {
        id: 'var-hz-silver-slate',
        sku: 'AUR-HZ-05-SLV',
        colorName: 'Silver Dial / Slate Strap',
        dialColor: '#F3F4F6',
        dialSizeMm: 40,
        strapMaterial: 'Italian Leather',
        strapColor: 'Slate Grey',
        price: 3999,
        compareAtPrice: 5999,
        purchaseCost: 1250,
        stockQuantity: 32,
        reservedQuantity: 3
      }
    ]
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-apex-cases',
    name: 'Apex Precision Engineering Ltd',
    legalEntity: 'Apex Horological Components Pvt Ltd',
    contactPerson: 'Vikramaditya Deshmukh',
    email: 'v.deshmukh@apexprecision.in',
    phone: '+91 98201 44521',
    city: 'Pune, Maharashtra',
    gstin: '27AABCU9603R1ZM',
    category: 'Cases & Assembly',
    paymentTerms: 'Net 30',
    leadTimeDays: 18,
    moq: 150,
    rating: 4.8,
    defectRatePercent: 0.8,
    activeContracts: 4
  },
  {
    id: 'sup-miyota-calibers',
    name: 'Indo-Nippon Caliber Logistics',
    legalEntity: 'IN Calibers Precision Trade LLP',
    contactPerson: 'Rohan Banerjee',
    email: 'rohan.b@indonipponcalibers.com',
    phone: '+91 91673 89201',
    city: 'Chennai, Tamil Nadu',
    gstin: '33AAECI4519P1ZW',
    category: 'Movements & Calibers',
    paymentTerms: '50% Advance / 50% Delivery',
    leadTimeDays: 24,
    moq: 200,
    rating: 4.9,
    defectRatePercent: 0.3,
    activeContracts: 3
  },
  {
    id: 'sup-sovereign-dials',
    name: 'Sovereign Nacre & Dials Craft',
    legalEntity: 'Sovereign Enamel & Dial Works',
    contactPerson: 'Meera Kapadia',
    email: 'meera@sovereigndials.in',
    phone: '+91 98791 22340',
    city: 'Surat, Gujarat',
    gstin: '24AAJCS1102Q1ZK',
    category: 'Cases & Assembly',
    paymentTerms: 'Net 45',
    leadTimeDays: 14,
    moq: 100,
    rating: 4.6,
    defectRatePercent: 1.4,
    activeContracts: 2
  },
  {
    id: 'sup-luxbox',
    name: 'Atelier LuxBox & Packaging',
    legalEntity: 'Atelier Craft Packaging Pvt Ltd',
    contactPerson: 'Siddharth Nair',
    email: 'siddharth@atelierluxbox.com',
    phone: '+91 98450 67123',
    city: 'Bengaluru, Karnataka',
    gstin: '29AAHCA9921E1ZY',
    category: 'Luxury Packaging',
    paymentTerms: 'Net 30',
    leadTimeDays: 10,
    moq: 500,
    rating: 4.9,
    defectRatePercent: 0.2,
    activeContracts: 5
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1049',
    poNumber: 'PO-AUR-2026-081',
    supplierId: 'sup-apex-cases',
    supplierName: 'Apex Precision Engineering Ltd',
    orderDate: '2026-10-12',
    expectedDate: '2026-11-02',
    status: 'Sent to Supplier',
    totalUnits: 250,
    totalProcurementCost: 355000,
    paidAmount: 177500,
    paymentStatus: 'Partial',
    items: [
      {
        productId: 'prod-chrono-royale',
        productName: 'AURRA Chrono Royale 42mm',
        sku: 'AUR-CR-01-GLD',
        orderedQty: 150,
        receivedQty: 0,
        damagedQty: 0,
        unitCost: 1420
      },
      {
        productId: 'prod-heritage-navy',
        productName: 'AURRA Heritage Roman 39mm',
        sku: 'AUR-HT-04-NVY',
        orderedQty: 100,
        receivedQty: 0,
        damagedQty: 0,
        unitCost: 1090
      }
    ],
    notes: 'Approved for Diwali festive inventory buildup.'
  },
  {
    id: 'po-1048',
    poNumber: 'PO-AUR-2026-079',
    supplierId: 'sup-miyota-calibers',
    supplierName: 'Indo-Nippon Caliber Logistics',
    orderDate: '2026-09-20',
    expectedDate: '2026-10-15',
    status: 'Received',
    totalUnits: 200,
    totalProcurementCost: 370000,
    paidAmount: 370000,
    paymentStatus: 'Paid',
    items: [
      {
        productId: 'prod-sovereign-emerald',
        productName: 'AURRA Sovereign Emerald 40mm',
        sku: 'AUR-SV-03-EMR',
        orderedQty: 100,
        receivedQty: 100,
        damagedQty: 1,
        unitCost: 1850
      },
      {
        productId: 'prod-hydrostealth-diver',
        productName: 'AURRA HydroStealth 300M 43mm',
        sku: 'AUR-HS-09-BLK',
        orderedQty: 100,
        receivedQty: 99,
        damagedQty: 0,
        unitCost: 1680
      }
    ],
    notes: 'Received in full. One unit marked with hairline bezel scratch quarantined.'
  }
];

export const INITIAL_QC_LOGS: QCInspection[] = [
  {
    id: 'qc-891',
    inspectionDate: '2026-10-18',
    batchNumber: 'BATCH-CR-2610-A',
    productId: 'prod-chrono-royale',
    productName: 'AURRA Chrono Royale 42mm',
    inspectorName: 'Devika Sengupta (Senior Horologist)',
    unitsSampled: 20,
    dialAlignment: 'Pass',
    handClearance: 'Pass',
    caseFinishing: 'Pass',
    crownFunction: 'Pass',
    timekeepingAccuracy: '+2.8s/day (Passed)',
    waterResistanceTest: 'Pass 5 ATM',
    packagingCondition: 'Pristine',
    overallStatus: 'Approved',
    notes: 'All 20 sampled units passed hand alignment and dry pressure chamber tests.'
  },
  {
    id: 'qc-890',
    inspectionDate: '2026-10-16',
    batchNumber: 'BATCH-SV-2610-B',
    productId: 'prod-sovereign-emerald',
    productName: 'AURRA Sovereign Emerald 40mm',
    inspectorName: 'Anil Kulkarni (Quality Lead)',
    unitsSampled: 15,
    dialAlignment: 'Pass',
    handClearance: 'Pass',
    caseFinishing: 'Pass',
    crownFunction: 'Pass',
    timekeepingAccuracy: '+4.1s/day (Passed NH35)',
    waterResistanceTest: 'Pass 10 ATM',
    packagingCondition: 'Pristine',
    overallStatus: 'Approved',
    notes: 'Automatic winding rotor operates smoothly without friction.'
  }
];

export const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-2026-8941',
    orderNumber: 'AUR-8941',
    orderDate: '2026-10-29T14:22:00Z',
    customerName: 'Aditya Mathur',
    customerEmail: 'aditya.mathur@gmail.com',
    customerPhone: '+91 98112 34509',
    shippingAddress: {
      street: 'Flat 402, Oakwood Enclave, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    items: [
      {
        productId: 'prod-chrono-royale',
        productName: 'AURRA Chrono Royale 42mm',
        sku: 'AUR-CR-01-GLD',
        price: 4499,
        quantity: 1,
        image: '/src/assets/images/aurra_hero_chronograph_1793347856312.jpg'
      }
    ],
    subtotal: 4499,
    discountAmount: 449.9,
    couponCode: 'AURRAFIRST',
    gstAmount: 728.8,
    shippingFee: 0,
    totalAmount: 4049.1,
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Completed',
    orderStatus: 'Shipped',
    trackingNumber: 'BD-88391024IN',
    courierPartner: 'BlueDart Express',
    timeline: [
      { status: 'Order Confirmed', timestamp: '2026-10-29 14:22', description: 'Payment verified via Razorpay UPI.' },
      { status: 'Quality Inspected & Packed', timestamp: '2026-10-29 17:40', description: 'Serial #AUR-CR-8941 verified, packed in luxury box.' },
      { status: 'Handed to BlueDart', timestamp: '2026-10-30 09:15', description: 'In transit to Bengaluru Central Delivery Hub.' }
    ]
  },
  {
    id: 'ord-2026-8940',
    orderNumber: 'AUR-8940',
    orderDate: '2026-10-29T11:15:00Z',
    customerName: 'Priya Iyer',
    customerEmail: 'priya.iyer@outlook.com',
    customerPhone: '+91 98401 92831',
    shippingAddress: {
      street: '7B, Greenways Road, RA Puram',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600028'
    },
    items: [
      {
        productId: 'prod-luna-rose',
        productName: 'AURRA Luna Nacre Petite 32mm',
        sku: 'AUR-LN-07-RGD',
        price: 3699,
        quantity: 1,
        image: '/src/assets/images/aurra_luna_rose_womens_1793347857336.jpg'
      }
    ],
    subtotal: 3699,
    discountAmount: 0,
    gstAmount: 665.8,
    shippingFee: 0,
    totalAmount: 3699,
    paymentMethod: 'Razorpay Card',
    paymentStatus: 'Completed',
    orderStatus: 'Delivered',
    trackingNumber: 'DLV-44910291IN',
    courierPartner: 'Delhivery Air',
    timeline: [
      { status: 'Order Confirmed', timestamp: '2026-10-27 10:10', description: 'Paid via Visa Debit Card.' },
      { status: 'Dispatched', timestamp: '2026-10-27 15:30', description: 'Air Express dispatch.' },
      { status: 'Delivered', timestamp: '2026-10-29 16:45', description: 'Delivered to Priya Iyer. OTP confirmed.' }
    ]
  },
  {
    id: 'ord-2026-8939',
    orderNumber: 'AUR-8939',
    orderDate: '2026-10-28T19:05:00Z',
    customerName: 'Kunal Singhania',
    customerEmail: 'kunal.singhania@gmail.com',
    customerPhone: '+91 99201 10293',
    shippingAddress: {
      street: 'Penthouse 12, Altamount Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026'
    },
    items: [
      {
        productId: 'prod-sovereign-emerald',
        productName: 'AURRA Sovereign Emerald 40mm',
        sku: 'AUR-SV-03-EMR',
        price: 5299,
        quantity: 1,
        image: '/src/assets/images/aurra_regal_gold_mens_1793347857210.jpg'
      }
    ],
    subtotal: 5299,
    discountAmount: 500,
    couponCode: 'ROYALE500',
    gstAmount: 863.8,
    shippingFee: 0,
    totalAmount: 4799,
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Pending Verification',
    orderStatus: 'Processing',
    trackingNumber: 'SR-99102451IN',
    courierPartner: 'Shiprocket Priority',
    timeline: [
      { status: 'COD Order Booked', timestamp: '2026-10-28 19:05', description: 'PIN code 400026 verified serviceable.' },
      { status: 'Address Verified', timestamp: '2026-10-29 10:00', description: 'Phone confirmed with customer.' }
    ]
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-chrono-royale',
    productName: 'AURRA Chrono Royale 42mm',
    customerName: 'Gaurav K., Mumbai',
    rating: 5,
    date: '2026-10-24',
    title: 'Exceeded all expectations. Stunning finishing!',
    comment: 'I usually wear luxury brands, but I bought the Chrono Royale out of curiosity. The fluting on the bezel, the weight of the steel, and the subdial precision rival timepieces costing 4x this price. Unbelievable value for ₹4,499.',
    isVerifiedPurchase: true,
    status: 'Approved'
  },
  {
    id: 'rev-2',
    productId: 'prod-luna-rose',
    productName: 'AURRA Luna Nacre Petite 32mm',
    customerName: 'Ananya S., Pune',
    rating: 5,
    date: '2026-10-22',
    title: 'Pure understated elegance',
    comment: 'The mother-of-pearl dial catches the sunlight with soft rainbow shimmers. Perfect size for slim wrists and the packaging box looks like something out of a luxury boutique in Geneva.',
    isVerifiedPurchase: true,
    status: 'Approved'
  },
  {
    id: 'rev-3',
    productId: 'prod-sovereign-emerald',
    productName: 'AURRA Sovereign Emerald 40mm',
    customerName: 'Tarun M., Delhi',
    rating: 5,
    date: '2026-10-20',
    title: 'The emerald dial is breathtaking',
    comment: 'The sunburst dial in real life has incredible depth. The automatic sweeping second hand is butter-smooth and kept exact time over the past week.',
    isVerifiedPurchase: true,
    status: 'Approved'
  }
];

export const INITIAL_FEEDBACK: CustomerFeedback[] = [
  {
    id: 'fb-101',
    ticketRef: 'FDB-2026-101',
    customerName: 'Sanjay Mehra',
    customerEmail: 'sanjay.m@gmail.com',
    category: 'Product Quality',
    overallRating: 5,
    feedbackText: 'The build quality of the watch case is remarkable. Truly delivers on honest pricing without compromising the luxury feel.',
    submittedAt: '2026-10-28 11:30',
    status: 'Reviewed'
  },
  {
    id: 'fb-102',
    ticketRef: 'FDB-2026-102',
    customerName: 'Radhika Sen',
    customerEmail: 'radhika.sen@yahoo.com',
    category: 'Delivery Speed',
    overallRating: 4,
    feedbackText: 'Delivered in 48 hours to Kolkata! Packaging had zero dents. Would love to see additional strap choices in alligator textures.',
    submittedAt: '2026-10-27 15:45',
    status: 'Action Taken'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-401',
    ticketNumber: 'TKT-AUR-401',
    customerName: 'Vikram Chawla',
    customerEmail: 'vikram.chawla@gmail.com',
    orderNumber: 'AUR-8924',
    category: 'Warranty Claim',
    priority: 'Medium',
    status: 'In Progress',
    assignedAgent: 'Naveen Kumar (Support Tier 2)',
    createdAt: '2026-10-27 14:00',
    updatedAt: '2026-10-29 16:30',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Vikram Chawla',
        text: 'Hello, I bought the Sovereign 40mm a month ago. Wanted to verify if the 2-year movement warranty is active on serial #AUR-SV-9021?',
        timestamp: '2026-10-27 14:00'
      },
      {
        id: 'msg-2',
        sender: 'system',
        senderName: 'AURRA Internal Bot',
        text: 'Automatic warranty check: Serial #AUR-SV-9021 is registered active through 2028-09-24.',
        timestamp: '2026-10-27 14:01',
        isInternalNote: true
      },
      {
        id: 'msg-3',
        sender: 'agent',
        senderName: 'Naveen Kumar',
        text: 'Dear Vikram, your 2-year warranty is confirmed and active in our database. You can download the digital warranty card anytime from your AURRA Account.',
        timestamp: '2026-10-28 10:15'
      }
    ]
  },
  {
    id: 'tkt-402',
    ticketNumber: 'TKT-AUR-402',
    customerName: 'Sunita Rao',
    customerEmail: 'sunita.rao@hotmail.com',
    orderNumber: 'AUR-8935',
    category: 'Delivery Delay',
    priority: 'High',
    status: 'Open',
    assignedAgent: 'Unassigned',
    createdAt: '2026-10-29 09:10',
    updatedAt: '2026-10-29 09:10',
    messages: [
      {
        id: 'msg-4',
        sender: 'customer',
        senderName: 'Sunita Rao',
        text: 'Hi, tracking shows package arrived at Hyderabad hub yesterday but out for delivery has not triggered yet. This is an anniversary gift for tomorrow.',
        timestamp: '2026-10-29 09:10'
      }
    ]
  }
];

export const INITIAL_EXPENSES: BusinessExpense[] = [
  {
    id: 'exp-1',
    category: 'Performance Marketing (Meta/Google)',
    vendor: 'Meta Platforms Ireland / India Ad Services',
    amount: 145000,
    date: '2026-10-25',
    paymentMethod: 'Corporate Card',
    invoiceRef: 'INV-META-2610-89',
    notes: 'Pre-festive Instagram carousel and reels video acquisition campaign'
  },
  {
    id: 'exp-2',
    category: 'Warehouse Rent',
    vendor: 'IndoSpace Logistics Park Bhosari',
    amount: 55000,
    date: '2026-10-01',
    paymentMethod: 'Bank Transfer (NEFT)',
    invoiceRef: 'INV-IS-10-001',
    notes: 'Monthly fulfillment center rent & climate-controlled watch vault storage'
  },
  {
    id: 'exp-3',
    category: 'Packaging & Boxes',
    vendor: 'Atelier LuxBox & Packaging',
    amount: 55000,
    date: '2026-10-10',
    paymentMethod: 'Bank Transfer (NEFT)',
    invoiceRef: 'INV-ALB-2026-44',
    notes: '500 luxury textured presentation boxes with embossed gold foil & microfiber cloths'
  },
  {
    id: 'exp-4',
    category: 'Photography & Studio',
    vendor: 'Studio Lumina Horology',
    amount: 32000,
    date: '2026-10-15',
    paymentMethod: 'UPI',
    invoiceRef: 'INV-SL-092',
    notes: 'Macro product shoots and studio lighting rental for Royale & Sovereign line'
  }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-meta-festive',
    name: 'Diwali Festive Luxury Collection',
    channel: 'Instagram / Meta',
    budget: 150000,
    spend: 145000,
    impressions: 485000,
    clicks: 14200,
    conversions: 182,
    revenueGenerated: 785600,
    roas: 5.42,
    status: 'Active'
  },
  {
    id: 'camp-google-search',
    name: 'High-Intent Keywords (Premium Men Watches)',
    channel: 'Google Search Ads',
    budget: 80000,
    spend: 64000,
    impressions: 112000,
    clicks: 6800,
    conversions: 94,
    revenueGenerated: 398000,
    roas: 6.22,
    status: 'Active'
  },
  {
    id: 'camp-influencer-menswear',
    name: 'Gentlemen of Style Collaboration',
    channel: 'Influencer Partnerships',
    budget: 60000,
    spend: 55000,
    impressions: 290000,
    clicks: 8900,
    conversions: 62,
    revenueGenerated: 268000,
    roas: 4.87,
    status: 'Active'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'AURRAFIRST',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 2499,
    description: '10% off on your first AURRA timepiece',
    expiresAt: '2026-12-31',
    usageCount: 142,
    usageLimit: 1000,
    isActive: true
  },
  {
    code: 'ROYALE500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 3999,
    description: 'Flat ₹500 discount on Royale & Sovereign collections',
    expiresAt: '2026-11-30',
    usageCount: 88,
    usageLimit: 500,
    isActive: true
  },
  {
    code: 'FESTIVE15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 6999,
    maxDiscount: 1500,
    description: '15% festive gift discount on cart values above ₹6,999',
    expiresAt: '2026-11-15',
    usageCount: 45,
    usageLimit: 300,
    isActive: true
  }
];

export const INITIAL_COMPLIANCE: ComplianceItem[] = [
  {
    id: 'comp-1',
    requirement: 'Consumer Protection (E-Commerce) Rules, 2020 Compliance',
    category: 'Consumer Protection (E-Commerce)',
    legalSource: 'Ministry of Consumer Affairs Notification G.S.R. 462(E)',
    status: 'Fully Compliant',
    responsiblePerson: 'Legal Counsel / Grievance Officer',
    notes: 'Mandatory Grievance Officer name, phone, address, 48-hr ticket acknowledgement, and 30-day resolution timeline configured in storefront.'
  },
  {
    id: 'comp-2',
    requirement: 'GST HSN Classification 9102 & Invoicing Rules',
    category: 'GST & Taxation',
    legalSource: 'Central Goods and Services Tax Act 2017 (HSN 9102 @ 18%)',
    status: 'Fully Compliant',
    responsiblePerson: 'Chartered Accountant / Finance Lead',
    notes: 'All customer invoices include seller GSTIN, HSN Code 9102, CGST 9% + SGST 9% (or IGST 18% interstate), and B2C QR codes.'
  },
  {
    id: 'comp-3',
    requirement: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    category: 'Legal Metrology',
    legalSource: 'Department of Consumer Affairs Rule 6 Declarations',
    status: 'Audited & Verified',
    responsiblePerson: 'Operations & Sourcing Manager',
    notes: 'Packaging boxes carry MRP (inclusive of all taxes), net quantity 1 N, month/year of manufacture, country of origin (India / Assembled in India), and customer care details.'
  },
  {
    id: 'comp-4',
    requirement: 'Digital Personal Data Protection Act (DPDP Act 2023)',
    category: 'DPDP Privacy Act',
    legalSource: 'DPDP Act 2023 Provisions on Consent & Data Minimisation',
    status: 'Fully Compliant',
    responsiblePerson: 'Data Protection Officer',
    notes: 'Opt-in cookies, transparent marketing consent, right to erasure, and zero sharing of payment card credentials.'
  }
];
