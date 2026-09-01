import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import defaultLogo from '../assets/logo.jpg';

export default function AdminLogin({ onLoginSuccess }) {
  const { login, lockCountdown, remainingAttempts } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed');
      // Clear password field on error for security
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const isLocked = lockCountdown > 0;

  return (
    <div className="min-h-screen bg-forest-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-forest-900 border border-gold-500/40 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Header with Brand Emblem */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-gold-500 p-0.5 mx-auto mb-4 bg-stone-950 shadow-luxury-gold overflow-hidden flex items-center justify-center">
            <img
              src={defaultLogo}
              alt="Shree Shyam Pure Organic"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => { e.currentTarget.src = defaultLogo; }}
            />
          </div>
          <div className="inline-flex items-center space-x-1 text-gold-400 text-xs font-bold uppercase tracking-widest bg-forest-950 px-3 py-1 rounded-full border border-gold-900 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Admin Gateway</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-50">
            Shree Shyam Pure Organic
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Enterprise Private Administration Portal
          </p>
        </div>

        {/* Lockout Warning Banner */}
        {isLocked ? (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-300 text-xs space-y-1">
            <div className="flex items-center font-bold text-red-200">
              <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>Brute Force Lockout Active</span>
            </div>
            <p>
              Portal temporarily locked for security. Try again in{' '}
              <strong className="text-white text-sm">
                {Math.floor(lockCountdown / 60)}m {lockCountdown % 60}s
              </strong>
            </p>
          </div>
        ) : error ? (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Login Form - NO pre-filled credentials */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="off"
                disabled={isLocked || isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Admin Email"
                className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                disabled={isLocked || isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security details */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
            <span>Attempts remaining: <strong className="text-gold-400">{remainingAttempts}/5</strong></span>
            <span className="flex items-center text-emerald-400">
              <KeyRound className="w-3 h-3 mr-1" /> 256-Bit Encrypted
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLocked || isLoading}
            className="w-full mt-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-forest-950 font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-luxury-gold transform active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <span>Authenticating Securely...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Super Admin</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-forest-800 text-center">
          <a
            href="/"
            className="text-xs text-stone-400 hover:text-gold-300 transition-colors inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Return to Storefront</span>
          </a>
        </div>
      </div>
    </div>
  );
}
