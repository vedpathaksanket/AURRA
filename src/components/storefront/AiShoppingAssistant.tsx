import React, { useState } from 'react';
import { X, Sparkles, Send, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { WatchProduct } from '../../types/watch';

interface AiShoppingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: WatchProduct) => void;
  products: WatchProduct[];
}

export const AiShoppingAssistant: React.FC<AiShoppingAssistantProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  products
}) => {
  const [occasion, setOccasion] = useState<string>('Business Formal');
  const [budget, setBudget] = useState<number>(5000);
  const [gender, setGender] = useState<string>('Men');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<
    { sender: 'user' | 'assistant'; text: string; recommendedWatchId?: string }[]
  >([
    {
      sender: 'assistant',
      text: 'Greetings. I am your personal AURRA Horological Stylist. Whether selecting a distinguished timepiece for weddings, daily boardrooms, or gifting, tell me your vision.'
    }
  ]);

  if (!isOpen) return null;

  const handleAskStylist = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = customQuery.trim() || `Looking for a ${gender}'s watch for ${occasion} within ₹${budget.toLocaleString('en-IN')}`;

    const userMsg = { sender: 'user' as const, text: query };
    setConversation((prev) => [...prev, userMsg]);
    setCustomQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/ai/shopping-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, budget, occasion, gender })
      });
      const data = await res.json();

      // Find matching watch from current catalog
      let matchedId = 'prod-chrono-royale';
      if (gender === 'Women' || query.toLowerCase().includes('women')) {
        matchedId = 'prod-luna-rose';
      } else if (occasion === 'Sports' || query.toLowerCase().includes('sport') || query.toLowerCase().includes('diver')) {
        matchedId = 'prod-hydrostealth-diver';
      } else if (occasion === 'Wedding & Celebration' || query.toLowerCase().includes('gold') || query.toLowerCase().includes('emerald')) {
        matchedId = 'prod-sovereign-emerald';
      }

      setConversation((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: data.reply || 'Discover our handcrafted collection designed for distinct refinement.',
          recommendedWatchId: matchedId
        }
      ]);
    } catch {
      setConversation((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'We warmly recommend the **AURRA Chrono Royale 42mm (₹4,499)** or **AURRA Sovereign Emerald 40mm (₹5,299)** for distinguished versatility and reliable everyday confidence.',
          recommendedWatchId: 'prod-chrono-royale'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl shadow-2xl p-6 text-left max-h-[92vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E2D7] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F7F4EE] rounded-lg text-[#C6A66B] border border-[#E8E2D7]">
              <Sparkles className="w-5 h-5 text-[#C6A66B]" />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C6A66B]">
                AI Horological Stylist
              </span>
              <h2 className="text-xl font-serif text-[#111111]">AURRA Concierge</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-[#111111] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Style Preference Matrix */}
        <div className="py-3 border-b border-[#E8E2D7] space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#777777] text-[11px]">Occasion:</span>
            {['Business Formal', 'Wedding & Celebration', 'Everyday Minimal', 'Sports & Travel'].map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => setOccasion(occ)}
                className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer transition-colors ${
                  occasion === occ
                    ? 'bg-[#111111] text-white font-semibold border-[#111111]'
                    : 'bg-[#F7F4EE] text-[#555555] border-[#E8E2D7] hover:border-[#111111]'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#777777] text-[11px]">Gender:</span>
              {['Men', 'Women', 'Unisex'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-2 py-0.5 rounded text-[11px] border cursor-pointer transition-colors ${
                    gender === g
                      ? 'bg-[#111111] text-white font-semibold border-[#111111]'
                      : 'bg-[#F7F4EE] text-[#555555] border-[#E8E2D7] hover:border-[#111111]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#111111] font-medium">
              <span>Max: ₹{budget.toLocaleString('en-IN')}</span>
              <input
                type="range"
                min={2500}
                max={9000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-20 accent-[#111111] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Chat / Recommendation Stream */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-72 text-xs">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl max-w-[90%] shadow-xs ${
                msg.sender === 'user'
                  ? 'ml-auto bg-[#111111] text-white border border-[#111111]'
                  : 'mr-auto bg-[#F7F4EE] text-[#171717] border border-[#E8E2D7]'
              }`}
            >
              <div className={`text-[10px] font-semibold mb-1 uppercase tracking-wider ${
                msg.sender === 'user' ? 'text-[#C6A66B]' : 'text-[#777777]'
              }`}>
                {msg.sender === 'user' ? 'You' : 'AURRA Stylist'}
              </div>
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

              {msg.recommendedWatchId && (
                <div className="mt-3 pt-2 border-t border-[#E8E2D7] flex items-center justify-between">
                  <span className="text-[11px] text-[#777777]">
                    Recommended Piece in Vault
                  </span>
                  <button
                    onClick={() => {
                      const prod = products.find((p) => p.id === msg.recommendedWatchId);
                      if (prod) {
                        onSelectProduct(prod);
                        onClose();
                      }
                    }}
                    className="text-xs font-semibold text-[#111111] hover:text-[#C6A66B] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View Timepiece</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="p-3 bg-[#F7F4EE] rounded-xl text-xs text-[#777777] flex items-center gap-2 border border-[#E8E2D7]">
              <div className="w-3.5 h-3.5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
              <span>Analyzing watch calibers, dimensions, and styling palette...</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <form onSubmit={handleAskStylist} className="pt-3 border-t border-[#E8E2D7] flex gap-2">
          <input
            type="text"
            placeholder="Ask anything (e.g., 'What goes well with a navy blazer?')..."
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            className="flex-1 bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#111111] hover:bg-[#303030] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1 disabled:opacity-50 shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Consult</span>
          </button>
        </form>
      </div>
    </div>
  );
};
