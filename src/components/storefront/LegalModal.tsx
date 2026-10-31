import React, { useState } from 'react';
import { X, Shield, FileText, Truck, RotateCcw, Award, Scale } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'shipping' | 'returns' | 'warranty' | 'compliance';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms'
}) => {
  const [tab, setTab] = useState<'terms' | 'privacy' | 'shipping' | 'returns' | 'warranty' | 'compliance'>(initialTab);

  if (!isOpen) return null;

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
            Regulatory & Legal Transparency
          </span>
          <h2 className="text-2xl font-serif text-[#111111]">Statutory Disclosures & Policies</h2>
          <p className="text-xs text-[#777777]">
            Formulated under the Consumer Protection (E-Commerce) Rules 2020 & Indian Legal Metrology Act.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex border-b border-[#E8E2D7] gap-4 text-xs font-medium overflow-x-auto">
          {[
            { id: 'terms', label: 'Terms of Service', icon: FileText },
            { id: 'privacy', label: 'Privacy Policy (DPDP 2023)', icon: Shield },
            { id: 'shipping', label: 'Shipping & Logistics', icon: Truck },
            { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
            { id: 'warranty', label: '2-Year Warranty', icon: Award },
            { id: 'compliance', label: 'Grievance & Legal Metrology', icon: Scale }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`pb-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 -mb-[2px] whitespace-nowrap ${
                tab === item.id
                  ? 'border-[#111111] text-[#111111] font-semibold'
                  : 'border-transparent text-[#777777] hover:text-[#111111]'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 text-xs text-[#555555] space-y-4 leading-relaxed">
          {tab === 'terms' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#111111]">1. Terms of Sale & Service</h3>
              <p>
                AURRA Horology India Pvt. Ltd. operates the e-commerce platform for sale of timepieces and accessories in India. By placing an order, you agree that you are at least 18 years of age and entering a legally binding consumer contract.
              </p>
              <h3 className="text-sm font-semibold text-[#111111]">2. Pricing & Maximum Retail Price (MRP)</h3>
              <p>
                All prices declared on our website are inclusive of Goods & Services Tax (GST @ 18% under HSN Code 9102). Prices do not exceed the declared MRP affixed on physical packaging.
              </p>
              <h3 className="text-sm font-semibold text-[#111111]">3. Payment Processing & Cryptographic Security</h3>
              <p>
                We do not capture, record, or store debit or credit card credentials. All transactions are securely routed through Razorpay Software Pvt Ltd using 256-bit SSL encryption and mandatory Reserve Bank of India (RBI) Two-Factor Authentication.
              </p>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#111111]">Digital Personal Data Protection Act (DPDP 2023) Compliance</h3>
              <p>
                We process your personal data (name, shipping address, mobile number, email) exclusively for fulfilling watch orders, issuing digital warranties, and statutory tax invoicing.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#555555]">
                <li><strong>Data Minimisation:</strong> We never collect unnecessary demographic or biometric markers.</li>
                <li><strong>No 3rd-Party Data Brokering:</strong> We never sell customer records to lead brokers or telemarketers.</li>
                <li><strong>Right to Erasure:</strong> Customers may request permanent profile erasure via privacy@aurrawatches.in.</li>
              </ul>
            </div>
          )}

          {tab === 'shipping' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#111111]">Shipping & Delivery Timelines</h3>
              <p>
                Every AURRA timepiece undergoes individual regulation and water-seal testing before dispatch. Orders are packaged in tamper-evident sealed luxury cartons.
              </p>
              <div className="p-3 bg-[#F7F4EE] rounded-lg border border-[#E8E2D7] grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-[#777777] uppercase">Metro Cities (Air Express)</div>
                  <div className="font-semibold text-[#111111] mt-0.5">2 – 3 Business Days</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#777777] uppercase">Rest of India</div>
                  <div className="font-semibold text-[#111111] mt-0.5">3 – 5 Business Days</div>
                </div>
              </div>
              <p className="text-[11px] text-[#777777]">
                Free express shipping applies to all orders with cart value ≥ ₹1,999.
              </p>
            </div>
          )}

          {tab === 'returns' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#111111]">7-Day Hassle-Free Returns & Exchanges</h3>
              <p>
                If your timepiece does not meet your aesthetic standards or fit requirements, you can initiate a return or exchange within 7 calendar days of receipt.
              </p>
              <div className="p-3 bg-[#F7F4EE] rounded-lg border border-[#E8E2D7] space-y-1.5">
                <div className="font-semibold text-[#111111]">Eligibility Guidelines:</div>
                <p className="text-[11px] text-[#777777]">
                  The watch must be unworn, undamaged, with protective plastic films intact, and housed in its original box along with the warranty certificate.
                </p>
                <div className="font-semibold text-[#111111] pt-1">Refund Turnaround:</div>
                <p className="text-[11px] text-[#777777]">
                  Refunds are credited to the original payment source within 5–7 business days upon physical return quality inspection.
                </p>
              </div>
            </div>
          )}

          {tab === 'warranty' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#111111]">2-Year Atelier Movement Warranty</h3>
              <p>
                AURRA guarantees your timepiece against internal caliber malfunctions for twenty-four (24) months from date of purchase.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#F7F4EE] rounded border border-emerald-300">
                  <div className="font-semibold text-emerald-800">What is Covered:</div>
                  <ul className="list-disc pl-4 mt-1 text-[11px] text-[#555555] space-y-1">
                    <li>Mechanical automatic & quartz timekeeping failure</li>
                    <li>Dial alignment & loose hand displacement</li>
                    <li>Internal water seal failure (within rated ATM)</li>
                    <li>Complimentary first-time battery replacement</li>
                  </ul>
                </div>
                <div className="p-3 bg-[#F7F4EE] rounded border border-[#E8E2D7]">
                  <div className="font-semibold text-[#111111]">Exclusions:</div>
                  <ul className="list-disc pl-4 mt-1 text-[11px] text-[#777777] space-y-1">
                    <li>Normal wear and tear on leather or silicone straps</li>
                    <li>Accidental crystal shatter or severe drop trauma</li>
                    <li>Unauthorized modification by non-AURRA watchmakers</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'compliance' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F7F4EE] rounded-xl border border-[#E8E2D7] space-y-2">
                <h4 className="font-semibold text-sm text-[#111111]">
                  Mandatory Consumer Protection (E-Commerce) Redressal Officer
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#777777]">Grievance Officer:</span>
                    <p className="font-medium text-[#111111]">Ms. Ananya Sen</p>
                  </div>
                  <div>
                    <span className="text-[#777777]">Email Address:</span>
                    <p className="font-medium text-[#111111]">grievance@aurrawatches.in</p>
                  </div>
                  <div>
                    <span className="text-[#777777]">Direct Helpline:</span>
                    <p className="font-medium text-[#111111]">+91 80 4920 1800 (Mon–Sat 10:00–18:00 IST)</p>
                  </div>
                  <div>
                    <span className="text-[#777777]">Acknowledgement SLA:</span>
                    <p className="font-medium text-emerald-700">Within 48 Hours | Resolution ≤ 30 Days</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F7F4EE] rounded-lg border border-[#E8E2D7] space-y-1.5">
                <h4 className="font-semibold text-[#111111]">Legal Metrology & Country of Origin Declarations</h4>
                <p className="text-[11px] text-[#777777]">
                  <strong>Manufacturer & Packer:</strong> AURRA Horology India Pvt Ltd, 4th Floor, Tech Park IV, Outer Ring Road, Bengaluru, Karnataka 560103.
                </p>
                <p className="text-[11px] text-[#777777]">
                  <strong>Country of Origin:</strong> India (Cased and Regulated in India using precision calibers imported from Japan & Switzerland).
                </p>
                <p className="text-[11px] text-[#777777]">
                  <strong>Net Quantity:</strong> 1 N Watch, 1 N Luxury Presentation Case, 1 N Warranty Card, 1 N User Manual.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
