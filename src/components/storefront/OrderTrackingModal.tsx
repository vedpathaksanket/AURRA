import React, { useState } from 'react';
import { X, Search, Package, CheckCircle, Clock, Truck, ShieldCheck, Copy, Check } from 'lucide-react';
import { CustomerOrder } from '../../types/watch';
import { StoreService } from '../../services/storeService';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = ''
}) => {
  const [query, setQuery] = useState(initialOrderNumber || 'AUR-8941');
  const [matchedOrder, setMatchedOrder] = useState<CustomerOrder | null>(() => {
    const orders = StoreService.getOrders();
    return orders.find((o) => o.orderNumber === query) || orders[0] || null;
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    const orders = StoreService.getOrders();
    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === clean ||
        o.trackingNumber.toUpperCase() === clean ||
        o.customerPhone.includes(clean)
    );
    setMatchedOrder(found || null);
  };

  const handleCopyAWB = () => {
    if (matchedOrder) {
      navigator.clipboard.writeText(matchedOrder.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusIndexMap: Record<CustomerOrder['orderStatus'], number> = {
    Confirmed: 1,
    Processing: 1,
    Packed: 2,
    Shipped: 3,
    'Out for Delivery': 4,
    Delivered: 5,
    Cancelled: 0,
    Returned: 0
  };

  const currentStep = matchedOrder ? statusIndexMap[matchedOrder.orderStatus] || 1 : 1;

  const steps = [
    { title: 'Order Confirmed', desc: 'Payment verified & serial assigned' },
    { title: 'Quality Inspected', desc: 'Water-seal & accuracy certified' },
    { title: 'Packed & Dispatched', desc: 'Sealed in tamper-evident luxury box' },
    { title: 'Air Transit Hub', desc: 'In express transit to your city' },
    { title: 'Delivered', desc: 'Handed over at doorstep' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl shadow-2xl p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-[#F7F4EE] hover:bg-[#EAE4D7] text-[#777777] hover:text-[#111111] rounded-full transition-colors cursor-pointer border border-[#E8E2D7]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C6A66B]">
            Real-Time Logistics Tracker
          </span>
          <h2 className="text-2xl font-serif text-[#111111]">Track Your Timepiece</h2>
          <p className="text-xs text-[#777777]">
            Enter your AURRA Order Number (e.g. AUR-8941) or Airway Bill (AWB) number.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order # or AWB..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded-lg pl-9 pr-3 py-2 text-xs text-[#171717] placeholder-[#888888] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#111111] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Track
          </button>
        </form>

        {matchedOrder ? (
          <div className="mt-6 space-y-6">
            {/* Order Card Overview */}
            <div className="p-4 bg-[#F7F4EE] border border-[#E8E2D7] rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
              <div>
                <div className="font-semibold text-[#111111] text-sm">
                  Order #{matchedOrder.orderNumber}
                </div>
                <div className="text-[#777777] mt-0.5">
                  Courier: {matchedOrder.courierPartner} · Destination: {matchedOrder.shippingAddress.city}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#111111] font-semibold bg-[#FFFFFF] px-2.5 py-1 rounded border border-[#E8E2D7] shadow-xs">
                  {matchedOrder.trackingNumber}
                </span>
                <button
                  onClick={handleCopyAWB}
                  className="p-1.5 bg-[#FFFFFF] hover:bg-[#F7F4EE] text-[#777777] hover:text-[#111111] rounded border border-[#E8E2D7] cursor-pointer"
                  title="Copy AWB"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider">
                Milestone Status: <span className="text-[#C6A66B]">{matchedOrder.orderStatus}</span>
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E2D7]">
                {steps.map((st, i) => {
                  const stepNum = i + 1;
                  const isDone = currentStep >= stepNum;

                  return (
                    <div key={st.title} className="relative flex items-start gap-4">
                      {/* Step Circle */}
                      <div
                        className={`absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] border shadow-xs ${
                          isDone
                            ? 'bg-[#111111] border-[#111111] text-[#C6A66B] font-bold'
                            : 'bg-[#FFFFFF] border-[#E8E2D7] text-[#777777]'
                        }`}
                      >
                        {isDone ? '✓' : stepNum}
                      </div>

                      <div className="text-left text-xs">
                        <div className={`font-semibold ${isDone ? 'text-[#111111]' : 'text-[#888888]'}`}>
                          {st.title}
                        </div>
                        <div className="text-[#777777] text-[11px] mt-0.5">{st.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Timeline Events */}
            <div className="p-4 bg-[#F7F4EE] rounded-xl border border-[#E8E2D7] space-y-2 text-xs">
              <div className="text-[11px] font-semibold text-[#777777] uppercase tracking-wider">
                Logistics Activity Feed
              </div>
              {matchedOrder.timeline.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 pt-1.5 border-t border-[#E8E2D7]">
                  <div>
                    <div className="font-medium text-[#111111]">{item.status}</div>
                    <div className="text-[#777777] text-[11px]">{item.description}</div>
                  </div>
                  <span className="text-[#888888] text-[10px] shrink-0">{item.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Included Items in this package */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#777777] uppercase tracking-wider">
                Package Contents
              </span>
              {matchedOrder.items.map((it) => (
                <div
                  key={it.sku}
                  className="p-3 bg-[#FFFFFF] rounded-lg border border-[#E8E2D7] shadow-xs flex items-center gap-3 text-xs"
                >
                  <img src={it.image} alt="" className="w-12 h-12 object-cover rounded bg-[#F7F4EE] border border-[#E8E2D7]" />
                  <div className="flex-1">
                    <div className="font-serif font-medium text-[#111111]">{it.productName}</div>
                    <div className="text-[#777777] text-[11px]">SKU: {it.sku} · Qty: {it.quantity}</div>
                  </div>
                  <div className="font-semibold text-[#111111]">₹{it.price.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 py-12 text-center text-[#777777] space-y-2 bg-[#F7F4EE] rounded-xl border border-[#E8E2D7]">
            <Package className="w-8 h-8 mx-auto text-[#888888]" />
            <p className="text-sm font-medium text-[#111111]">No order found matching "{query}".</p>
            <p className="text-xs">Check your confirmation email or SMS for the correct order number.</p>
          </div>
        )}
      </div>
    </div>
  );
};
