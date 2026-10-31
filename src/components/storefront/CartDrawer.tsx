import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { OrderItem } from '../../types/watch';
import { StoreService } from '../../services/storeService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: OrderItem[];
  onUpdateQuantity: (sku: string, delta: number) => void;
  onRemoveItem: (sku: string) => void;
  onProceedToCheckout: (couponDiscount: number, appliedCode?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 1999;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;

    const res = StoreService.validateCoupon(couponInput, subtotal);
    if (res.valid) {
      setAppliedCoupon({ code: res.coupon!.code, discount: res.discount });
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-[#FFFFFF] border-l border-[#E8E2D7] flex flex-col justify-between shadow-2xl text-left">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8E2D7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-serif font-medium text-[#111111]">Shopping Bag</h2>
            <span className="text-xs text-[#777777] tabular-nums">
              ({cart.reduce((sum, it) => sum + it.quantity, 0)} pieces)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#F7F4EE] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#F7F4EE] px-5 py-3 border-b border-[#E8E2D7] text-xs">
          {amountNeededForFreeShipping > 0 ? (
            <p className="text-[#555555]">
              Add <span className="font-semibold text-[#111111]">₹{amountNeededForFreeShipping}</span> more for Free Express Air Shipping
            </p>
          ) : (
            <p className="text-emerald-700 font-medium">
              ✓ Qualified for Free Express Air Delivery
            </p>
          )}
          <div className="w-full bg-[#E8E2D7] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#C6A66B] h-full rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FFFFFF]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#777777] space-y-3">
              <p className="text-sm">Your shopping bag is empty.</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#111111] hover:bg-[#303030] text-xs text-white rounded-md transition-colors cursor-pointer"
              >
                Browse AURRA Timepieces
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.sku}
                className="p-3.5 bg-[#FFFFFF] border border-[#E8E2D7] rounded-xl flex gap-3.5 items-center shadow-xs"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-lg bg-[#F7F4EE] shrink-0 border border-[#E8E2D7]"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-serif font-medium text-[#111111] truncate">{item.productName}</h4>
                  <div className="text-[11px] text-[#777777] mt-0.5">SKU: {item.sku}</div>
                  <div className="text-xs font-semibold text-[#111111] mt-1 tabular-nums">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => onRemoveItem(item.sku)}
                    className="text-[#888888] hover:text-red-600 p-1 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2 bg-[#F7F4EE] border border-[#E8E2D7] rounded px-2 py-0.5 text-xs text-[#111111]">
                    <button
                      onClick={() => onUpdateQuantity(item.sku, -1)}
                      className="text-[#777777] hover:text-[#111111] cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-4 text-center tabular-nums font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.sku, 1)}
                      className="text-[#777777] hover:text-[#111111] cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Bottom: Coupon, Totals & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#F7F4EE] border-t border-[#E8E2D7] space-y-4">
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{appliedCoupon.discount})</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-emerald-700 hover:text-emerald-950 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. AURRAFIRST)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#FFFFFF] border border-[#E8E2D7] px-3 py-1.5 text-xs text-[#171717] placeholder-[#888888] rounded focus:outline-none focus:border-[#C6A66B]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#303030] text-xs font-medium text-white rounded transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#777777] border-t border-[#E8E2D7] pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#111111] font-medium tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Special Discount</span>
                  <span className="tabular-nums font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Air Shipping</span>
                <span className="text-[#111111] font-medium tabular-nums">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#888888]">
                <span>Applicable GST (18%)</span>
                <span>Included in price</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#111111] pt-2 border-t border-[#E8E2D7]">
                <span>Final Total</span>
                <span className="tabular-nums font-bold">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => onProceedToCheckout(discount, appliedCoupon?.code)}
              className="w-full py-3.5 bg-[#111111] hover:bg-[#303030] text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#777777]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>256-Bit SSL Encrypted & Razorpay Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
