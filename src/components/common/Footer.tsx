import React from 'react';
import { ShieldCheck, RefreshCw, Truck, Award, MessageSquare, HelpCircle } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (tab: 'terms' | 'privacy' | 'shipping' | 'returns' | 'warranty' | 'compliance') => void;
  onOpenFeedback: () => void;
  onOpenSupport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenFeedback, onOpenSupport }) => {
  return (
    <footer className="bg-[#111111] text-[#898989] border-t border-[#222222] pt-14 pb-10 text-xs">
      {/* 4-Pillar Trust Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#1E1E1E]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#F7F4EE]">2-Year Warranty</h4>
              <p className="mt-1 text-[#777777] leading-relaxed">Comprehensive movement coverage with complimentary servicing.</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <RefreshCw className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#F7F4EE]">7-Day Hassle-Free Returns</h4>
              <p className="mt-1 text-[#777777] leading-relaxed">Easy doorstep return and exchange with prompt verification.</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <Truck className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#F7F4EE]">Express Air Shipping</h4>
              <p className="mt-1 text-[#777777] leading-relaxed">Fast, insured delivery to 26,000+ Indian PIN codes.</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <Award className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#F7F4EE]">316L Surgical Steel</h4>
              <p className="mt-1 text-[#777777] leading-relaxed">Hypoallergenic solid steel and sapphire-coated crystal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-serif tracking-[0.2em] font-medium text-[#F7F4EE]">AURRA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]"></span>
          </div>
          <p className="text-[#888888] max-w-sm leading-relaxed">
            "Timeless style. Distinctive you." — AURRA is an independent Indian horological label bridging the gap between high-end architectural watchmaking and honest, accessible pricing.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={onOpenFeedback}
              className="flex items-center gap-1.5 text-xs text-[#C6A66B] hover:text-[#DFC28E] cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Customer Feedback
            </button>
            <span>·</span>
            <button
              onClick={onOpenSupport}
              className="flex items-center gap-1.5 text-xs text-[#C6A66B] hover:text-[#DFC28E] cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Support Desk
            </button>
          </div>
        </div>

        {/* Timepieces Column */}
        <div className="space-y-3">
          <h5 className="text-[11px] font-semibold tracking-widest uppercase text-[#F7F4EE]">Timepieces</h5>
          <ul className="space-y-2 text-[#7E7E7E]">
            <li><button onClick={() => onOpenLegal('terms')} className="hover:text-[#F7F4EE] transition-colors">Royale Chronograph</button></li>
            <li><button onClick={() => onOpenLegal('terms')} className="hover:text-[#F7F4EE] transition-colors">Sovereign Automatic</button></li>
            <li><button onClick={() => onOpenLegal('terms')} className="hover:text-[#F7F4EE] transition-colors">Luna Nacre Petite</button></li>
            <li><button onClick={() => onOpenLegal('terms')} className="hover:text-[#F7F4EE] transition-colors">Heritage Roman</button></li>
            <li><button onClick={() => onOpenLegal('terms')} className="hover:text-[#F7F4EE] transition-colors">HydroStealth 300M</button></li>
          </ul>
        </div>

        {/* Customer Care Column */}
        <div className="space-y-3">
          <h5 className="text-[11px] font-semibold tracking-widest uppercase text-[#F7F4EE]">Customer Care</h5>
          <ul className="space-y-2 text-[#7E7E7E]">
            <li><button onClick={() => onOpenLegal('shipping')} className="hover:text-[#F7F4EE] transition-colors">Shipping & Delivery</button></li>
            <li><button onClick={() => onOpenLegal('returns')} className="hover:text-[#F7F4EE] transition-colors">Return & Refund Policy</button></li>
            <li><button onClick={() => onOpenLegal('warranty')} className="hover:text-[#F7F4EE] transition-colors">2-Year Movement Warranty</button></li>
            <li><button onClick={onOpenSupport} className="hover:text-[#F7F4EE] transition-colors">Raise Support Ticket</button></li>
            <li><button onClick={onOpenFeedback} className="hover:text-[#F7F4EE] transition-colors">Share Your Feedback</button></li>
          </ul>
        </div>

        {/* Regulatory & Compliance */}
        <div className="space-y-3">
          <h5 className="text-[11px] font-semibold tracking-widest uppercase text-[#F7F4EE]">Compliance & Legal</h5>
          <ul className="space-y-2 text-[#7E7E7E]">
            <li><button onClick={() => onOpenLegal('terms')} className="hover:text-[#F7F4EE] transition-colors">Terms of Service</button></li>
            <li><button onClick={() => onOpenLegal('privacy')} className="hover:text-[#F7F4EE] transition-colors">Privacy Policy (DPDP 2023)</button></li>
            <li><button onClick={() => onOpenLegal('compliance')} className="hover:text-[#C6A66B] transition-colors">Grievance Redressal</button></li>
            <li><button onClick={() => onOpenLegal('compliance')} className="hover:text-[#F7F4EE] transition-colors">Legal Metrology & MRP</button></li>
            <li><span className="text-[#666666]">GSTIN: 29AAHCA9921E1ZY</span></li>
          </ul>
        </div>
      </div>

      {/* Statutory Grievance Redressal & Indian E-Commerce Mandate */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-[#1C1C1C] flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-[#666666]">
        <p>
          © 2026 AURRA Horology India Pvt Ltd. All rights reserved. Registered under the Consumer Protection (E-Commerce) Rules 2020.
        </p>
        <div className="flex items-center gap-3 text-[#777777]">
          <span>Grievance Officer: Ms. Ananya Sen</span>
          <span>·</span>
          <span>grievance@aurrawatches.in</span>
          <span>·</span>
          <span>Razorpay Verified</span>
        </div>
      </div>
    </footer>
  );
};
