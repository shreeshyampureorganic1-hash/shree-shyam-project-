import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { uploadToCloudinary, CloudinaryFolders } from '../../services/cloudinaryService';
import { 
  Video, 
  Upload, 
  Trash2, 
  Play, 
  CheckCircle2, 
  Eye, 
  Save, 
  RefreshCw, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertCircle
} from 'lucide-react';

export default function VideoBannerManager() {
  const { videoBanner, updateVideoBanner } = useStore();
  const [formData, setFormData] = useState({ ...videoBanner });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024 * 1024) {
      alert('File size exceeds 500MB limit. Please upload a smaller video.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      const result = await uploadToCloudinary(
        file,
        CloudinaryFolders.BANNER_VIDEOS,
        'video'
      );

      setFormData((prev) => ({
        ...prev,
        videoUrl: result.url,
        videoPublicId: result.publicId,
        format: result.format,
        duration: result.duration
      }));

      setUploadProgress(100);
      alert('Hero Video uploaded to Cloudinary successfully! Click "Publish & Save Live Banner" to activate.');
    } catch (err) {
      alert(`Video upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFallbackImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(
        file,
        CloudinaryFolders.BANNER_IMAGES,
        'image'
      );
      setFormData((prev) => ({ ...prev, fallbackImageUrl: result.url }));
    } catch (err) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateVideoBanner(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
            <Video className="w-4 h-4" />
            <span>Hero Video Banner Management</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ivory-50 mt-1">
            Dynamic Video Banner Controller
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Upload and configure high-definition background videos streamed seamlessly via Cloudinary.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="bg-forest-800 hover:bg-forest-700 text-gold-300 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 border border-gold-500/30 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Banner</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-luxury-gold transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Publish & Save Live</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Hero Video Banner updated and live instantly on the storefront!</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video & Media Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Video Status & Switch */}
          <div className="bg-forest-900/90 border border-gold-900/40 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-ivory-50 text-base">Hero Video Status</h3>
                <p className="text-xs text-stone-400">Enable or disable background video playback</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                className="text-gold-400 hover:text-gold-300"
              >
                {formData.enabled ? (
                  <ToggleRight className="w-10 h-10 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-stone-500" />
                )}
              </button>
            </div>

            {/* Video Player Box */}
            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-forest-700 shadow-inner group">
              {formData.videoUrl ? (
                <video
                  src={formData.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 p-4 text-center">
                  <Video className="w-12 h-12 text-stone-600 mb-2" />
                  <p className="text-xs">No video uploaded yet.</p>
                </div>
              )}
            </div>

            {/* Upload Button for Video */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">
                Upload New Hero Video (Cloudinary)
              </label>
              <div className="flex items-center space-x-3">
                <label className="flex-1 cursor-pointer bg-forest-950 hover:bg-forest-800 border-2 border-dashed border-gold-500/40 rounded-2xl p-4 text-center transition-all group">
                  <Upload className="w-6 h-6 text-gold-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-ivory-100 block">
                    {isUploading ? 'Streaming to Cloudinary...' : 'Select MP4, WebM, or MOV'}
                  </span>
                  <span className="text-[10px] text-stone-400">Max size 500 MB • Auto HD Transcoding</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    onChange={handleVideoUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                {formData.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, videoUrl: '' })}
                    className="p-3 bg-red-950 hover:bg-red-900 text-red-300 rounded-2xl border border-red-800"
                    title="Remove Video"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Fallback Image */}
            <div className="pt-4 border-t border-forest-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">
                Fallback Poster Image
              </label>
              <div className="flex items-center space-x-3">
                <img
                  src={formData.fallbackImageUrl || '/logo.jpg'}
                  alt="Poster"
                  className="w-14 h-14 rounded-xl object-cover border border-gold-900"
                />
                <label className="flex-1 cursor-pointer bg-forest-950 hover:bg-forest-800 border border-forest-700 rounded-xl px-4 py-2 text-center text-xs font-bold text-gold-300">
                  <span>Replace Poster</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFallbackImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Content & CTAs (7 cols) */}
        <div className="lg:col-span-7 bg-forest-900/90 border border-gold-900/40 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="font-serif font-bold text-ivory-50 text-xl border-b border-forest-800 pb-3">
            Hero Section Text & Call-To-Actions
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
              Badge / Ribbon Text
            </label>
            <input
              type="text"
              value={formData.badgeText || ''}
              onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
              placeholder="e.g. 100% Pure • Chemical-Free • Farm Direct"
              className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
              Main Hero Heading
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 100% Pure Organic Products"
              className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none font-serif text-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
              Sub Heading
            </label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Traditional Taste • Natural Wellness • Handmade Care"
              className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          {/* Primary CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                Primary Button Text
              </label>
              <input
                type="text"
                value={formData.buttonText || ''}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="e.g. Shop Pure Products"
                className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                Primary Button Link
              </label>
              <input
                type="text"
                value={formData.buttonLink || ''}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="#products-section"
                className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={formData.secondaryButtonText || ''}
                onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                placeholder="e.g. Order on WhatsApp"
                className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                Secondary Button Link
              </label>
              <input
                type="text"
                value={formData.secondaryButtonLink || ''}
                onChange={(e) => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
                placeholder="#whatsapp"
                className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-bold px-8 py-3 rounded-2xl text-sm shadow-luxury-gold flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-forest-950 rounded-3xl overflow-hidden border border-gold-500/50 p-6">
            <h3 className="font-serif text-xl font-bold text-gold-300 mb-4">Hero Banner Live Simulation</h3>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center text-center p-6">
              {formData.videoUrl ? (
                <video src={formData.videoUrl} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover filter brightness-75" />
              ) : (
                <div className="absolute inset-0 bg-cover bg-center filter brightness-75" style={{ backgroundImage: `url(${formData.fallbackImageUrl || '/logo.jpg'})` }} />
              )}
              <div className="relative z-10 space-y-3">
                <span className="bg-forest-900/80 text-gold-300 text-xs px-3 py-1 rounded-full border border-gold-500/40">
                  {formData.badgeText}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  {formData.title}
                </h1>
                <p className="text-gold-200 text-sm">{formData.subtitle}</p>
                <div className="pt-2 flex justify-center gap-3">
                  <span className="bg-gold-500 text-forest-950 text-xs font-bold px-4 py-2 rounded-full">
                    {formData.buttonText}
                  </span>
                  <span className="bg-forest-800 text-gold-300 text-xs font-bold px-4 py-2 rounded-full border border-gold-500/40">
                    {formData.secondaryButtonText}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setPreviewOpen(false)}
              className="mt-4 bg-forest-800 text-stone-200 px-6 py-2 rounded-xl text-xs font-bold hover:text-white"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
