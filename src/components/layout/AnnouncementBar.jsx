import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Phone, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  const { settings } = useStore();

  return (
    <div className="bg-forest-900 text-gold-300 text-xs py-2 px-4 border-b border-gold-900/40 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-4 text-stone-300">
          <span className="flex items-center text-gold-400">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            100% Certified Organic & Lab Tested
          </span>
        </div>

        <div className="flex-1 text-center font-medium tracking-wide truncate px-2">
          {settings.announcementText || '✨ 100% Pure Organic & Chemical Free • Free Delivery on Orders Above ₹999 ✨'}
        </div>

        <div className="hidden lg:flex items-center space-x-3 text-stone-300">
          <a
            href={`tel:${settings.phone}`}
            className="flex items-center hover:text-gold-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 mr-1 text-gold-400" />
            <span>Support: {settings.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
