import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { generateWhatsAppGeneralContactUrl } from '../../utils/whatsapp';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    settings
  } = useStore();

  if (!isCartOpen) return null;

  const freeDeliveryTarget = settings.freeDeliveryThreshold || 999;
  const amountNeeded = Math.max(0, freeDeliveryTarget - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeDeliveryTarget) * 100);

  // Generate WhatsApp message for entire cart
  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const whatsappNumber = (settings.whatsappNumber || '919876543210').replace(/[^0-9]/g, '');
    const itemsList = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* (${item.selectedWeight})\n   Qty: ${item.quantity} × ₹${item.price} = ₹${
            item.price * item.quantity
          }`
      )
      .join('\n\n');

    const total = cartSubtotal;
    const shipping = total >= freeDeliveryTarget ? 'FREE' : '₹99';

    const text = `🌿 *ORDER REQUEST - SHREE SHYAM PURE ORGANIC* 🌿
----------------------------------------
*Items in Bag:*

${itemsList}

----------------------------------------
*Subtotal:* ₹${total}
*Delivery Charges:* ${shipping}
----------------------------------------
Namaste! I would like to place this order. Please share your UPI / payment details and dispatch timeline.`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-forest-900 shadow-2xl flex flex-col border-l border-gold-900/40">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-forest-800 bg-forest-950 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-forest-800 text-gold-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-ivory-50">Your Organic Bag</h3>
                <p className="text-xs text-stone-400">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-forest-950/80 px-5 py-3 border-b border-forest-800">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-stone-300">
                {amountNeeded > 0 ? (
                  <>
                    Add <strong className="text-gold-400">₹{amountNeeded}</strong> more for{' '}
                    <strong className="text-emerald-400">FREE Express Delivery</strong>
                  </>
                ) : (
                  <strong className="text-emerald-400 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> You unlocked FREE Express Delivery!
                  </strong>
                )}
              </span>
              <span className="text-gold-300 font-bold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-forest-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-forest-800 text-gold-400 flex items-center justify-center mx-auto mb-4 border border-gold-900/40">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-bold text-ivory-100">Your bag is empty</h4>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  Explore our authentic pure organic pickles, healthy morning powders, and natural soaps!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 bg-gold-600 hover:bg-gold-500 text-forest-900 font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-luxury-gold"
                >
                  Explore Organic Products
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedWeight}`}
                  className="bg-forest-800/60 border border-forest-700/80 rounded-2xl p-3.5 flex space-x-3.5 items-center"
                >
                  <img
                    src={item.imageUrls?.[0] || '/logo.jpg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-gold-900/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif font-bold text-ivory-100 text-sm truncate leading-snug">
                      {item.name}
                    </h5>
                    <div className="text-xs text-gold-400 mt-0.5 font-medium">
                      Pack: {item.selectedWeight} • ₹{item.price} each
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      {/* Stepper */}
                      <div className="flex items-center space-x-2 bg-forest-900/90 rounded-lg border border-forest-700 px-2 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.selectedWeight, item.quantity - 1)}
                          className="text-stone-400 hover:text-white p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-ivory-100 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.selectedWeight, item.quantity + 1)}
                          className="text-stone-400 hover:text-white p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-gold-300 text-sm">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.selectedWeight)}
                    className="p-1.5 text-stone-400 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-forest-800 bg-forest-950 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-ivory-100">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className={amountNeeded === 0 ? 'text-emerald-400 font-bold' : 'text-stone-300'}>
                    {amountNeeded === 0 ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gold-300 pt-2 border-t border-forest-800">
                  <span>Total Amount</span>
                  <span>₹{amountNeeded === 0 ? cartSubtotal : cartSubtotal + 99}</span>
                </div>
              </div>

              {/* 1-Click WhatsApp Order */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-lg transform active:scale-98 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>1-Click Order on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  alert('Thank you! Direct order processing is seamlessly supported via 1-Click WhatsApp Order above for instant personal confirmation.');
                  handleWhatsAppCheckout();
                }}
                className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-forest-900 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs transition-all shadow-luxury-gold"
              >
                <span>Proceed with Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
