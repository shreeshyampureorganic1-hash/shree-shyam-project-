import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Truck, RefreshCw, Award, Heart, Phone, Mail, MapPin, MessageCircle, ExternalLink } from 'lucide-react';
import { generateWhatsAppGeneralContactUrl } from '../../utils/whatsapp';
import defaultLogo from '../../assets/logo.jpg';

export default function Footer() {
  const { settings, setSelectedCategory } = useStore();

  const navigateTo = (slug) => {
    setSelectedCategory(slug);
    const element = document.getElementById('products-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const logoSrc = settings?.logoUrl || defaultLogo;

  return (
    <footer id="contact" className="bg-forest-900 text-stone-300 border-t-2 border-gold-600/40 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d4a328_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Top Value Badges Rail */}
      <div className="border-b border-forest-800 bg-forest-950/60 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-forest-800/80 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-3 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-ivory-100 text-base">100% Certified Pure</h4>
            <p className="text-xs text-stone-400 mt-1">Zero chemicals or preservatives</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-forest-800/80 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-3 shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-ivory-100 text-base">Traditional Recipes</h4>
            <p className="text-xs text-stone-400 mt-1">Handmade in small earthen batches</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-forest-800/80 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-3 shadow-inner">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-ivory-100 text-base">All India Express Shipping</h4>
            <p className="text-xs text-stone-400 mt-1">Direct from Mirthal, Punjab</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-forest-800/80 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-3 shadow-inner">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-ivory-100 text-base">Direct From Farms</h4>
            <p className="text-xs text-stone-400 mt-1">Empowering local rural growers</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={logoSrc}
                alt="Shree Shyam Pure Organic"
                className="w-14 h-14 rounded-full border-2 border-gold-500 object-cover bg-stone-950"
                onError={(e) => { e.currentTarget.src = defaultLogo; }}
              />
              <div>
                <h3 className="font-serif text-2xl font-bold text-ivory-50">Shree Shyam</h3>
                <span className="text-xs text-gold-400 tracking-[0.25em] font-semibold uppercase">Pure Organic</span>
              </div>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              {settings.footerDescription ||
                'Dedicated to reviving ancient Ayurvedic nourishment and pure handcrafted delicacies with 100% natural, farm-fresh organic ingredients.'}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={generateWhatsAppGeneralContactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700/80 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold inline-flex items-center space-x-2 border border-emerald-500/40 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us Direct</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold-300 mb-4 border-b border-gold-900/40 pb-2">
              Organic Delicacies
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigateTo('pickles')}
                  className="hover:text-gold-300 transition-colors text-left"
                >
                  Authentic Pickles (अचार)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('morning-powders')}
                  className="hover:text-gold-300 transition-colors text-left"
                >
                  Superfood Morning Powders
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('natural-soaps')}
                  className="hover:text-gold-300 transition-colors text-left"
                >
                  Artisanal Botanical Soaps
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('ghee-oils')}
                  className="hover:text-gold-300 transition-colors text-left"
                >
                  A2 Vedic Ghee & Cold Press Oils
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('handmade-wellness')}
                  className="hover:text-gold-300 transition-colors text-left"
                >
                  Handmade Ayurvedic Wellness
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Info & Policies */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold-300 mb-4 border-b border-gold-900/40 pb-2">
              Purity Assurance
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>✓ 100% Cold Processed & Raw</li>
              <li>✓ Direct Earthen Jar Aging</li>
              <li>✓ Free Delivery Above ₹999</li>
              <li>✓ Instant WhatsApp Order Desk</li>
              <li>✓ Secure Cash on Delivery & UPI</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold-300 mb-4 border-b border-gold-900/40 pb-2">
              Connect With Us
            </h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-start space-x-2.5">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <a
                  href={settings.mapsUrl || 'https://maps.app.goo.gl/REesz8dR2esjDu1X8'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-gold-300 transition-colors flex items-center group"
                >
                  <span>{settings.address || 'Mirthal, Near Pathankot, Punjab, India'}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70 group-hover:opacity-100" />
                </a>
              </p>
              <p className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href={`tel:${settings.phone || '+919041103099'}`} className="hover:text-gold-300">
                  {settings.phone || '+91 9041103099'}
                </a>
              </p>
              <p className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href={`mailto:${settings.email || 'shreeshyampure.organic1@gmail.com'}`} className="hover:text-gold-300">
                  {settings.email || 'shreeshyampure.organic1@gmail.com'}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Shree Shyam Pure Organic. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="/secure-admin" className="hover:text-gold-400 text-stone-500 transition-colors">
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
