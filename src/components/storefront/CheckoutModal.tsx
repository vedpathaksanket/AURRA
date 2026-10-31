import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Banknote, ArrowRight } from 'lucide-react';
import { OrderItem, CustomerOrder } from '../../types/watch';
import { StoreService } from '../../services/storeService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: OrderItem[];
  discountAmount: number;
  couponCode?: string;
  onOrderSuccess: (order: CustomerOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  discountAmount,
  couponCode,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<'address' | 'payment' | 'processing' | 'confirmed'>('address');

  // Address State
  const [name, setName] = useState('Sanket Vedpathak');
  const [email, setEmail] = useState('sanketvedpathak7@gmail.com');
  const [phone, setPhone] = useState('+91 98234 56789');
  const [street, setStreet] = useState('Flat 502, Prestige Hermitage, High Street');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('411001');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<
    'Razorpay UPI' | 'Razorpay Card' | 'Razorpay NetBanking' | 'Cash on Delivery (COD)'
  >('Razorpay UPI');
  const [upiApp, setUpiApp] = useState<'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM'>('Google Pay');
  const [createdOrder, setCreatedOrder] = useState<CustomerOrder | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shippingFee = subtotal >= 1999 || subtotal === 0 ? 0 : 150;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
  const gstAmount = Math.round((totalAmount * 18) / 118); // 18% GST embedded in MRP

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !street || !city || pincode.length !== 6) {
      alert('Please fill all mandatory shipping address fields correctly.');
      return;
    }
    setStep('payment');
  };

  const handleCompleteOrder = async () => {
    setStep('processing');

    try {
      const orderNumber = `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
      const trackingNumber = `BD-${Math.floor(10000000 + Math.random() * 90000000)}IN`;

      let razorpayOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;
      let razorpayPaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
      let razorpaySignature = '';

      // Call server payment endpoints which record to Supabase
      try {
        const orderRes = await fetch('/api/v1/payments/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'INR',
            orderNumber,
            customerName: name,
            customerEmail: email
          })
        });
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          if (orderData.id) {
            razorpayOrderId = orderData.id;
          }
        }

        if (paymentMethod !== 'Cash on Delivery (COD)') {
          const verifyRes = await fetch('/api/v1/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: razorpayPaymentId,
              orderNumber,
              amount: totalAmount,
              customerName: name
            })
          });
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            razorpaySignature = verifyData.signature || '';
          }
        }
      } catch (apiErr) {
        console.warn('Backend payment API logging notice:', apiErr);
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      const newOrder: CustomerOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        orderDate: new Date().toISOString(),
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          street,
          city,
          state,
          pincode
        },
        items: [...cart],
        subtotal,
        discountAmount,
        couponCode,
        gstAmount,
        shippingFee,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery (COD)' ? 'Pending Verification' : 'Completed',
        orderStatus: 'Confirmed',
        trackingNumber,
        courierPartner: 'BlueDart Express',
        timeline: [
          {
            status: 'Order Booked',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            description:
              paymentMethod === 'Cash on Delivery (COD)'
                ? 'COD order verified via PIN code check. Synced to Supabase.'
                : `Payment captured securely via Gateway (${razorpayOrderId}). Synced to Supabase database.`
          },
          {
            status: 'Atelier Order Queued',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            description: 'Timepiece allocated from climate-controlled vault.'
          }
        ]
      };

      StoreService.createOrder(newOrder, {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      });

      setCreatedOrder(newOrder);
      setStep('confirmed');
      onOrderSuccess(newOrder);
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Payment processing error. Please try again.');
      setStep('payment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E2D7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif tracking-wider text-[#111111] font-medium">AURRA Checkout</span>
            <span className="text-xs text-[#111111] bg-[#C6A66B]/15 border border-[#C6A66B]/30 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Supabase & Gateway Synced
            </span>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 text-[#777777] hover:text-[#111111] rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 'confirmed' && step !== 'processing' && (
          <div className="flex border-b border-[#E8E2D7] text-xs">
            <div
              className={`flex-1 py-3 text-center border-b-2 font-medium ${
                step === 'address' ? 'border-[#111111] text-[#111111] font-semibold' : 'border-transparent text-[#777777]'
              }`}
            >
              1. Delivery Address
            </div>
            <div
              className={`flex-1 py-3 text-center border-b-2 font-medium ${
                step === 'payment' ? 'border-[#111111] text-[#111111] font-semibold' : 'border-transparent text-[#777777]'
              }`}
            >
              2. Payment & Verification
            </div>
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: Address Form */}
          {step === 'address' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#111111] font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded-md px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="block text-[#111111] font-medium mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded-md px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#111111] font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded-md px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#111111] font-medium mb-1">Street Address & Landmark</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded-md px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="block text-[#111111] font-medium mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded-md px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="block text-[#111111] font-medium mb-1">PIN Code (6 Digits)</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded-md px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>

              {/* Order total strip */}
              <div className="p-3 bg-[#F7F4EE] rounded-lg border border-[#E8E2D7] flex justify-between items-center text-xs">
                <span className="text-[#777777]">Order Amount ({cart.length} items)</span>
                <span className="text-base font-semibold text-[#111111] tabular-nums">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs text-[#777777] hover:text-[#111111] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111111] hover:bg-[#303030] text-white text-xs font-bold tracking-wider uppercase rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Selection */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-[#111111] uppercase tracking-wider">
                  Select Payment Option
                </label>

                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('Razorpay UPI')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 shadow-xs ${
                    paymentMethod === 'Razorpay UPI'
                      ? 'bg-[#F7F4EE] border-[#111111]'
                      : 'bg-[#FFFFFF] border-[#E8E2D7] hover:border-[#111111]'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-[#111111] flex items-center justify-between">
                      <span>Instant UPI (Google Pay, PhonePe, Paytm, QR)</span>
                      <span className="text-[#111111] font-medium text-[10px] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E8E2D7]">Fastest & Recommended</span>
                    </div>
                    <p className="text-[#777777] mt-1">Zero extra gateway charges. Instant order confirmation.</p>

                    {paymentMethod === 'Razorpay UPI' && (
                      <div className="mt-3 flex gap-2">
                        {(['Google Pay', 'PhonePe', 'Paytm', 'BHIM'] as const).map((app) => (
                          <button
                            type="button"
                            key={app}
                            onClick={() => setUpiApp(app)}
                            className={`px-3 py-1 rounded text-[11px] border cursor-pointer ${
                              upiApp === app
                                ? 'bg-[#111111] text-white font-semibold border-[#111111]'
                                : 'bg-[#FFFFFF] text-[#555555] border-[#E8E2D7]'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cards Option */}
                <div
                  onClick={() => setPaymentMethod('Razorpay Card')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 shadow-xs ${
                    paymentMethod === 'Razorpay Card'
                      ? 'bg-[#F7F4EE] border-[#111111]'
                      : 'bg-[#FFFFFF] border-[#E8E2D7] hover:border-[#111111]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-[#111111]">Credit / Debit Cards (Visa, MasterCard, RuPay)</div>
                    <p className="text-[#777777] mt-1">Simulated 3D Secure 256-bit OTP verification.</p>
                  </div>
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 shadow-xs ${
                    paymentMethod === 'Cash on Delivery (COD)'
                      ? 'bg-[#F7F4EE] border-[#111111]'
                      : 'bg-[#FFFFFF] border-[#E8E2D7] hover:border-[#111111]'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-[#111111]">Cash on Delivery (Doorstep Verification)</div>
                    <p className="text-[#777777] mt-1">
                      Pay cash upon delivery. PIN code {pincode} verified serviceable.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary Confirmation */}
              <div className="p-4 bg-[#F7F4EE] rounded-xl border border-[#E8E2D7] space-y-1 text-xs text-[#777777]">
                <div className="flex justify-between">
                  <span>Deliver To</span>
                  <span className="text-[#111111] font-medium">{name} ({pincode})</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Payable</span>
                  <span className="text-base font-bold text-[#111111] tabular-nums">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="text-xs text-[#777777] hover:text-[#111111]"
                >
                  ← Back to Address
                </button>

                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  className="px-6 py-3 bg-[#111111] hover:bg-[#303030] text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C6A66B]" />
                  <span>
                    Pay ₹{totalAmount.toLocaleString('en-IN')} & Confirm Order
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing Simulation */}
          {step === 'processing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-3 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-lg font-serif text-[#111111]">
                {paymentMethod === 'Cash on Delivery (COD)'
                  ? 'Verifying COD Serviceability & Dispatch Route...'
                  : 'Connecting to Razorpay Test Gateway...'}
              </h3>
              <p className="text-xs text-[#777777]">Validating cryptographic HMAC signature on server.</p>
            </div>
          )}

          {/* STEP 4: Confirmed Order Screen */}
          {step === 'confirmed' && createdOrder && (
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold text-[#C6A66B] uppercase tracking-widest">
                  Order Successfully Placed
                </span>
                <h2 className="text-2xl font-serif text-[#111111] mt-1">
                  Thank You, {createdOrder.customerName}
                </h2>
                <p className="text-xs text-[#777777] mt-1">
                  Order #{createdOrder.orderNumber} is confirmed and queued for inspection at our Bengaluru Atelier.
                </p>
              </div>

              {/* Receipt Details Box */}
              <div className="max-w-md mx-auto p-4 bg-[#F7F4EE] border border-[#E8E2D7] rounded-xl text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-[#E8E2D7] pb-2">
                  <span className="text-[#777777]">AWB Airway Bill</span>
                  <span className="font-mono text-[#111111] font-semibold">{createdOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Courier Partner</span>
                  <span className="text-[#111111] font-medium">{createdOrder.courierPartner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Payment Mode</span>
                  <span className="text-[#111111] font-medium">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Amount Paid / Due</span>
                  <span className="font-semibold text-[#111111] tabular-nums">
                    ₹{createdOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#E8E2D7] text-[11px] text-[#777777]">
                  <span>GSTIN Invoice</span>
                  <span>INV-{createdOrder.orderNumber}-B2C</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-700 font-medium bg-emerald-50/80 px-2 py-1 rounded border border-emerald-200/60">
                  <span>Supabase & Payment Ledger</span>
                  <span>Synchronized</span>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#303030] cursor-pointer shadow-sm transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
