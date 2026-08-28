import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, products, setActiveModalProduct } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.ingredients?.some((ing) => ing.toLowerCase().includes(q))
        );
      })
    : [];

  const handleSelectProduct = (product) => {
    setIsSearchOpen(false);
    setActiveModalProduct(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="min-h-screen px-4 text-center flex items-start justify-center pt-20">
        <div className="inline-block w-full max-w-2xl bg-forest-900 border border-gold-500/40 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all relative z-10">
          {/* Header / Input */}
          <div className="p-4 sm:p-6 border-b border-forest-800 flex items-center space-x-3 bg-forest-950">
            <Search className="w-6 h-6 text-gold-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pure organic pickles, amla powder, herbal soaps..."
              className="w-full bg-transparent text-ivory-50 placeholder-stone-400 text-base sm:text-lg focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="bg-forest-800 text-stone-300 hover:text-white p-2 rounded-xl text-xs font-semibold"
            >
              ESC
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
            {!query.trim() ? (
              <div className="text-center py-8">
                <p className="text-sm text-stone-400">
                  Try searching for <span className="text-gold-400 font-medium">"Mango Pickle"</span>,{' '}
                  <span className="text-gold-400 font-medium">"Amla Powder"</span>, or{' '}
                  <span className="text-gold-400 font-medium">"Neem Soap"</span>
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {['Pickles', 'Amla', 'Neem Soap', 'A2 Ghee', 'Moringa', 'Bilona'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="bg-forest-800 hover:bg-forest-700 text-gold-300 text-xs px-3 py-1.5 rounded-full border border-gold-900/40"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-10 text-stone-400">
                <p className="text-base font-serif text-ivory-100">No matching organic products found.</p>
                <p className="text-xs text-stone-500 mt-1">Please try checking the spelling or use a broader keyword.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
                  Found {filteredProducts.length} Results
                </p>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-forest-800/60 hover:bg-forest-800 border border-forest-700 hover:border-gold-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={product.imageUrls?.[0] || '/logo.jpg'}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-xl border border-gold-900/30 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-ivory-50 text-sm group-hover:text-gold-300 transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-stone-400 mt-0.5">
                          <span className="text-gold-400">{product.category}</span>
                          <span>•</span>
                          <span>{product.weight}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gold-300 font-bold text-sm">₹{product.price}</span>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
