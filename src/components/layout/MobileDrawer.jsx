import React from 'react'; 
import { useStore } from '../../context/StoreContext'; 
import { X, ChevronRight, Phone, MessageCircle, Sparkles, ShoppingBag } from 'lucide-react'; 
import { generateWhatsAppGeneralContactUrl } from '../../utils/whatsapp'; 
 
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
              src={settings.logoUrl || '/logo.jpg'} 
              alt="Logo" 
              className="w-10 h-10 rounded-full border border-gold-500/80 object-cover" 
              onError={(e) => { e.target.src = '/logo.jpg'; }} 
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
 
        {/* Menu Links */} 
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1"> 
          <button 
            onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-stone-200 hover:bg-forest-800 hover:text-gold-300 font-medium text-sm transition-all" 
          > 
            <span>Home</span> 
            <ChevronRight className="w-4 h-4 text-stone-500" /> 
          </button> 
 
          <button 
            onClick={() => navigateTo('all')} 
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-stone-200 hover:bg-forest-800 hover:text-gold-300 font-medium text-sm transition-all" 
          > 
            <span className="flex items-center"> 
              <Sparkles className="w-4 h-4 text-gold-400 mr-2" /> All Products 
            </span> 
            <ChevronRight className="w-4 h-4 text-stone-500" /> 
          </button> 
 
          <div className="pt-2 pb-1 px-4 text-[11px] font-bold text-gold-400 uppercase tracking-wider"> 
            Categories 
          </div> 
 
          <button 
            onClick={() => navigateTo('pickles')} 
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-300 hover:bg-forest-800 hover:text-gold-300 text-sm transition-all" 
          > 
            <span>Pickles (अचार)</span> 
            <ChevronRight className="w-4 h-4 text-stone-500" /> 
          </button> 
 
          <button 
            onClick={() => navigateTo('morning-powders')} 
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-300 hover:bg-forest-800 hover:text-gold-300 text-sm transition-all" 
          > 
            <span>Morning Powders</span> 
            <ChevronRight className="w-4 h-4 text-stone-500" /> 
          </button> 
 
          <button 
            onClick={() => navigateTo('natural-soaps')} 
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-300 hover:bg-forest-800 hover:text-gold-300 text-sm transition-all" 
          > 
            <span>Natural Soaps</span> 
            <ChevronRight className="w-4 h-4 text-stone-500" /> 
          </button> 
 
          <button 
            onClick={() => navigateTo('ghee-oils')} 
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-300 hover:bg-forest-800 hover:text-gold-300 text-sm transition-all" 
          > 
            <span>A2 Ghee & Cold Pressed Oils</span> 
            <ChevronRight className="w-4 h-4 text-stone-500" /> 
          </button> 
 
          <button 
            onClick={() => navigateTo('handmade-wellness')} 
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-300 hover:bg-forest-800 hover:text-gold-300 text-sm transition-all" 
          > 
            <span>Handmade Wellness</span> 
            <ChevronRight className="w-4 h-4 text-stone-500" /> 
          </button> 
 
          <div className="pt-3 border-t border-forest-800 space-y-1"> 
            <a 
              href="#why-us" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-300 hover:bg-forest-800 hover:text-gold-300 text-sm transition-all" 
            > 
              <span>About Pure Quality</span> 
              <ChevronRight className="w-4 h-4 text-stone-500" /> 
            </a> 
 
            <a 
              href="#contact" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-stone-300 hover:bg-forest-800 hover:text-gold-300 text-sm transition-all" 
            > 
              <span>Contact Us</span> 
              <ChevronRight className="w-4 h-4 text-stone-500" /> 
            </a> 
          </div> 
        </div> 
 
        {/* Footer Actions */} 
        <div className="p-4 border-t border-gold-900/30 bg-forest-950 space-y-2.5"> 
          <button 
            onClick={() => { 
              setIsMobileMenuOpen(false); 
              setIsCartOpen(true); 
            }} 
            className="w-full bg-forest-800 hover:bg-forest-700 text-gold-300 py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-sm border border-gold-600/30" 
          > 
            <ShoppingBag className="w-4 h-4" /> 
            <span>View Cart ({cartCount})</span> 
          </button> 
 
          <a 
            href={generateWhatsAppGeneralContactUrl()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-sm shadow-md" 
          > 
            <MessageCircle className="w-4 h-4" /> 
            <span>Chat on WhatsApp</span> 
          </a> 
 
          
        </div> 
      </div> 
    </div> 
  ); 
} 