import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { uploadToCloudinary, CloudinaryFolders } from '../../services/cloudinaryService';
import { Settings, Save, Upload, CheckCircle2, MapPin, Globe, MessageCircle, Phone, Mail, ExternalLink } from 'lucide-react';

export default function SettingsManager() {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState({ ...settings });
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadToCloudinary(file, CloudinaryFolders.LOGO, 'image');
      setFormData((prev) => ({ ...prev, logoUrl: res.url }));
    } catch (err) {
      alert('Logo upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-forest-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
            <Settings className="w-4 h-4" />
            <span>Store Configuration & Location</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ivory-50 mt-1">
            Website, Address & Contact Settings
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Manage your brand logo, Punjab farm location, Google Maps navigation link, and WhatsApp ordering line.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-luxury-gold transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Live Settings</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Website settings & Punjab address updated across the entire website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand & Logo Card */}
        <div className="bg-forest-900 border border-gold-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="font-serif font-bold text-ivory-50 text-xl border-b border-forest-800 pb-3">
            Brand Identity & Logo
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-gold-300 mb-1.5">
              Brand Name
            </label>
            <input
              type="text"
              value={formData.siteName || ''}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gold-300 mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gold-300 mb-1.5">
              Top Announcement Banner Text
            </label>
            <input
              type="text"
              value={formData.announcementText || ''}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Logo Upload Box */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase text-gold-300 mb-2">
              Official Master Brand Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full border-2 border-gold-500 bg-stone-950 p-1 flex-shrink-0">
                <img
                  src={formData.logoUrl || '/logo.jpg'}
                  alt="Brand Logo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => { e.target.src = '/logo.jpg'; }}
                />
              </div>
              <label className="cursor-pointer bg-forest-950 hover:bg-forest-800 border border-forest-700 rounded-xl px-4 py-2 text-xs font-bold text-gold-300 flex items-center space-x-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading to Cloudinary...' : 'Upload New Logo'}</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Location & Contact Information */}
        <div className="bg-forest-900 border border-gold-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="font-serif font-bold text-ivory-50 text-xl border-b border-forest-800 pb-3">
            Location & Contacts
          </h3>

          <div>
            <label className="text-xs font-bold uppercase text-gold-300 mb-1.5 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gold-400" />
              Store & Farm Address
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Mirthal, Near Pathankot, Punjab, India"
              className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gold-300 mb-1.5 flex items-center">
              <ExternalLink className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Google Maps Location Link
            </label>
            <input
              type="url"
              value={formData.mapsUrl || ''}
              onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
              placeholder="https://maps.app.goo.gl/REesz8dR2esjDu1X8"
            className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gold-300 mb-1.5 flex items-center">
              <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              WhatsApp Direct Order Line
            </label>
            <input
              type="text"
              value={formData.whatsappNumber || ''}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+91 9041103099"
              className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gold-300 mb-1.5">
                Support Phone
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gold-300 mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
