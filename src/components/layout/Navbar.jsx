import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, ShoppingBag, Heart, Menu, X, PhoneCall } from 'lucide-react';
import defaultLogo from '../../assets/logo.jpg';

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

  const logoSrc = settings?.logoUrl || defaultLogo;

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
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gold-500 shadow-luxury-gold flex-shrink-0 bg-stone-950 p-0.5">
              <img
                src={logoSrc}
                alt={settings?.siteName || 'Shree Shyam Pure Organic'}
                className="w-full h-full object-cover rounded-full transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = defaultLogo;
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
              className="text-gold-300 hover:text-gold-200 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gold-400 font-serif"
            >
              Home
            </a>

            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryNav(cat.slug)}
                className="text-stone-300 hover:text-gold-300 transition-colors text-sm font-normal py-1"
              >
                {cat.name}
              </button>
            ))}

            <a
              href="#why-us"
              className="text-stone-300 hover:text-gold-300 transition-colors text-sm font-normal"
            >
              Why Us
            </a>

            <a
              href="#contact"
              className="text-stone-300 hover:text-gold-300 transition-colors text-sm font-normal"
            >
              Contact
            </a>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-stone-300 hover:text-gold-300 transition-colors rounded-full hover:bg-forest-800"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <a
              href="#wishlist"
              className="p-2 text-stone-300 hover:text-gold-300 transition-colors rounded-full hover:bg-forest-800 relative hidden sm:block"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </a>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 bg-gold-500 hover:bg-gold-400 text-forest-950 px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm shadow-luxury-gold transform active:scale-95 transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-sans font-bold">{cartCount}</span>
            </button>

            {/* Secure Admin Portal Shortcut */}
            <a
              href="/secure-admin"
              className="p-2 text-gold-300 hover:text-white transition-colors rounded-full hover:bg-forest-800 flex items-center justify-center"
              title="Secure Admin Gateway"
              aria-label="Admin Portal"
            >
              <span className="text-base leading-none">👤</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
