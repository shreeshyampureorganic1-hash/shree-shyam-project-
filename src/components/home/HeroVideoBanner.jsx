import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Play, Pause, Volume2, VolumeX, Sparkles, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { generateWhatsAppGeneralContactUrl } from '../../utils/whatsapp';

export default function HeroVideoBanner() {
  const { videoBanner, settings } = useStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const videoSrc = videoBanner?.videoUrl || '';
  const fallbackImg = videoBanner?.fallbackImageUrl || '';

  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-forest-900">
      {/* Background Video / Fallback Image */}
   {videoBanner?.enabled !== false && videoSrc && (
  <div className="absolute inset-0 w-full h-full overflow-hidden">
    <video
      ref={videoRef}
      src={videoSrc}
      poster={fallbackImg}
      autoPlay
      loop
      muted={isMuted}
      playsInline
      className="w-full h-full object-cover scale-105 filter brightness-75 transition-transform duration-1000"
    />
  </div>
)}

      {/* Luxury Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-forest-950/40 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-forest-950/40 to-forest-950/80" />

      {/* Floating Video Controls */}
      {videoBanner.enabled !== false && (
        <div className="absolute bottom-6 right-6 z-30 flex items-center space-x-2 bg-forest-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-500/30 text-gold-300">
          <button
            onClick={togglePlay}
            className="p-1.5 hover:text-white transition-colors"
            aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleSound}
            className="p-1.5 hover:text-white transition-colors"
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 flex flex-col items-center">
        {/* Emblem Badge */}
        <div className="inline-flex items-center space-x-2 bg-forest-900/80 backdrop-blur-md border border-gold-500/60 text-gold-300 px-4 py-1.5 rounded-full mb-6 shadow-luxury-gold animate-fade-in">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase">
            {videoBanner.badgeText || '100% Certified Pure • Handmade with Devotion'}
          </span>
        </div>

        {/* Official Brand Logo */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-gold-400/90 shadow-2xl p-1 bg-stone-950 mb-6 group hover:scale-105 transition-transform duration-300">
          {settings.logoUrl ? (
  <img
    src={settings.logoUrl}
    alt="Shree Shyam Pure Organic"
    className="w-full h-full object-contain rounded-full"
  />
) : (
  <div className="w-full h-full flex items-center justify-center text-gold-300 text-xs text-center px-2">
    No Logo
  </div>
)}
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold text-ivory-50 tracking-tight leading-[1.1] max-w-4xl drop-shadow-lg">
          {videoBanner.title || '100% Pure Organic Products'}
        </h1>

        {/* Sub Heading */}
        <p className="mt-5 text-base sm:text-xl md:text-2xl text-gold-200 font-light tracking-wide max-w-2xl drop-shadow-md">
          {videoBanner.subtitle || 'Traditional Taste • Natural Wellness • Handmade Care'}
        </p>

        {/* Purity Highlights Bar */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-stone-200">
          <span className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-gold-400 mr-1.5" /> No Chemical Preservatives
          </span>
          <span className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-gold-400 mr-1.5" /> Sun-Dried Marwari Spices
          </span>
          <span className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-gold-400 mr-1.5" /> Direct WhatsApp Dispatch
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={scrollToProducts}
            className="w-full sm:w-auto bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-300 text-forest-950 font-bold px-8 py-4 rounded-full text-sm sm:text-base shadow-luxury-gold flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <span>{videoBanner.buttonText || 'Explore Organic Collection'}</span>
            <ArrowRight className="w-4 h-4 text-forest-950" />
          </button>

          <a
            href={generateWhatsAppGeneralContactUrl('Namaste! I would like to explore Shree Shyam pure organic products and order catalog.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-forest-800/90 hover:bg-forest-800 text-gold-300 font-bold px-8 py-4 rounded-full text-sm sm:text-base border border-gold-500/50 shadow-lg flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>{videoBanner.secondaryButtonText || 'Order on WhatsApp'}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
