import React, { useState } from 'react';
import { X, Star, CheckCircle, MessageSquare } from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { CustomerFeedback } from '../../types/watch';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [category, setCategory] = useState<CustomerFeedback['category']>('Product Quality');
  const [rating, setRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketRef = `FDB-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newFeedback: CustomerFeedback = {
      id: `fb-${Date.now()}`,
      ticketRef,
      customerName: name || 'Anonymous Client',
      customerEmail: email,
      customerPhone: phone,
      orderNumber,
      category,
      overallRating: rating,
      feedbackText,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'New'
    };

    StoreService.submitFeedback(newFeedback);
    setSubmittedRef(ticketRef);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl shadow-2xl p-6 sm:p-8 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-[#F7F4EE] hover:bg-[#EAE4D7] text-[#777777] hover:text-[#111111] rounded-full transition-colors cursor-pointer border border-[#E8E2D7]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C6A66B]">
            Client Feedback & Quality
          </span>
          <h2 className="text-2xl font-serif text-[#111111]">Share Your Experience</h2>
          <p className="text-xs text-[#777777]">
            Your candid voice directly shapes AURRA's craftsmanship and service standards.
          </p>
        </div>

        {submittedRef ? (
          <div className="mt-8 py-8 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-serif text-[#111111]">Thank You For Your Feedback</h3>
            <p className="text-xs text-[#777777]">
              Your submission reference is <strong className="text-[#111111] font-mono">{submittedRef}</strong>. Our management team reviews all feedback daily.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-[#111111] text-white text-xs font-semibold rounded hover:bg-[#303030] cursor-pointer shadow-xs transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#111111] font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                />
              </div>
              <div>
                <label className="block text-[#111111] font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#111111] font-medium mb-1">Order # (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. AUR-8941"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                />
              </div>
              <div>
                <label className="block text-[#111111] font-medium mb-1">Feedback Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                >
                  <option value="Product Quality">Product Quality & Finishing</option>
                  <option value="Delivery Speed">Delivery Speed & Packaging</option>
                  <option value="Website Experience">Website & Ordering Experience</option>
                  <option value="Payment Ease">Payment Ease & Razorpay Flow</option>
                  <option value="Customer Support">Customer Care & Support</option>
                  <option value="General Suggestion">General Suggestion</option>
                </select>
              </div>
            </div>

            {/* Star Rating Picker */}
            <div>
              <label className="block text-[#111111] font-medium mb-1.5">Overall Satisfaction</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setRating(s)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= rating ? 'fill-[#C6A66B] text-[#C6A66B]' : 'text-[#E8E2D7]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#111111] font-medium mb-1">Your Detailed Feedback & Observations</label>
              <textarea
                rows={3}
                required
                placeholder="What did you love? Where can AURRA improve?"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#777777] hover:text-[#111111]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#111111] hover:bg-[#303030] text-white font-semibold rounded transition-colors cursor-pointer shadow-xs"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
