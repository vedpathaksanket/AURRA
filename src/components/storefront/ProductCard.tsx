import React from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { WatchProduct } from '../../types/watch';
import { StoreService } from '../../services/storeService';

interface ProductCardProps {
  product: WatchProduct;
  onQuickView: (product: WatchProduct) => void;
  onAddToCart: (product: WatchProduct) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) => {
  const discountPercent = Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
  );

  return (
    <div className="group relative bg-[#FFFFFF] border border-[#E8E2D7] rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:border-[#C6A66B]/60 hover:-translate-y-1 hover:shadow-lg text-left">
      {/* Visual Slot */}
      <div className="relative aspect-[4/3] bg-[#F7F4EE] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Floating Actions */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {discountPercent > 0 ? (
            <span className="text-[11px] font-medium tracking-wide bg-[#FFFFFF]/95 backdrop-blur-md text-[#111111] px-2.5 py-1 rounded border border-[#E8E2D7] shadow-xs pointer-events-auto">
              Save {discountPercent}%
            </span>
          ) : (
            <span />
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors pointer-events-auto cursor-pointer shadow-xs ${
              isWishlisted
                ? 'bg-[#111111] text-[#C6A66B]'
                : 'bg-[#FFFFFF]/90 text-[#777777] hover:text-[#111111] hover:bg-[#FFFFFF] border border-[#E8E2D7]'
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover Quick Action Drawer */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-medium bg-[#FFFFFF] hover:bg-[#F7F4EE] text-[#111111] rounded border border-[#E8E2D7] shadow-sm transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#777777]" />
            <span>Specifications</span>
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-semibold bg-[#111111] hover:bg-[#303030] text-white rounded transition-colors cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#FFFFFF]">
        <div>
          {/* Category & Movement Metadata: Clean unboxed text with · */}
          <div className="flex items-center gap-1.5 text-[11px] tracking-wider uppercase text-[#777777]">
            <span>{product.collection}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.gender}</span>
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="text-base sm:text-lg font-serif font-medium text-[#111111] group-hover:text-[#C6A66B] transition-colors cursor-pointer mt-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#777777] line-clamp-1 mt-1 font-light">
            {product.tagline}
          </p>
        </div>

        {/* Specs snippet */}
        <div className="text-[11px] text-[#777777] flex items-center gap-2 border-t border-[#E8E2D7] pt-2.5">
          <span>{product.caseSpecs.diameterMm}mm Case</span>
          <span aria-hidden="true">·</span>
          <span>{product.caseSpecs.glass.includes('Sapphire') ? 'Sapphire' : 'Mineral'}</span>
          <span aria-hidden="true">·</span>
          <span>{product.caseSpecs.waterResistance.split(' ')[0]} ATM</span>
        </div>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-semibold text-[#111111] tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#777777] line-through tabular-nums">
              ₹{product.compareAtPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#777777]">
            <Star className="w-3.5 h-3.5 fill-[#C6A66B] text-[#C6A66B]" />
            <span className="font-medium text-[#111111]">{product.rating}</span>
            <span className="text-[#777777]">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
