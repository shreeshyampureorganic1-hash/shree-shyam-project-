import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../product/ProductCard';
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function FeaturedProducts() {
  const { products, categories, selectedCategory, setSelectedCategory } = useStore();
  const [sortBy, setSortBy] = useState('featured');

  // Filter by category
  let filtered = products.filter((product) => {
    if (selectedCategory === 'all') return true;
    return product.categorySlug === selectedCategory || 
           product.category?.toLowerCase().includes(selectedCategory.replace('-', ' '));
  });

  // Sort logic
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return (
    <section id="products-section" className="py-16 bg-ivory-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-gold-700 font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>Small Batch Artisanal Creations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 mt-1">
              Pure Organic Delights
            </h2>
          </div>

          {/* Filter Pills & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 shadow-sm text-xs font-semibold text-stone-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 mr-1" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs Strip */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                selectedCategory === cat.slug
                  ? 'bg-forest-900 text-gold-300 border-gold-600 shadow-md scale-105'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-gold-400 hover:text-stone-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-forest-900">
              No products found in this category
            </h3>
            <p className="text-stone-500 text-sm mt-2">
              Please choose another organic collection or check back soon as our handmade batches finish curing.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-6 bg-forest-900 text-gold-300 px-6 py-2.5 rounded-full text-xs font-bold"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
