import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Plus, 
  Minus, 
  Maximize2,
  Leaf,
  Droplets,
  Truck
} from 'lucide-react';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';

export default function ProductDetailModal() {
  const { activeModalProduct, setActiveModalProduct, addToCart, toggleWishlist, wishlist } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (!activeModalProduct) return null;

  const product = activeModalProduct;
  const isWishlisted = wishlist.some((p) => p.id === product.id);
  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ['/logo.jpg'];
  const currentImage = images[selectedImageIndex] || images[0];

  const weightOptions = product.weightOptions || [product.weight || 'Standard'];
  const activeWeight = selectedWeight || weightOptions[0];

  const handleWhatsAppOrder = () => {
    const url = generateWhatsAppOrderUrl(product, quantity, activeWeight);
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, activeWeight);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setActiveModalProduct(null)}
      />

      <div className="min-h-screen px-4 py-8 sm:py-12 flex items-center justify-center">
        <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl z-10 border border-gold-500/30 animate-fade-in">
          {/* Close Button */}
          <button
            onClick={() => setActiveModalProduct(null)}
            className="absolute top-4 right-4 z-20 bg-forest-900/80 hover:bg-forest-900 text-gold-300 p-2.5 rounded-full shadow-lg transition-transform active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Multi-Image Gallery (Up to 8 images) */}
            <div className="bg-ivory-100 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
              {/* Main Image with Zoom Trigger */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-inner group">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <button
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute bottom-3 right-3 bg-forest-900/80 hover:bg-forest-900 text-gold-300 p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 shadow-md"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Zoom</span>
                </button>

                {product.badge && (
                  <span className="absolute top-3 left-3 bg-forest-900 text-gold-300 text-xs font-bold px-3 py-1 rounded-full border border-gold-500/40">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails Rail (Up to 8 images support) */}
              {images.length > 1 && (
                <div className="mt-4 flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-gold-600 ring-2 ring-gold-400/40 scale-105'
                          : 'border-stone-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Purity Guarantee Footer Badge */}
              <div className="mt-4 pt-4 border-t border-stone-200/80 flex items-center justify-around text-[11px] font-bold text-forest-900">
                <span className="flex items-center">
                  <ShieldCheck className="w-4 h-4 text-gold-600 mr-1" /> 100% Pure Organic
                </span>
                <span className="flex items-center">
                  <Leaf className="w-4 h-4 text-emerald-600 mr-1" /> Zero Chemicals
                </span>
                <span className="flex items-center">
                  <Truck className="w-4 h-4 text-gold-600 mr-1" /> Fast Shipping
                </span>
              </div>
            </div>

            {/* Right: Product Details & WhatsApp Ordering */}
            <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Category & Ratings */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-gold-700">
                    {product.category}
                  </span>
                  <div className="flex items-center text-xs space-x-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating || 4.9}</span>
                    <span className="text-stone-400 font-normal">({product.reviewsCount || 48} verified reviews)</span>
                  </div>
                </div>

                {/* Product Title */}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 leading-tight">
                  {product.name}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black text-forest-900">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-stone-400 line-through">₹{product.originalPrice}</span>
                  )}
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    Inclusive of all taxes
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>

                {/* Weight Options Selector */}
                {weightOptions.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      Select Pack Size: <span className="text-forest-900 font-extrabold">{activeWeight}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {weightOptions.map((w) => (
                        <button
                          key={w}
                          onClick={() => setSelectedWeight(w)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            activeWeight === w
                              ? 'bg-forest-900 text-gold-300 border-gold-600 shadow-sm'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-gold-400'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredients & Benefits Tabs */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="bg-ivory-50 rounded-2xl p-4 border border-gold-900/10 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600 mr-1.5" /> Key Organic Ingredients:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {product.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="bg-white text-stone-700 text-xs px-2.5 py-1 rounded-lg border border-stone-200"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.benefits && product.benefits.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600 mr-1.5" /> Health & Wellness Benefits:
                    </h4>
                    <ul className="space-y-1 text-xs text-stone-600">
                      {product.benefits.map((ben, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 flex-shrink-0 mt-0.5" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Quantity Stepper & Buy Buttons */}
              <div className="pt-6 mt-6 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Quantity
                  </span>
                  <div className="flex items-center space-x-3 bg-stone-100 rounded-xl px-3 py-1 border border-stone-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-stone-600 hover:text-forest-900"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-forest-900 w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-stone-600 hover:text-forest-900"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 1-Click WhatsApp Direct Order Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-lg transform active:scale-98 transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>1-Click Order Direct on WhatsApp (₹{product.price * quantity})</span>
                </button>

                {/* Add to Bag and Wishlist */}
                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="col-span-4 bg-forest-900 hover:bg-forest-800 text-gold-300 font-bold py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 text-sm transition-all shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="col-span-1 border border-stone-300 hover:border-gold-500 rounded-2xl flex items-center justify-center text-stone-700 hover:text-red-500 transition-colors"
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen High-Res Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentImage}
            alt="Full resolution product view"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl"
          />
        </div>
      )}
    </div>
  );
}
