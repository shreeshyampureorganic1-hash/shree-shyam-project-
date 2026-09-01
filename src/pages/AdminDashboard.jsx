import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import DesktopOnlyGuard from './DesktopOnlyGuard';
import AdminLogin from './AdminLogin';
import DashboardOverview from './admin/DashboardOverview';
import VideoBannerManager from './admin/VideoBannerManager';
import ProductManager from './admin/ProductManager';
import CategoryManager from './admin/CategoryManager';
import MediaLibrary from './admin/MediaLibrary';
import ActivityLogs from './admin/ActivityLogs';
import SettingsManager from './admin/SettingsManager';
import BackupRestore from './admin/BackupRestore';
import defaultLogo from '../assets/logo.jpg';
import { 
  LayoutDashboard, 
  Video, 
  Package, 
  Layers, 
  Cloud, 
  History, 
  Settings, 
  Database, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const { isAuthenticated, adminUser, logout } = useAuth();
  const { settings } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  // If not logged in, render the secure login gate
  if (!isAuthenticated) {
    return (
      <DesktopOnlyGuard>
        <AdminLogin onLoginSuccess={() => setActiveTab('overview')} />
      </DesktopOnlyGuard>
    );
  }

  const logoSrc = settings?.logoUrl || defaultLogo;

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'video-banner', label: 'Hero Video Banner', icon: <Video className="w-4 h-4" /> },
    { id: 'products', label: 'Product Inventory', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'media-library', label: 'Cloudinary Media', icon: <Cloud className="w-4 h-4" /> },
    { id: 'settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'activity-logs', label: 'Activity Logs', icon: <History className="w-4 h-4" /> },
    { id: 'backup-restore', label: 'Backup & Recovery', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <DesktopOnlyGuard>
      <div className="min-h-screen bg-forest-950 text-stone-200 flex">
        {/* Left Sidebar */}
        <aside className="w-72 bg-forest-900 border-r border-gold-900/40 flex flex-col justify-between flex-shrink-0 z-20">
          <div>
            {/* Brand Header */}
            <div className="p-6 border-b border-forest-800 flex items-center space-x-3 bg-forest-950/60">
              <div className="w-12 h-12 rounded-full border-2 border-gold-500 bg-stone-950 p-0.5 shadow-luxury-gold flex-shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { e.currentTarget.src = defaultLogo; }}
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-serif font-bold text-ivory-50 text-base leading-tight truncate">
                  Shree Shyam
                </h1>
                <p className="text-[10px] text-gold-400 font-extrabold uppercase tracking-widest truncate">
                  Super Admin Suite
                </p>
              </div>
            </div>

            {/* Admin Info Card */}
            <div className="mx-4 my-4 p-3 bg-forest-950/80 rounded-2xl border border-gold-900/40 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gold-600/20 text-gold-400 flex items-center justify-center border border-gold-600/40">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-ivory-100 truncate">{adminUser?.email || 'Super Admin'}</p>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-400 font-medium">Session Active</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="px-3 space-y-1 mt-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-forest-950 shadow-luxury-gold'
                        : 'text-stone-300 hover:text-gold-300 hover:bg-forest-800/60'
                    }`}
                  >
                    <span className={isActive ? 'text-forest-950' : 'text-gold-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-forest-800 space-y-2 bg-forest-950/40">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-gold-300 hover:bg-forest-800/80 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                <span>View Live Storefront</span>
              </span>
            </a>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 overflow-y-auto bg-forest-950 min-h-screen">
          <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10">
            {activeTab === 'overview' && <DashboardOverview onNavigate={setActiveTab} />}
            {activeTab === 'video-banner' && <VideoBannerManager />}
            {activeTab === 'products' && <ProductManager />}
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'media-library' && <MediaLibrary />}
            {activeTab === 'settings' && <SettingsManager />}
            {activeTab === 'activity-logs' && <ActivityLogs />}
            {activeTab === 'backup-restore' && <BackupRestore />}
          </div>
        </main>
      </div>
    </DesktopOnlyGuard>
  );
}
