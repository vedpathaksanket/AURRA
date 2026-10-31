import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Star, Info, CheckCircle2 } from 'lucide-react';
import { WatchProduct, WatchVariant } from '../../types/watch';
import { StoreService } from '../../services/storeService';

interface ProductDetailModalProps {
  product: WatchProduct | null;
  onClose: () => void;
  onAddToCart: (product: WatchProduct, variant?: WatchVariant) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<WatchVariant>(
    product.variants && product.variants.length > 0 ? product.variants[0] : ({} as WatchVariant)
  );
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [pincode, setPincode] = useState<string>('');
  const [pincodeResult, setPincodeResult] = useState<{
    checked: boolean;
    serviceable: boolean;
    city?: string;
    deliveryEstimate?: string;
    codAvailable?: boolean;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'specs' | 'honestPricing' | 'reviews'>('specs');

  const discountPercent = Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
  );

  const reviews = StoreService.getReviews().filter((r) => r.productId === product.id);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      const isMetro = ['11', '40', '56', '60', '70', '50', '38', '41'].some((prefix) =>
        pincode.startsWith(prefix)
      );
      setPincodeResult({
        checked: true,
        serviceable: true,
        city: isMetro ? 'Metro Express Hub' : 'Regional Express Delivery',
        deliveryEstimate: isMetro ? 'Delivered in 2 business days (Air Express)' : 'Delivered in 3-4 business days',
        codAvailable: true
      });
    } else {
      setPincodeResult({
        checked: true,
        serviceable: false,
        deliveryEstimate: 'Please enter a valid 6-digit Indian PIN code.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl shadow-2xl text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#F7F4EE] hover:bg-[#EAE4D7] text-[#111111] rounded-full transition-colors cursor-pointer border border-[#E8E2D7]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          {/* Left Column: Gallery & Zoom Preview */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F4EE] border border-[#E8E2D7]">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 text-xs font-semibold bg-[#111111] text-white px-2.5 py-1 rounded shadow-xs">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.galleryImages && product.galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-[#F7F4EE] ${
                      activeImage === img ? 'border-[#111111] scale-105' : 'border-[#E8E2D7] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* 3 Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-[#777777]">
              <div className="p-2.5 bg-[#F7F4EE] rounded-lg border border-[#E8E2D7]">
                <ShieldCheck className="w-4 h-4 mx-auto text-[#C6A66B] mb-1" />
                <span className="font-medium text-[#111111]">2-Year Warranty</span>
              </div>
              <div className="p-2.5 bg-[#F7F4EE] rounded-lg border border-[#E8E2D7]">
                <RefreshCw className="w-4 h-4 mx-auto text-[#C6A66B] mb-1" />
                <span className="font-medium text-[#111111]">7-Day Return</span>
              </div>
              <div className="p-2.5 bg-[#F7F4EE] rounded-lg border border-[#E8E2D7]">
                <Truck className="w-4 h-4 mx-auto text-[#C6A66B] mb-1" />
                <span className="font-medium text-[#111111]">Free Express Air</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Collection */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C6A66B]">
                <span>{product.collection} Collection</span>
                <span aria-hidden="true">·</span>
                <span>{product.gender}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif text-[#111111] mt-1.5 leading-snug">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-[#C6A66B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-[#C6A66B]' : 'text-[#D8D1C4]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#777777]">
                  {product.rating} ({product.reviewCount} verified owners)
                </span>
              </div>

              {/* Price row with compare-at */}
              <div className="mt-4 p-3.5 bg-[#F7F4EE] rounded-lg border border-[#E8E2D7] flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold text-[#111111] tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-[#777777] line-through tabular-nums">
                      ₹{product.compareAtPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#777777] mt-0.5">
                    MRP: ₹{product.mrp.toLocaleString('en-IN')} (Inclusive of all taxes & 18% GST)
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#111111] bg-[#FFFFFF] px-2 py-1 rounded border border-[#E8E2D7] shadow-xs">
                  {discountPercent}% OFF
                </span>
              </div>

              {/* Variant Selector (if variants exist) */}
              {product.variants && product.variants.length > 1 && (
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-semibold text-[#111111] uppercase tracking-wider">
                    Select Edition: <span className="text-[#C6A66B]">{selectedVariant.colorName}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-2 text-xs rounded-md border transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                          selectedVariant.id === v.id
                            ? 'bg-[#111111] text-white border-[#111111] font-medium'
                            : 'bg-[#FFFFFF] text-[#555555] border-[#E8E2D7] hover:border-[#111111]'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: v.dialColor }}
                        />
                        <span>{v.colorName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs text-[#555555]">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>In Stock & Ready for Same-Day Dispatch</span>
              </div>
            </div>

            {/* Contiguous CTA Bar */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAddToCart(product, selectedVariant)}
                  className="flex-1 py-3.5 px-6 bg-[#111111] hover:bg-[#303030] text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C6A66B]" />
                  <span>Add To Bag · ₹{product.price.toLocaleString('en-IN')}</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3.5 rounded-lg border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#111111] text-[#C6A66B] border-[#111111]'
                      : 'bg-[#FFFFFF] text-[#777777] border-[#E8E2D7] hover:text-[#111111] hover:border-[#C6A66B]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Pincode Serviceability & Delivery Checker */}
              <div className="p-3 bg-[#F7F4EE] rounded-lg border border-[#E8E2D7]">
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN code (e.g. 560001)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 bg-[#FFFFFF] border border-[#E8E2D7] text-xs text-[#171717] px-3 py-1.5 rounded focus:outline-none focus:border-[#C6A66B]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#303030] text-xs font-medium text-white rounded transition-colors cursor-pointer"
                  >
                    Check PIN
                  </button>
                </form>

                {pincodeResult && (
                  <div className="mt-2 text-[11px] flex items-start gap-1.5">
                    {pincodeResult.serviceable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[#555555]">
                          {pincodeResult.city}: {pincodeResult.deliveryEstimate}. Cash on Delivery eligible.
                        </span>
                      </>
                    ) : (
                      <span className="text-red-500">{pincodeResult.deliveryEstimate}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications, Honest Pricing, Verified Reviews */}
        <div className="border-t border-[#E8E2D7] p-6 sm:p-8 bg-[#F7F4EE]/50">
          {/* Tab Selector */}
          <div className="flex border-b border-[#E8E2D7] gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 transition-colors cursor-pointer border-b-2 -mb-[2px] ${
                activeTab === 'specs'
                  ? 'border-[#111111] text-[#111111] font-semibold'
                  : 'border-transparent text-[#777777] hover:text-[#111111]'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('honestPricing')}
              className={`pb-3 transition-colors cursor-pointer border-b-2 -mb-[2px] ${
                activeTab === 'honestPricing'
                  ? 'border-[#111111] text-[#111111] font-semibold'
                  : 'border-transparent text-[#777777] hover:text-[#111111]'
              }`}
            >
              Honest Pricing Breakdown
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors cursor-pointer border-b-2 -mb-[2px] ${
                activeTab === 'reviews'
                  ? 'border-[#111111] text-[#111111] font-semibold'
                  : 'border-transparent text-[#777777] hover:text-[#111111]'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab 1: Technical Specs Grid */}
          {activeTab === 'specs' && (
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-[#777777] uppercase tracking-wider text-[10px]">Caliber & Movement</span>
                <p className="font-semibold text-[#111111]">{product.movement.type}</p>
                <p className="text-[#777777]">Accuracy: {product.movement.accuracy}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#777777] uppercase tracking-wider text-[10px]">Case Dimensions</span>
                <p className="font-semibold text-[#111111]">{product.caseSpecs.diameterMm}mm Diameter</p>
                <p className="text-[#777777]">{product.caseSpecs.thicknessMm}mm Profile Thickness</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#777777] uppercase tracking-wider text-[10px]">Glass Crystal</span>
                <p className="font-semibold text-[#111111]">{product.caseSpecs.glass}</p>
                <p className="text-[#777777]">Anti-reflective interior coating</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#777777] uppercase tracking-wider text-[10px]">Water Resistance</span>
                <p className="font-semibold text-[#111111]">{product.caseSpecs.waterResistance}</p>
                <p className="text-[#777777]">Pressure tested in nitrogen chambers</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#777777] uppercase tracking-wider text-[10px]">Case Material</span>
                <p className="font-semibold text-[#111111]">{product.caseSpecs.material}</p>
                <p className="text-[#777777]">Corrosion-resistant 316L medical grade</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#777777] uppercase tracking-wider text-[10px]">Warranty & Service</span>
                <p className="font-semibold text-[#111111]">{product.warrantyYears}-Year Atelier Movement Warranty</p>
                <p className="text-[#777777]">Doorstep pickup & return for repairs</p>
              </div>
            </div>
          )}

          {/* Tab 2: Honest Pricing Breakdown */}
          {activeTab === 'honestPricing' && (
            <div className="pt-6 space-y-4 text-xs">
              <p className="text-[#555555] leading-relaxed">
                Traditional legacy watch brands mark up timepieces up to 800% through celebrity endorsements, distributor layers, and mall retail rents. Here is our completely transparent cost structure for this timepiece:
              </p>
              <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#E8E2D7] shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-[10px] text-[#777777] uppercase">Factory Sourcing</div>
                  <div className="text-sm font-semibold text-[#111111] mt-0.5">₹{product.purchaseCost}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#777777] uppercase">Customs & Freight</div>
                  <div className="text-sm font-semibold text-[#111111] mt-0.5">₹{product.customsDuty + product.inboundFreight}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#777777] uppercase">Horology QC & Box</div>
                  <div className="text-sm font-semibold text-[#111111] mt-0.5">₹{product.qcCost + product.packagingCost}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#111111] uppercase font-semibold">AURRA Price</div>
                  <div className="text-sm font-bold text-[#111111] mt-0.5">₹{product.price}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#777777] uppercase">Mall Retail Value</div>
                  <div className="text-sm font-semibold text-[#777777] line-through mt-0.5">₹{product.mrp}</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Verified Reviews */}
          {activeTab === 'reviews' && (
            <div className="pt-6 space-y-4 text-xs">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-[#FFFFFF] rounded-lg border border-[#E8E2D7] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#111111]">{rev.customerName}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#777777]">{rev.date}</span>
                  </div>
                  <div className="flex text-[#C6A66B]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < rev.rating ? 'fill-[#C6A66B]' : 'text-[#E8E2D7]'}`}
                      />
                    ))}
                  </div>
                  <h4 className="font-semibold text-[#111111]">{rev.title}</h4>
                  <p className="text-[#555555] leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
