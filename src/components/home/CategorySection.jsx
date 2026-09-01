import React from "react";
import { useStore } from "../../context/StoreContext";

export default function CategorySection() {
  const {
    categories = [],
    selectedCategory,
    setSelectedCategory,
  } = useStore();

  console.log("Categories Data:", categories);

  const handleSelect = (slug) => {
    setSelectedCategory(slug);

    const el = document.getElementById("products-section");
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-14 bg-ivory-100 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-700">
            Certified Organic Product Collections
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
            Explore Pure Heritage Categories
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Dispatched fresh from our organic farm in Mirthal, Punjab
          </p>

          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, index) => {
            const slug =
              cat?.slug ||
              cat?.name?.toLowerCase().replace(/\s+/g, "-") ||
              `category-${index}`;

            const isSelected = selectedCategory === slug;

            return (
              <button
                key={cat?.id || slug || index}
                onClick={() => handleSelect(slug)}
                className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center transition-all duration-300 group border ${
                  isSelected
                    ? "bg-forest-900 text-gold-300 border-gold-500 shadow-luxury-gold scale-105"
                    : "bg-white text-stone-800 border-stone-200 hover:border-gold-400 hover:shadow-luxury"
                }`}
              >
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-3 overflow-hidden p-1 transition-transform duration-300 group-hover:scale-110 shadow-md ${
                    isSelected
                      ? "bg-forest-950 border-2 border-gold-400"
                      : "bg-stone-900 border-2 border-gold-500/80"
                  }`}
                >
                  <img
                    src={cat?.image || "/logo.jpg"}
                    alt={cat?.name || "Category"}
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      e.target.src = "/logo.jpg";
                    }}
                  />
                </div>

                <div className="w-full">
                  <span className="font-serif font-bold text-sm leading-tight group-hover:text-gold-600 transition-colors block line-clamp-2">
                    {cat?.name || "Organic Category"}
                  </span>

                  <span className="text-[10px] mt-1 text-stone-400 font-medium block">
                    {cat?.description || "View Products →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}