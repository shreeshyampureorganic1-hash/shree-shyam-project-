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
              <div className="w-12 h-12 rounded-full border-2 border-gold-500 bg-stone-900 p-0.5 shadow-luxury-gold flex-shrink-0">
                <img
                  src={settings.logoUrl || '/logo.jpg'}
                  alt="Logo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => { e.target.src = '/logo.jpg'; }}
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
            <div className="p-4 mx-4 my-4 rounded-2xl bg-forest-950/80 border border-gold-900/40 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-gold-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold text-ivory-100">Super Admin</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[10px] text-stone-400 truncate" title={adminUser?.email}>
                  {adminUser?.email || 'shreeshyampure.organic1@gmail.com'}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="px-3 space-y-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-forest-950 shadow-luxury-gold'
                        : 'text-stone-300 hover:bg-forest-800/80 hover:text-gold-300'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Actions */}
          <div className="p-4 border-t border-forest-800 bg-forest-950/80 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 bg-forest-900 hover:bg-forest-800 text-gold-300 py-2.5 rounded-xl text-xs font-bold border border-gold-900/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Storefront</span>
            </a>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 bg-red-950/80 hover:bg-red-900 text-red-300 py-2.5 rounded-xl text-xs font-bold border border-red-800/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Secure Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 bg-forest-900/90 backdrop-blur-md border-b border-forest-800 px-8 flex items-center justify-between z-10">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Enterprise Session Active • Cloudinary & Firebase Synchronized
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-xs text-stone-400">
                Logged in as: <strong className="text-gold-300">{adminUser?.name || 'Super Admin'}</strong>
              </span>
            </div>
          </header>

          {/* Tab Views */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-forest-950">
            {activeTab === 'overview' && <DashboardOverview setActiveTab={setActiveTab} />}
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
