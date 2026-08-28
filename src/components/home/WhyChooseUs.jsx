import React from 'react';
import { Sun, HeartHandshake, ShieldCheck, Flame, Award, Leaf } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Sun className="w-8 h-8 text-gold-400" />,
      title: 'Sun-Aged Natural Fermentation',
      description: 'Our heritage pickles mature slowly under the warm Indian sun in traditional porcelain Martaban jars without synthetic vinegar.'
    },
    {
      icon: <Flame className="w-8 h-8 text-gold-400" />,
      title: 'Authentic Vedic Bilona Method',
      description: 'Cultured A2 cow curd churned with bi-directional wooden blenders on low wood fire for pure golden granules and soothing aroma.'
    },
    {
      icon: <Leaf className="w-8 h-8 text-gold-400" />,
      title: '100% Chemical & Preservative Free',
      description: 'Strict zero-chemical tolerance. No artificial colors, preservatives, parabens, SLS, or synthetic stabilizers.'
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-gold-400" />,
      title: 'Empowering Village Farmers',
      description: 'We directly contract certified organic growers, ensuring fair living wages and promoting indigenous seed biodiversity.'
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-forest-900 text-ivory-50 relative overflow-hidden border-y border-gold-900/30">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gold-600/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-forest-700/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
            Purity Without Compromise
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ivory-50 mt-2">
            Why Shree Shyam Pure Organic?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-4 leading-relaxed font-light">
            In an era of mass factory processing, we hold steadfast to ancient Vedic culinary arts and Ayurvedic craftsmanship. Every batch is created with purity, patience, and love.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-forest-800/60 border border-gold-900/40 rounded-3xl p-6 hover:border-gold-500/50 transition-all duration-300 hover:shadow-luxury-gold flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-forest-900/90 border border-gold-500/30 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-ivory-100 mb-3 group-hover:text-gold-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
