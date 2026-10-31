import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Hero } from './components/storefront/Hero';
import { CollectionGrid } from './components/storefront/CollectionGrid';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { OrderTrackingModal } from './components/storefront/OrderTrackingModal';
import { CustomerAccountModal } from './components/storefront/CustomerAccountModal';
import { FeedbackModal } from './components/storefront/FeedbackModal';
import { SupportTicketModal } from './components/storefront/SupportTicketModal';
import { AiShoppingAssistant } from './components/storefront/AiShoppingAssistant';
import { LegalModal } from './components/storefront/LegalModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StoreService } from './services/storeService';
import { WatchProduct, WatchVariant, OrderItem, CustomerOrder } from './types/watch';

export default function App() {
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [products, setProducts] = useState<WatchProduct[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(0);
  const [checkoutCouponCode, setCheckoutCouponCode] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<WatchProduct | null>(null);

  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [accountTab, setAccountTab] = useState<string>('orders');

  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [trackingOrderNum, setTrackingOrderNum] = useState<string>('AUR-8941');

  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [isStylistOpen, setIsStylistOpen] = useState<boolean>(false);

  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<
    'terms' | 'privacy' | 'shipping' | 'returns' | 'warranty' | 'compliance'
  >('terms');

  // Load initial data
  useEffect(() => {
    setProducts(StoreService.getProducts());
    setCart(StoreService.getCart());
    setWishlistIds(StoreService.getWishlist());
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Handlers
  const handleAddToCart = (product: WatchProduct, variant?: WatchVariant) => {
    const activeVar = variant || (product.variants && product.variants[0]) || {
      id: 'default',
      sku: product.sku,
      price: product.price
    };

    const existingIdx = cart.findIndex((it) => it.sku === activeVar.sku);
    let updatedCart: OrderItem[];

    if (existingIdx >= 0) {
      updatedCart = [...cart];
      updatedCart[existingIdx].quantity += 1;
    } else {
      updatedCart = [
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          sku: activeVar.sku,
          variantId: activeVar.id,
          price: product.price,
          quantity: 1,
          image: product.image
        }
      ];
    }

    setCart(updatedCart);
    StoreService.setCart(updatedCart);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (sku: string, delta: number) => {
    const updated = cart
      .map((it) => {
        if (it.sku === sku) {
          const newQty = it.quantity + delta;
          return newQty > 0 ? { ...it, quantity: newQty } : null;
        }
        return it;
      })
      .filter(Boolean) as OrderItem[];

    setCart(updated);
    StoreService.setCart(updated);
  };

  const handleRemoveItem = (sku: string) => {
    const updated = cart.filter((it) => it.sku !== sku);
    setCart(updated);
    StoreService.setCart(updated);
  };

  const handleProceedToCheckout = (discount: number, code?: string) => {
    setCheckoutDiscount(discount);
    setCheckoutCouponCode(code);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: CustomerOrder) => {
    // Clear cart on successful order
    setCart([]);
    StoreService.setCart([]);
    setTrackingOrderNum(order.orderNumber);
    // Refresh products stock
    setProducts(StoreService.getProducts());
  };

  const handleToggleWishlist = (productId: string) => {
    StoreService.toggleWishlist(productId);
    setWishlistIds(StoreService.getWishlist());
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#171717] flex flex-col selection:bg-[#C6A66B] selection:text-white">
      {/* Top Header conforming strictly to 3-zone contract */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={(tab = 'orders') => {
          setAccountTab(tab);
          setIsAccountOpen(true);
        }}
        onOpenStylist={() => setIsStylistOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onFilterCategory={(cat) => {
          setActiveCategory(cat);
          if (isAdminView) setIsAdminView(false);
          const gridEl = document.getElementById('collection-grid');
          if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
        }}
        isAdminView={isAdminView}
        onToggleAdminView={() => setIsAdminView(!isAdminView)}
        cartCount={totalCartCount}
      />

      {/* Main Body: Either Customer Storefront or Owner Command Center */}
      <main className="flex-1">
        {isAdminView ? (
          <AdminDashboard />
        ) : (
          <>
            {/* Storefront Hero with high-resolution visual anchor */}
            <Hero
              onExploreCollection={(cat = 'All') => {
                setActiveCategory(cat);
                const gridEl = document.getElementById('collection-grid');
                if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenStylist={() => setIsStylistOpen(true)}
            />

            {/* Featured Collection Grid & Faceted Filter */}
            <CollectionGrid
              products={products}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onQuickView={(prod) => setSelectedProduct(prod)}
              onAddToCart={handleAddToCart}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />

            {/* Editorial Brand Section: Philosophy & Material Quality */}
            <section className="py-16 sm:py-24 bg-[#FFFFFF] border-t border-[#E8E2D7] text-left">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C6A66B]">
                      Atelier Philosophy
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif text-[#111111] leading-tight">
                      "Premium-inspired style. Honest pricing. Everyday confidence."
                    </h2>
                    <p className="text-sm text-[#555555] leading-relaxed font-light">
                      We founded AURRA because we refused to accept that exceptional timepieces must cost a month's salary. By manufacturing with medical-grade 316L stainless steel, anti-reflective sapphire glass, and Japanese precision movements — and cutting out distributor margins — we bring horological luxury within reach.
                    </p>
                    <div className="pt-2 flex items-center gap-4 text-xs text-[#777777]">
                      <div>
                        <div className="text-xl font-bold font-mono text-[#111111]">316L</div>
                        <div className="text-[11px] text-[#777777]">Surgical Steel</div>
                      </div>
                      <span className="text-[#E8E2D7]">/</span>
                      <div>
                        <div className="text-xl font-bold font-mono text-[#111111]">5-10 ATM</div>
                        <div className="text-[11px] text-[#777777]">Water Sealed</div>
                      </div>
                      <span className="text-[#E8E2D7]">/</span>
                      <div>
                        <div className="text-xl font-bold font-mono text-[#111111]">24 Mo</div>
                        <div className="text-[11px] text-[#777777]">Atelier Warranty</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden bg-[#F7F4EE] border border-[#E8E2D7] shadow-sm">
                      <img
                        src="/src/assets/images/aurra_regal_gold_mens_1793347857210.jpg"
                        alt="AURRA Sovereign Emerald Gold Watch"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover aspect-[4/3]"
                      />
                    </div>
                    <div className="rounded-xl overflow-hidden bg-[#F7F4EE] border border-[#E8E2D7] shadow-sm">
                      <img
                        src="/src/assets/images/aurra_luna_rose_womens_1793347857336.jpg"
                        alt="AURRA Luna Nacre Rose Gold Watch"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover aspect-[4/3]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer with India Compliance & Grievance Redressal */}
      <Footer
        onOpenLegal={(tab) => {
          setLegalTab(tab);
          setIsLegalOpen(true);
        }}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        discountAmount={checkoutDiscount}
        couponCode={checkoutCouponCode}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 4. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderNumber={trackingOrderNum}
      />

      {/* 5. Customer Account & Ownership Modal */}
      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        initialTab={accountTab}
        onAddToCart={handleAddToCart}
        onOpenTracking={(ordNum) => {
          if (ordNum) setTrackingOrderNum(ordNum);
          setIsAccountOpen(false);
          setIsTrackingOpen(true);
        }}
      />

      {/* 6. Customer Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* 7. Support Ticket Modal */}
      <SupportTicketModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* 8. AI Stylist Modal */}
      <AiShoppingAssistant
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        products={products}
      />

      {/* 9. Legal & Regulatory Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />
    </div>
  );
}
