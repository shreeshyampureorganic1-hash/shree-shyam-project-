import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, ShoppingBag, Heart, Menu, X, PhoneCall } from 'lucide-react';

export default function Navbar() {
  const {
    settings,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setSelectedCategory,
    categories
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryNav = (slug) => {
    setSelectedCategory(slug);
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-forest-900/95 backdrop-blur-md shadow-luxury border-b border-gold-900/30 py-2.5'
          : 'bg-forest-900 border-b border-gold-900/20 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gold-300 hover:text-gold-200 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Name */}
          <a
            href="/"
            className="flex items-center space-x-3 group text-decoration-none"
          >
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gold-500/80 shadow-luxury-gold flex-shrink-0 bg-stone-900 p-0.5">
              <img
                src={settings.logoUrl || '/logo.jpg'}
                alt={settings.siteName || 'Shree Shyam Pure Organic'}
                className="w-full h-full object-contain rounded-full transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/logo.jpg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-ivory-50 group-hover:text-gold-300 transition-colors leading-tight">
                Shree Shyam
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                Pure Organic
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium text-stone-200">
            <a
              href="/"
              className="hover:text-gold-400 transition-colors py-1 relative group font-semibold text-gold-300"
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-400 scale-x-100 transition-transform"></span>
            </a>

            <button
              onClick={() => handleCategoryNav('all')}
              className="hover:text-gold-400 transition-colors py-1"
            >
              All Products
            </button>

            <button
              onClick={() => handleCategoryNav('pickles')}
              className="hover:text-gold-400 transition-colors py-1"
            >
              Pickles (अचार)
            </button>

            <button
              onClick={() => handleCategoryNav('morning-powders')}
              className="hover:text-gold-400 transition-colors py-1"
            >
              Morning Powders
            </button>

            <button
              onClick={() => handleCategoryNav('natural-soaps')}
              className="hover:text-gold-400 transition-colors py-1"
            >
              Natural Soaps
            </button>

            <a href="#why-us" className="hover:text-gold-400 transition-colors py-1">
              Why Us
            </a>

            <a href="#contact" className="hover:text-gold-400 transition-colors py-1">
              Contact
            </a>
          </div>

          {/* Right Action Icons (Search, Wishlist, Cart) - Hidden Admin link! */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-stone-300 hover:text-gold-300 transition-colors rounded-full hover:bg-forest-800"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Indicator */}
            <button
              onClick={() => {
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2 text-stone-300 hover:text-gold-300 transition-colors rounded-full hover:bg-forest-800 relative hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-gold-600 to-gold-500 text-forest-950 px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm hover:from-gold-500 hover:to-gold-400 transition-all shadow-luxury-gold transform active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden xs:inline">Bag</span>
              <span className="bg-forest-900 text-gold-300 px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center font-black">
                {cartCount}
              </span>
            </button>

            {/* Admin Access Small Man Emoji / Icon Button */}
            <a
              href="/secure-admin"
              className="w-9 h-9 rounded-full bg-forest-800 hover:bg-forest-700 text-gold-300 hover:text-gold-200 border border-gold-500/40 hover:border-gold-400 flex items-center justify-center text-sm shadow-md transition-all transform hover:scale-105 active:scale-95 group relative"
              title="Admin Portal - Manage Products & Settings"
              aria-label="Admin Portal"
            >
              <span className="text-base leading-none select-none">👤</span>
              <span className="sr-only">Admin Login</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
