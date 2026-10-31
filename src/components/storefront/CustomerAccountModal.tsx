import React, { useState } from 'react';
import { X, Package, ShieldCheck, Heart, RotateCcw, Award, ShoppingBag, CheckCircle, FileText } from 'lucide-react';
import { CustomerOrder, WatchProduct } from '../../types/watch';
import { StoreService } from '../../services/storeService';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  onAddToCart: (product: WatchProduct) => void;
  onOpenTracking: (orderNumber?: string) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'orders',
  onAddToCart,
  onOpenTracking
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Return request form state
  const [returnOrderNum, setReturnOrderNum] = useState('AUR-8940');
  const [returnReason, setReturnReason] = useState('Fit / Wrist size too small');
  const [returnComments, setReturnComments] = useState('');
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  if (!isOpen) return null;

  const orders = StoreService.getOrders();
  const wishlistIds = StoreService.getWishlist();
  const allProducts = StoreService.getProducts();
  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StoreService.updateOrderStatus(
      orders.find((o) => o.orderNumber === returnOrderNum)?.id || 'ord-2026-8940',
      'Returned',
      `Return requested by customer. Reason: ${returnReason}`
    );
    setReturnSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl shadow-2xl p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-[#F7F4EE] hover:bg-[#EAE4D7] text-[#777777] hover:text-[#111111] rounded-full transition-colors cursor-pointer border border-[#E8E2D7]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C6A66B]">
            Client Portal & Ownership
          </span>
          <h2 className="text-2xl font-serif text-[#111111]">My AURRA Account</h2>
          <p className="text-xs text-[#777777]">
            Manage your verified timepieces, active 2-year warranties, order invoices, and return requests.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex border-b border-[#E8E2D7] gap-6 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 -mb-[2px] whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#111111] text-[#111111] font-semibold'
                : 'border-transparent text-[#777777] hover:text-[#111111]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders & Invoices ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('warranty')}
            className={`pb-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 -mb-[2px] whitespace-nowrap ${
              activeTab === 'warranty'
                ? 'border-[#111111] text-[#111111] font-semibold'
                : 'border-transparent text-[#777777] hover:text-[#111111]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Digital Warranty (Active)</span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`pb-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 -mb-[2px] whitespace-nowrap ${
              activeTab === 'returns'
                ? 'border-[#111111] text-[#111111] font-semibold'
                : 'border-transparent text-[#777777] hover:text-[#111111]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return & Exchange</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 -mb-[2px] whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'border-[#111111] text-[#111111] font-semibold'
                : 'border-transparent text-[#777777] hover:text-[#111111]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Wishlist ({wishlistedProducts.length})</span>
          </button>
        </div>

        {/* TAB 1: Orders List */}
        {activeTab === 'orders' && (
          <div className="mt-6 space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 bg-[#F7F4EE] border border-[#E8E2D7] rounded-xl space-y-3 text-xs shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E2D7] pb-2.5">
                  <div>
                    <span className="font-semibold text-sm text-[#111111]">Order #{ord.orderNumber}</span>
                    <span className="text-[#777777] ml-2">
                      {ord.orderDate.split('T')[0]} · {ord.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-medium ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-blue-50 text-blue-800 border border-blue-300'
                          : 'bg-[#FFFFFF] text-[#111111] border border-[#E8E2D7]'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>

                    <button
                      onClick={() => onOpenTracking(ord.orderNumber)}
                      className="text-[#111111] font-medium hover:text-[#C6A66B] underline cursor-pointer"
                    >
                      Track
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items.map((it) => (
                    <div key={it.sku} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={it.image} alt="" className="w-10 h-10 object-cover rounded bg-[#FFFFFF] border border-[#E8E2D7]" />
                        <div>
                          <div className="font-medium text-[#111111]">{it.productName}</div>
                          <div className="text-[11px] text-[#777777]">Qty: {it.quantity}</div>
                        </div>
                      </div>
                      <span className="font-semibold text-[#111111]">₹{it.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D7] text-[#777777]">
                  <span>Total (Incl. 18% GST): ₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => alert(`Downloading GST Tax Invoice for Order #${ord.orderNumber}...`)}
                      className="text-xs text-[#111111] hover:text-[#C6A66B] flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C6A66B]" />
                      <span>Download Tax Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Digital Warranty Certificates */}
        {activeTab === 'warranty' && (
          <div className="mt-6 space-y-4">
            <div className="p-6 bg-[#111111] border border-[#C6A66B]/50 rounded-2xl relative overflow-hidden text-left shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-[#C6A66B] font-semibold">
                    AURRA Atelier Horological Certification
                  </div>
                  <h3 className="text-xl font-serif text-[#F7F4EE] mt-1">
                    Digital 2-Year Movement Warranty
                  </h3>
                  <div className="text-xs text-[#D0CDC4] mt-0.5">
                    Covers internal mechanical and quartz caliber regulation, water seal integrity, and manufacturing defects.
                  </div>
                </div>
                <Award className="w-10 h-10 text-[#C6A66B] opacity-90" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[#C6A66B]/30 text-xs">
                <div>
                  <span className="text-[#888888] text-[10px] uppercase">Registered Owner</span>
                  <div className="font-medium text-[#F7F4EE] mt-0.5">Sanket Vedpathak</div>
                </div>
                <div>
                  <span className="text-[#888888] text-[10px] uppercase">Serial Number</span>
                  <div className="font-mono text-[#C6A66B] mt-0.5">AUR-CR-8941-QC</div>
                </div>
                <div>
                  <span className="text-[#888888] text-[10px] uppercase">Registered Timepiece</span>
                  <div className="font-medium text-[#F7F4EE] mt-0.5">Chrono Royale 42mm</div>
                </div>
                <div>
                  <span className="text-[#888888] text-[10px] uppercase">Valid Until</span>
                  <div className="font-medium text-emerald-400 mt-0.5">October 29, 2028</div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-[#888888]">
                <span>Status: <strong className="text-emerald-400">Active & Registered</strong></span>
                <button
                  onClick={() => alert('Certificate downloaded as tamper-proof PDF.')}
                  className="px-3.5 py-1.5 bg-[#222222] hover:bg-[#303030] text-[#F7F4EE] rounded border border-[#444444] text-xs cursor-pointer transition-colors"
                >
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Return & Exchange Request */}
        {activeTab === 'returns' && (
          <div className="mt-6 space-y-4 text-xs">
            {returnSubmitted ? (
              <div className="p-6 bg-[#F7F4EE] border border-emerald-300 rounded-xl text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-serif text-[#111111]">Return Request Submitted</h4>
                <p className="text-xs text-[#777777] max-w-md mx-auto">
                  Our quality support team will review your request within 24 hours. A complimentary reverse pickup will be scheduled upon approval.
                </p>
                <button
                  onClick={() => setReturnSubmitted(false)}
                  className="px-4 py-2 bg-[#111111] text-white text-xs font-medium rounded hover:bg-[#303030] cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleReturnSubmit} className="space-y-4 bg-[#F7F4EE] p-5 rounded-xl border border-[#E8E2D7]">
                <div>
                  <label className="block text-[#111111] font-medium mb-1">Select Order to Return</label>
                  <select
                    value={returnOrderNum}
                    onChange={(e) => setReturnOrderNum(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B]"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.orderNumber}>
                        Order #{o.orderNumber} ({o.items.map((i) => i.productName).join(', ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#111111] font-medium mb-1">Reason for Return or Exchange</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B]"
                  >
                    <option value="Fit / Wrist size too small">Fit / Wrist size too small (Exchange requested)</option>
                    <option value="Fit / Wrist size too large">Fit / Wrist size too large (Exchange requested)</option>
                    <option value="Color or aesthetic mismatch">Color or aesthetic mismatch with expectation</option>
                    <option value="Packaging damaged in transit">Packaging damaged in transit</option>
                    <option value="Style preference change">Change of mind (within 7-day policy window)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#111111] font-medium mb-1">Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Describe any specifics to assist our inspection team..."
                    value={returnComments}
                    onChange={(e) => setReturnComments(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#111111] hover:bg-[#303030] text-white font-semibold rounded transition-colors cursor-pointer shadow-xs"
                  >
                    Submit Return Request
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="mt-6 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <p className="text-center py-10 text-[#777777] text-xs">Your wishlist is currently empty.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlistedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-[#F7F4EE] border border-[#E8E2D7] rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-14 h-14 object-cover rounded bg-[#FFFFFF] border border-[#E8E2D7]" />
                      <div>
                        <h4 className="font-serif font-medium text-[#111111]">{p.name}</h4>
                        <div className="text-[#111111] font-semibold mt-0.5">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onAddToCart(p)}
                      className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#303030] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C6A66B]" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
