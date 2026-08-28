import React, { useState, useEffect } from 'react';
import { isDesktopDevice } from '../utils/deviceDetector';
import { ShieldAlert, Monitor, Laptop, Smartphone, KeyRound, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function DesktopOnlyGuard({ children }) {
  const [deviceCheck, setDeviceCheck] = useState(() => isDesktopDevice());
  const [mobileBypass, setMobileBypass] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDeviceCheck(isDesktopDevice());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!deviceCheck.allowed && !mobileBypass) {
    return (
      <div className="min-h-screen bg-forest-950 text-ivory-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-forest-900 border-2 border-gold-600/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Gold Glow */}
          <div className="w-20 h-20 rounded-full bg-gold-500/10 border-2 border-gold-500 flex items-center justify-center mx-auto mb-6 shadow-luxury-gold animate-pulse">
            <Monitor className="w-10 h-10 text-gold-400" />
          </div>

          <div className="inline-flex items-center space-x-1.5 bg-red-950 text-red-400 border border-red-800/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Hardware Policy Restricted</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-50 leading-tight">
            Admin Dashboard is available only on Desktop Devices.
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm mt-4 leading-relaxed">
            In compliance with enterprise security protocols, private administrative access is strictly restricted on smartphones and tablets.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-forest-950/80 border border-gold-900/40 text-left space-y-2 text-xs">
            <div className="flex items-center text-emerald-400 font-medium">
              <Laptop className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Allowed: Windows PC, MacBook, Linux Desktop</span>
            </div>
            <div className="flex items-center text-red-400 font-medium">
              <Smartphone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Restricted: Android Phones, iPhones, Tablets</span>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 italic">
            Detected Device: <strong className="text-gold-400">{deviceCheck.deviceType}</strong>
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => setMobileBypass(true)}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-luxury-gold transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Continue to Admin Login on this Device</span>
            </button>

            <a
              href="/"
              className="inline-flex items-center justify-center space-x-2 bg-forest-950 hover:bg-forest-800 text-stone-300 font-bold px-6 py-2.5 rounded-2xl text-xs border border-forest-700 transition-all w-full"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Website</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
