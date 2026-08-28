import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Ritu Sharma',
      location: 'Jaipur, Rajasthan',
      review: 'The traditional Mango Pickle took me straight back to my grandmother’s kitchen. You can instantly smell the pure mustard oil and freshly roasted spices. Absolutely authentic and pure!',
      product: 'Rajasthani Mango Pickle',
      rating: 5
    },
    {
      name: 'Dr. Arvind Verma',
      location: 'New Delhi',
      review: 'I have been taking their Wild Amla Powder every morning in warm water for the last 3 months. My immunity and digestive energy have noticeably improved. Remarkable quality.',
      product: 'Pure Wild Amla Powder',
      rating: 5
    },
    {
      name: 'Pooja Hegde',
      location: 'Bengaluru, Karnataka',
      review: 'Their handmade Neem & Tulsi soap completely eliminated my monsoon skin breakouts without stripping moisture. It is so hard to find genuine chemical-free soaps like this.',
      product: 'Ayurvedic Neem & Tulsi Soap',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-ivory-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-700">
            Real Customer Stories
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 mt-1">
            Loved By 10,000+ Families
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-500 mb-4">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm italic leading-relaxed">
                  "{r.review}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-forest-900 text-base flex items-center">
                    {r.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1.5 inline" title="Verified Customer" />
                  </h4>
                  <p className="text-[11px] text-stone-400">{r.location}</p>
                </div>
                <span className="text-[10px] font-bold text-gold-700 bg-gold-50 px-2.5 py-1 rounded-full border border-gold-200">
                  {r.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
