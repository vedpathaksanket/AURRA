import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, Shield, User, LayoutDashboard, Heart } from 'lucide-react';
import { StoreService } from '../../services/storeService';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAccount: (tab?: string) => void;
  onOpenStylist: () => void;
  onOpenTracking: () => void;
  onFilterCategory: (category: string) => void;
  isAdminView: boolean;
  onToggleAdminView: () => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenAccount,
  onOpenStylist,
  onOpenTracking,
  onFilterCategory,
  isAdminView,
  onToggleAdminView,
  cartCount
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const wishlistCount = StoreService.getWishlist().length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onFilterCategory(`search:${searchQuery.trim()}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#E8E2D7] transition-colors">
      {/* Top micro-announcement banner: slim, dignified */}
      <div className="bg-[#EFEAE1] text-[#777777] text-[11px] py-1.5 px-4 text-center tracking-wide border-b border-[#E8E2D7] flex justify-between items-center max-w-7xl mx-auto">
        <span className="hidden sm:inline">Affordable Luxury · Free Express Shipping Across India · 2-Year Movement Warranty</span>
        <span className="sm:hidden mx-auto">Free Express Shipping · 2-Year Warranty</span>
        <div className="hidden sm:flex items-center gap-4 text-[#777777]">
          <button onClick={onOpenTracking} className="hover:text-[#111111] transition-colors cursor-pointer">
            Track Order
          </button>
          <span>·</span>
          <button onClick={() => onOpenAccount('warranty')} className="hover:text-[#111111] transition-colors cursor-pointer">
            Digital Warranty
          </button>
        </div>
      </div>

      {/* Strict 1-row, 3-zone Header Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Iconic Horological Insignia & Serif Wordmark) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onFilterCategory('All');
            }}
            className="group flex items-center gap-2.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="AURRA Horology Home"
          >
            {/* Bespoke Horological Insignia Emblem for AURRA */}
            <div className="relative w-8 h-8 rounded-full border border-[#C6A66B]/70 p-1 flex items-center justify-center bg-[#FFFFFF] shadow-[0_2px_8px_rgba(198,166,107,0.15)] group-hover:border-[#C6A66B] group-hover:shadow-[0_2px_12px_rgba(198,166,107,0.3)] transition-all">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-[#C6A66B]"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Outer subtle celestial orbit */}
                <circle cx="12" cy="12" r="9.5" stroke="#C6A66B" strokeWidth="0.8" strokeDasharray="1.5 2.5" opacity="0.6" />
                {/* Horological Hour Cardinal Marks */}
                <line x1="12" y1="2" x2="12" y2="4" stroke="#C6A66B" strokeWidth="1.2" />
                <line x1="12" y1="20" x2="12" y2="22" stroke="#C6A66B" strokeWidth="1.2" />
                <line x1="2" y1="12" x2="4" y2="12" stroke="#C6A66B" strokeWidth="1.2" />
                <line x1="20" y1="12" x2="22" y2="12" stroke="#C6A66B" strokeWidth="1.2" />
                {/* The Iconic Architectural 'A' Apex & Crossbar */}
                <path d="M12 4.5L6.5 18.5H8.8L12 9.5L15.2 18.5H17.5L12 4.5Z" fill="currentColor" fillOpacity="0.25" stroke="#C6A66B" strokeWidth="1.2" />
                <path d="M8 14.5H16" stroke="#C6A66B" strokeWidth="1.2" />
                {/* Center Crown Pivot */}
                <circle cx="12" cy="12.5" r="1.1" fill="#C6A66B" />
              </svg>
            </div>

            {/* Refined Brand Wordmark */}
            <span className="text-2xl sm:text-[26px] font-serif tracking-[0.24em] font-medium text-[#111111] group-hover:text-[#C6A66B] transition-colors leading-none">
              AURRA
            </span>
          </a>
        </div>

        {/* Zone 2: 4-5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wider uppercase text-[#303030]">
          <button
            onClick={() => onFilterCategory('Men')}
            className="hover:text-[#C6A66B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Men
          </button>
          <button
            onClick={() => onFilterCategory('Women')}
            className="hover:text-[#C6A66B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Women
          </button>
          <button
            onClick={() => onFilterCategory('Automatic')}
            className="hover:text-[#C6A66B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Mechanical
          </button>
          <button
            onClick={() => onFilterCategory('Chronograph')}
            className="hover:text-[#C6A66B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Chronograph
          </button>
          <button
            onClick={onOpenStylist}
            className="text-[#997A40] hover:text-[#111111] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
            AI Stylist
          </button>
        </nav>

        {/* Zone 3: Interactive Controls & Owner Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-[#303030] hover:text-[#111111] hover:bg-[#EAE4D8] rounded-md transition-colors cursor-pointer"
            aria-label="Search watches"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist button */}
          <button
            onClick={() => onOpenAccount('wishlist')}
            className="p-2 text-[#303030] hover:text-[#111111] hover:bg-[#EAE4D8] rounded-md transition-colors relative cursor-pointer hidden sm:block"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C6A66B]" />
            )}
          </button>

          {/* Customer Account Button */}
          <button
            onClick={() => onOpenAccount('orders')}
            className="p-2 text-[#303030] hover:text-[#111111] hover:bg-[#EAE4D8] rounded-md transition-colors cursor-pointer"
            aria-label="Account and orders"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Shopping Bag Trigger - Obsidian Black Primary Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#FFFFFF] bg-[#111111] hover:bg-[#303030] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span className="tabular-nums">{cartCount}</span>
          </button>

          {/* Owner Portal Mode Toggle */}
          <button
            onClick={onToggleAdminView}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
              isAdminView
                ? 'bg-[#111111] text-[#FFFFFF] border-[#111111] shadow-sm'
                : 'bg-[#FFFFFF] text-[#303030] border-[#E8E2D7] hover:border-[#C6A66B] hover:text-[#111111]'
            }`}
            title="Switch between Customer Storefront and Owner Command Center"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span className="hidden lg:inline">{isAdminView ? 'Storefront' : 'Owner Portal'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {isSearchOpen && (
        <div className="bg-[#FFFFFF] border-b border-[#E8E2D7] px-4 py-3 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-[#777777]" />
            <input
              type="text"
              placeholder="Search by collection (Royale, Sovereign), movement (Automatic, Chrono), or dial color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#171717] placeholder-[#888888] focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#777777] hover:text-[#111111]"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-3.5 py-1 bg-[#111111] text-white text-xs font-semibold rounded hover:bg-[#303030] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
