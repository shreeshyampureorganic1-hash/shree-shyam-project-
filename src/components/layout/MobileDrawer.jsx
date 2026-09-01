import React from 'react'; 
import { useStore } from '../../context/StoreContext'; 
import { X, ChevronRight, Phone, MessageCircle, Sparkles, ShoppingBag } from 'lucide-react'; 
import { generateWhatsAppGeneralContactUrl } from '../../utils/whatsapp'; 
import defaultLogo from '../../assets/logo.jpg';
 
export default function MobileDrawer() { 
  const { 
    isMobileMenuOpen, 
    setIsMobileMenuOpen, 
    setSelectedCategory, 
    settings, 
    cartCount, 
    setIsCartOpen 
  } = useStore(); 
 
  if (!isMobileMenuOpen) return null; 
 
  const navigateTo = (slug) => { 
    setSelectedCategory(slug); 
    setIsMobileMenuOpen(false); 
    const element = document.getElementById('products-section'); 
    if (element) { 
      setTimeout(() => { 
        element.scrollIntoView({ behavior: 'smooth' }); 
      }, 100); 
    } 
  }; 

  const logoSrc = settings?.logoUrl || defaultLogo;
 
  return ( 
    <div className="fixed inset-0 z-50 lg:hidden"> 
      {/* Backdrop */} 
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={() => setIsMobileMenuOpen(false)} 
      /> 
 
      {/* Drawer */} 
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-forest-900 shadow-2xl flex flex-col z-10 border-r border-gold-900/40 transform transition-transform duration-300 ease-out"> 
        {/* Header */} 
        <div className="p-4 border-b border-gold-900/30 flex items-center justify-between bg-forest-950"> 
          <div className="flex items-center space-x-3"> 
            <img 
              src={logoSrc} 
              alt="Logo" 
              className="w-10 h-10 rounded-full border border-gold-500/80 object-cover bg-stone-950" 
              onError={(e) => { e.currentTarget.src = defaultLogo; }} 
            /> 
            <div> 
              <h2 className="font-serif font-bold text-ivory-50 text-base leading-tight">Shree Shyam</h2> 
              <p className="text-[10px] text-gold-400 font-semibold tracking-wider uppercase">Pure Organic</p> 
            </div> 
          </div> 
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="p-2 text-stone-400 hover:text-white rounded-lg" 
          > 
            <X className="w-6 h-6" /> 
          </button> 
        </div> 
 
        {/* Navigation Content */} 
        <div className="flex-1 overflow-y-auto p-4 space-y-6"> 
          {/* Main Links */} 
          <div className="space-y-1"> 
            <a 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block px-4 py-3 rounded-xl text-gold-300 font-serif font-bold bg-forest-800/60" 
            > 
              Home 
            </a> 
          </div> 
 
          {/* Categories */} 
          <div> 
            <h3 className="text-[11px] font-bold text-gold-400 uppercase tracking-widest px-4 mb-2"> 
              Categories 
            </h3> 
            <div className="space-y-1"> 
              <button 
                onClick={() => navigateTo('all')} 
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-200 hover:bg-forest-800/80 text-sm font-medium transition-colors" 
              > 
                <span>All Products</span> 
                <ChevronRight className="w-4 h-4 text-gold-500" /> 
              </button> 
              <button 
                onClick={() => navigateTo('pickles')} 
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-200 hover:bg-forest-800/80 text-sm font-medium transition-colors" 
              > 
                <span>Pickles (अचार)</span> 
                <ChevronRight className="w-4 h-4 text-gold-500" /> 
              </button> 
              <button 
                onClick={() => navigateTo('morning-powders')} 
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-200 hover:bg-forest-800/80 text-sm font-medium transition-colors" 
              > 
                <span>Morning Powders</span> 
                <ChevronRight className="w-4 h-4 text-gold-500" /> 
              </button> 
              <button 
                onClick={() => navigateTo('natural-soaps')} 
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-200 hover:bg-forest-800/80 text-sm font-medium transition-colors" 
              > 
                <span>Natural Soaps</span> 
                <ChevronRight className="w-4 h-4 text-gold-500" /> 
              </button> 
              <button 
                onClick={() => navigateTo('ghee-oils')} 
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-200 hover:bg-forest-800/80 text-sm font-medium transition-colors" 
              > 
                <span>A2 Ghee & Cold Press Oils</span> 
                <ChevronRight className="w-4 h-4 text-gold-500" /> 
              </button> 
              <button 
                onClick={() => navigateTo('handmade-wellness')} 
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-200 hover:bg-forest-800/80 text-sm font-medium transition-colors" 
              > 
                <span>Handmade Wellness</span> 
                <ChevronRight className="w-4 h-4 text-gold-500" /> 
              </button> 
            </div> 
          </div> 
 
          {/* Quick Actions */} 
          <div className="pt-4 border-t border-forest-800 space-y-3"> 
            <button 
              onClick={() => { 
                setIsMobileMenuOpen(false); 
                setIsCartOpen(true); 
              }} 
              className="w-full bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-luxury-gold" 
            > 
              <ShoppingBag className="w-4 h-4" /> 
              <span>View Cart ({cartCount})</span> 
            </button> 
 
            <a 
              href={generateWhatsAppGeneralContactUrl()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm border border-emerald-500/40" 
            > 
              <MessageCircle className="w-4 h-4" /> 
              <span>Direct WhatsApp Order</span> 
            </a> 

            <a 
              href="/secure-admin" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="w-full bg-forest-950 hover:bg-forest-800 text-gold-300 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs border border-gold-900/40" 
            > 
              <span>👤 Admin Portal Gateway</span> 
            </a> 
          </div> 
        </div> 
 
        {/* Footer Contact Snippet */} 
        <div className="p-4 bg-forest-950 border-t border-forest-800 text-xs text-stone-400 space-y-1"> 
          <p className="text-ivory-100 font-semibold">{settings?.siteName || 'Shree Shyam Pure Organic'}</p> 
          <p className="text-[11px] text-stone-400">{settings?.address || 'Mirthal, Near Pathankot, Punjab, India'}</p> 
          <p className="flex items-center text-gold-400 pt-1"> 
            <Phone className="w-3.5 h-3.5 mr-1.5" /> 
            {settings?.phone || '+91 9041103099'} 
          </p> 
        </div> 
      </div> 
    </div> 
  ); 
}