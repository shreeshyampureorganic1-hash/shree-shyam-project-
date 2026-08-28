import React, { useState, useEffect } from 'react';
import { fetchCloudinaryResources, uploadToCloudinary, deleteFromCloudinary } from '../../services/cloudinaryService';
import { 
  Cloud, 
  Upload, 
  Trash2, 
  Search, 
  Copy, 
  Check, 
  Video, 
  Image as ImageIcon, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';

export default function MediaLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [resourceType, setResourceType] = useState('image'); // 'image' | 'video'
  const [copiedId, setCopiedId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const loadMedia = async () => {
    setLoading(true);
    const list = await fetchCloudinaryResources('shree-shyam', resourceType);
    setResources(list);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, [resourceType]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploading(true);

    for (const file of files) {
      const isVid = file.type.startsWith('video/');
      await uploadToCloudinary(
        file,
        isVid ? 'shree-shyam/banners/videos' : 'shree-shyam/gallery',
        isVid ? 'video' : 'image'
      );
    }
    setIsUploading(false);
    await loadMedia();
  };

  const handleDelete = async (publicId) => {
    if (!confirm('Are you sure you want to delete this media asset from Cloudinary?')) return;
    await deleteFromCloudinary(publicId, resourceType);
    setResources((prev) => prev.filter((r) => r.public_id !== publicId));
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = resources.filter((r) =>
    r.public_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
            <Cloud className="w-4 h-4" />
            <span>Cloudinary Media Cloud (`alee6ahr`)</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ivory-50 mt-1">
            Media Asset Library
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            All brand photos, product shots, and hero videos hosted and optimized on Cloudinary CDN.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="cursor-pointer bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center space-x-2 shadow-luxury-gold transition-all">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : '+ Upload Assets'}</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          <button
            onClick={loadMedia}
            className="p-2.5 bg-forest-900 text-gold-300 hover:text-white rounded-xl border border-forest-700"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-forest-900/60 p-4 rounded-2xl border border-forest-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setResourceType('image')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              resourceType === 'image'
                ? 'bg-gold-500 text-forest-950'
                : 'bg-forest-950 text-stone-300 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 mr-1.5 inline" /> Images
          </button>

          <button
            onClick={() => setResourceType('video')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              resourceType === 'video'
                ? 'bg-gold-500 text-forest-950'
                : 'bg-forest-950 text-stone-300 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 mr-1.5 inline" /> Hero Videos
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename/path..."
            className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Grid of Media Assets */}
      {loading ? (
        <div className="text-center py-20 text-stone-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gold-400" />
          <p className="text-xs">Fetching Cloudinary assets...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-forest-900/40 rounded-3xl border border-forest-800 p-8">
          <p className="text-sm font-serif text-ivory-100">No {resourceType} assets in this directory yet.</p>
          <p className="text-xs text-stone-500 mt-1">Upload images or videos directly using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-forest-900 border border-forest-700/80 rounded-2xl overflow-hidden group shadow-md flex flex-col justify-between"
            >
              <div className="aspect-square bg-stone-950 relative overflow-hidden flex items-center justify-center">
                {resourceType === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" controls />
                ) : (
                  <img src={item.url} alt={item.public_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                )}
              </div>

              <div className="p-3 bg-forest-950 text-xs space-y-2">
                <p className="font-mono text-[11px] text-stone-300 truncate" title={item.public_id}>
                  {item.public_id}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-forest-800">
                  <button
                    onClick={() => copyUrl(item.url, idx)}
                    className="text-[10px] font-bold text-gold-400 hover:text-gold-300 flex items-center"
                  >
                    {copiedId === idx ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-emerald-400" /> Copied URL
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" /> Copy CDN URL
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.public_id)}
                    className="text-stone-500 hover:text-red-400 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
