import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { WatchProduct } from '../../types/watch';
import { ProductCard } from './ProductCard';

interface CollectionGridProps {
  products: WatchProduct[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onQuickView: (product: WatchProduct) => void;
  onAddToCart: (product: WatchProduct) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onQuickView,
  onAddToCart,
  wishlistIds,
  onToggleWishlist
}) => {
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStrap, setSelectedStrap] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [selectedMovement, setSelectedMovement] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category / Search handling
      if (activeCategory.startsWith('search:')) {
        const query = activeCategory.replace('search:', '').toLowerCase();
        const matches =
          p.name.toLowerCase().includes(query) ||
          p.tagline.toLowerCase().includes(query) ||
          p.collection.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.movement.type.toLowerCase().includes(query);
        if (!matches) return false;
      } else if (activeCategory !== 'All') {
        if (activeCategory === 'Men' || activeCategory === 'Women') {
          if (p.gender !== activeCategory && p.gender !== 'Unisex') return false;
        } else if (activeCategory === 'Automatic' || activeCategory === 'Chronograph') {
          if (p.category !== activeCategory && !p.movement.type.includes(activeCategory)) return false;
        }
      }

      // Gender filter
      if (selectedGender !== 'all') {
        if (selectedGender === 'men' && p.gender !== 'Men' && p.gender !== 'Unisex') return false;
        if (selectedGender === 'women' && p.gender !== 'Women' && p.gender !== 'Unisex') return false;
      }

      // Strap filter
      if (selectedStrap !== 'all') {
        const hasStrap = p.variants?.some((v) =>
          v.strapMaterial.toLowerCase().includes(selectedStrap.toLowerCase())
        );
        if (!hasStrap) return false;
      }

      // Price filter
      if (selectedPrice === 'under-4000' && p.price >= 4000) return false;
      if (selectedPrice === '4000-5000' && (p.price < 4000 || p.price > 5000)) return false;
      if (selectedPrice === 'above-5000' && p.price <= 5000) return false;

      // Movement filter
      if (selectedMovement !== 'all') {
        if (selectedMovement === 'automatic' && !p.movement.type.includes('Automatic')) return false;
        if (selectedMovement === 'quartz' && !p.movement.type.includes('Quartz')) return false;
        if (selectedMovement === 'chronograph' && !p.movement.type.includes('Chronograph')) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });
  }, [products, activeCategory, selectedGender, selectedStrap, selectedPrice, selectedMovement, sortBy]);

  const activeFilterCount =
    (selectedGender !== 'all' ? 1 : 0) +
    (selectedStrap !== 'all' ? 1 : 0) +
    (selectedPrice !== 'all' ? 1 : 0) +
    (selectedMovement !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSelectedGender('all');
    setSelectedStrap('all');
    setSelectedPrice('all');
    setSelectedMovement('all');
    onSelectCategory('All');
  };

  return (
    <section id="collection-grid" className="py-14 sm:py-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E8E2D7] text-left">
          <div>
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C6A66B]">
              The AURRA Horological Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#111111] mt-1">
              Curated Timepieces
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] font-light mt-1">
              Each piece is individually regulated, water-pressure tested, and backed by our 2-Year Atelier Warranty.
            </p>
          </div>

          {/* Quick Category Segmented Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFEAE1] rounded-lg border border-[#E8E2D7]">
            {['All', 'Men', 'Women', 'Chronograph', 'Automatic'].map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#111111] text-white font-semibold shadow-xs'
                    : 'text-[#555555] hover:text-[#111111]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md border transition-colors cursor-pointer shadow-xs ${
                showFilterDrawer || activeFilterCount > 0
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-[#FFFFFF] text-[#171717] border-[#E8E2D7] hover:border-[#C6A66B]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[#777777] hover:text-[#111111] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {activeCategory.startsWith('search:') && (
              <span className="text-[#111111] bg-[#FFFFFF] px-2.5 py-1 rounded border border-[#E8E2D7] shadow-xs flex items-center gap-1.5">
                <span className="text-[#777777]">Search:</span> {activeCategory.replace('search:', '')}
                <button onClick={() => onSelectCategory('All')} className="hover:text-[#C6A66B]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#777777] hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FFFFFF] border border-[#E8E2D7] text-[#171717] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#C6A66B] shadow-xs cursor-pointer"
              >
                <option value="featured">Featured Collections</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <span className="text-[#777777] ml-2 tabular-nums">
              Showing {filteredProducts.length} pieces
            </span>
          </div>
        </div>

        {/* Collapsible Filter Bar */}
        {showFilterDrawer && (
          <div className="mb-8 p-5 bg-[#FFFFFF] border border-[#E8E2D7] rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left animate-in fade-in duration-200">
            {/* Filter 1: Gender */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C6A66B]">
                Gender
              </label>
              <div className="flex flex-col gap-1.5 text-xs text-[#555555]">
                {['all', 'men', 'women'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                      selectedGender === g ? 'bg-[#F7F4EE] text-[#111111] font-semibold' : 'hover:bg-[#F7F4EE]'
                    }`}
                  >
                    <span className="capitalize">{g === 'all' ? 'All Collections' : `${g}'s Watches`}</span>
                    {selectedGender === g && <Check className="w-3.5 h-3.5 text-[#C6A66B]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 2: Strap Material */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C6A66B]">
                Strap Material
              </label>
              <div className="flex flex-col gap-1.5 text-xs text-[#555555]">
                {[
                  { id: 'all', label: 'All Straps' },
                  { id: 'leather', label: 'Italian Leather' },
                  { id: 'steel', label: '316L Stainless Steel' },
                  { id: 'silicone', label: 'Silicone & Fluoroelastomer' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStrap(s.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                      selectedStrap === s.id ? 'bg-[#F7F4EE] text-[#111111] font-semibold' : 'hover:bg-[#F7F4EE]'
                    }`}
                  >
                    <span>{s.label}</span>
                    {selectedStrap === s.id && <Check className="w-3.5 h-3.5 text-[#C6A66B]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 3: Price Range */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C6A66B]">
                Price Range
              </label>
              <div className="flex flex-col gap-1.5 text-xs text-[#555555]">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-4000', label: 'Under ₹4,000' },
                  { id: '4000-5000', label: '₹4,000 – ₹5,000' },
                  { id: 'above-5000', label: 'Above ₹5,000' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPrice(p.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                      selectedPrice === p.id ? 'bg-[#F7F4EE] text-[#111111] font-semibold' : 'hover:bg-[#F7F4EE]'
                    }`}
                  >
                    <span>{p.label}</span>
                    {selectedPrice === p.id && <Check className="w-3.5 h-3.5 text-[#C6A66B]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 4: Movement Type */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C6A66B]">
                Movement Type
              </label>
              <div className="flex flex-col gap-1.5 text-xs text-[#555555]">
                {[
                  { id: 'all', label: 'All Calibers' },
                  { id: 'chronograph', label: 'Precision Chronograph' },
                  { id: 'automatic', label: 'Mechanical Automatic' },
                  { id: 'quartz', label: 'Japanese & Swiss Quartz' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMovement(m.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                      selectedMovement === m.id ? 'bg-[#F7F4EE] text-[#111111] font-semibold' : 'hover:bg-[#F7F4EE]'
                    }`}
                  >
                    <span>{m.label}</span>
                    {selectedMovement === m.id && <Check className="w-3.5 h-3.5 text-[#C6A66B]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Grid: Generous whitespace, 3 cols desktop, 2 cols tablet */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#FFFFFF] border border-[#E8E2D7] rounded-xl space-y-3 shadow-xs">
            <p className="text-base text-[#111111]">No timepieces match your specific filters.</p>
            <p className="text-xs text-[#777777]">Try resetting your filters or exploring our full catalog.</p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 bg-[#111111] text-white text-xs font-semibold rounded hover:bg-[#303030] cursor-pointer transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
