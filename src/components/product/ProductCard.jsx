import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, Star, ShoppingBag, MessageCircle, Eye, ShieldCheck } from 'lucide-react';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist, setActiveModalProduct } = useStore();

  const isWishlisted = wishlist.some((p) => p.id === product.id);
  const primaryImage = product.imageUrls?.[0] || '/logo.jpg';
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleWhatsAppOrder = (e) => {
    e.stopPropagation();
    const url = generateWhatsAppOrderUrl(product, 1, product.weight);
    window.open(url, '_blank');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, product.weight);
  };

  return (
    <div
      onClick={() => setActiveModalProduct(product)}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 hover:border-gold-500/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1.5"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-ivory-100">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-forest-900/90 backdrop-blur-md text-gold-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-gold-500/40 shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-red-500 flex items-center justify-center shadow-md transition-transform active:scale-90"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
          />
        </button>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-forest-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-forest-900 font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-gold-600" />
            <span>View Details & {product.imageUrls?.length || 1} Photos</span>
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Category & Weight */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="text-gold-700 font-bold uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <span className="bg-stone-100 px-2 py-0.5 rounded-md font-medium text-stone-600">
              {product.weight}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-stone-900 text-base line-clamp-2 group-hover:text-forest-700 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mt-2 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold ml-1 text-stone-800">{product.rating || 4.9}</span>
            </div>
            <span className="text-stone-400">({product.reviewsCount || 48} reviews)</span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-stone-500 mt-2 line-clamp-2 italic leading-relaxed">
            "{product.tagline || product.description?.slice(0, 70) + '...'}"
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-lg font-extrabold text-forest-900">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* 1-Click WhatsApp Order */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors shadow-sm"
              title="Instant Order on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white flex-shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-forest-900 hover:bg-forest-800 text-gold-300 font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Add to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
