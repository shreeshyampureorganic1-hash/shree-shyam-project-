import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Package, 
  Layers, 
  Video, 
  MessageCircle, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles,
  Cloud,
  CheckCircle2
} from 'lucide-react';

export default function DashboardOverview({ setActiveTab }) {
  const { products, categories, videoBanner, settings } = useStore();

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const isVideoActive = videoBanner.enabled !== false;
  const inStockCount = products.filter(p => p.inStock !== false).length;

  const stats = [
    {
      title: 'Total Organic Products',
      value: totalProducts,
      subtitle: `${inStockCount} In Stock Active`,
      icon: <Package className="w-6 h-6 text-gold-400" />,
      action: () => setActiveTab('products'),
      badge: 'Up to 8 Images'
    },
    {
      title: 'Active Categories',
      value: totalCategories,
      subtitle: 'Pickles, Powders, Soaps & More',
      icon: <Layers className="w-6 h-6 text-gold-400" />,
      action: () => setActiveTab('categories'),
      badge: 'Catalog Ready'
    },
    {
      title: 'Hero Video Banner',
      value: isVideoActive ? 'LIVE' : 'DISABLED',
      subtitle: 'Cloudinary HD Streaming Video',
      icon: <Video className="w-6 h-6 text-gold-400" />,
      action: () => setActiveTab('video-banner'),
      badge: isVideoActive ? 'Streaming Active' : 'Off'
    },
    {
      title: 'WhatsApp Orders Channel',
      value: settings.whatsappNumber || '+91 9041103099',
      subtitle: '1-Click Direct Inquiries Active',
      icon: <MessageCircle className="w-6 h-6 text-emerald-400" />,
      action: () => setActiveTab('settings'),
      badge: 'Direct Connected'
    },
    {
      title: 'Cloudinary Storage',
      value: 'alee6ahr',
      subtitle: 'Auto-Optimized WebP / AVIF CDN',
      icon: <Cloud className="w-6 h-6 text-sky-400" />,
      action: () => setActiveTab('media-library'),
      badge: 'Secure Signed'
    },
    {
      title: 'Visitor & Security Shield',
      value: '256-Bit Encrypted',
      subtitle: 'Desktop-Only Super Admin Access',
      icon: <ShieldCheck className="w-6 h-6 text-gold-400" />,
      action: () => setActiveTab('activity-logs'),
      badge: 'Protected'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-950 p-6 sm:p-8 rounded-3xl border border-gold-500/40 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full border-2 border-gold-400 p-1 bg-stone-950 shadow-luxury-gold flex-shrink-0">
            <img src={settings.logoUrl || '/logo.jpg'} alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
                Super Admin Dashboard
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                Enterprise Active
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-50 mt-1">
              Welcome, Shree Shyam Pure Organic Admin
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Manage your products, Cloudinary dynamic hero video, media library, and website settings from one secure control room.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={() => setActiveTab('products')}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-bold px-5 py-2.5 rounded-2xl text-xs shadow-luxury-gold transition-all"
          >
            + Add New Product
          </button>
          <button
            onClick={() => setActiveTab('video-banner')}
            className="bg-forest-950 hover:bg-forest-900 text-gold-300 font-bold px-5 py-2.5 rounded-2xl text-xs border border-gold-500/40 transition-all"
          >
            Manage Hero Video
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            onClick={stat.action}
            className="bg-forest-900/80 hover:bg-forest-900 border border-gold-900/40 hover:border-gold-500/60 rounded-3xl p-6 shadow-md hover:shadow-luxury-gold cursor-pointer transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-forest-950 border border-gold-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-[11px] font-bold text-gold-400 bg-forest-950 px-2.5 py-1 rounded-full border border-gold-900">
                {stat.badge}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {stat.title}
              </p>
              <h3 className="font-serif text-2xl font-bold text-ivory-50 mt-1 truncate group-hover:text-gold-300 transition-colors">
                {stat.value}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {stat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Status Bar */}
      <div className="bg-forest-900/50 border border-forest-800 rounded-2xl p-4 flex flex-wrap items-center justify-between text-xs text-stone-300 gap-4">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Security Protocol: Desktop Workstation Lock Enabled</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Cloudinary Media CDN: Connected (`alee6ahr`)</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Firebase Sync: Online & Persistent Local Cache Ready</span>
        </div>
      </div>
    </div>
  );
}
