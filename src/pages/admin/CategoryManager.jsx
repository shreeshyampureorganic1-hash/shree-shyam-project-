import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { uploadToCloudinary, CloudinaryFolders } from '../../services/cloudinaryService';
import { Layers, Plus, Trash2, Edit2, Upload, Check, Save, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CategoryManager() {
  const { categories, setCategories } = useStore();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form for adding new category
  const [newCat, setNewCat] = useState({
    name: '',
    slug: '',
    description: '',
    image: '/logo.jpg'
  });

  const handleLogoUpload = async (e, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadToCloudinary(file, CloudinaryFolders.CATEGORIES, 'image');
      if (isEditing && editingCategory) {
        setEditingCategory((prev) => ({ ...prev, image: res.url }));
      } else {
        setNewCat((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    const updated = categories.map((c) =>
      c.id === editingCategory.id ? { ...editingCategory } : c
    );
    setCategories(updated);
    localStorage.setItem('shree_categories_cache', JSON.stringify(updated));
    setEditingCategory(null);
    setSuccessMsg(`Category "${editingCategory.name}" logo & details updated successfully!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;

    const slug = newCat.slug.trim() || newCat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const created = {
      id: `cat_${Date.now()}`,
      name: newCat.name.trim(),
      slug: slug,
      description: newCat.description || '100% Pure & Handmade Care',
      image: newCat.image || '/logo.jpg'
    };

    const updated = [...categories, created];
    setCategories(updated);
    localStorage.setItem('shree_categories_cache', JSON.stringify(updated));
    setNewCat({ name: '', slug: '', description: '', image: '/logo.jpg' });
    setSuccessMsg(`Category "${created.name}" created successfully!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleDeleteCategory = (id, name) => {
    if (id === 'cat_all') {
      alert('Default "All Products" category cannot be removed.');
      return;
    }
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;

    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('shree_categories_cache', JSON.stringify(updated));
    setSuccessMsg(`Category "${name}" removed.`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-forest-800 pb-6">
        <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
          <Layers className="w-4 h-4" />
          <span>Product Categories & Logo Manager</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-ivory-50 mt-1">
          Category Logos & Navigation
        </h2>
        <p className="text-stone-400 text-xs sm:text-sm mt-1">
          Customize and replace category emblem logos anytime. Changes appear instantly across the website and product filters.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-forest-900 border border-gold-500/40 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <h3 className="font-serif text-2xl font-bold text-ivory-50 mb-6">
              Edit Category: {editingCategory.name}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              {/* Category Logo Preview & Upload */}
              <div className="flex items-center space-x-4 bg-forest-950 p-4 rounded-2xl border border-forest-700">
                <div className="w-20 h-20 rounded-full border-2 border-gold-500/80 overflow-hidden bg-stone-900 flex-shrink-0 shadow-luxury-gold p-0.5">
                  <img
                    src={editingCategory.image || '/logo.jpg'}
                    alt="Category Logo"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => { e.target.src = '/logo.jpg'; }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gold-300 mb-1.5">
                    Category Logo Picture
                  </label>
                  <label className="cursor-pointer bg-forest-800 hover:bg-forest-700 text-gold-300 text-xs font-bold px-4 py-2 rounded-xl border border-gold-500/40 inline-flex items-center space-x-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading to Cloudinary...' : 'Upload New Logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, true)}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gold-300 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gold-300 mb-1.5">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="e.g. Traditional Taste • Pure & Natural"
                  className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gold-300 mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-forest-800">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="bg-forest-950 text-stone-300 px-5 py-2.5 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-luxury-gold flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Category Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid: Category List & Add Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Current Categories with Logo Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="font-serif font-bold text-ivory-50 text-xl">
            Active Category Logos ({categories.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-forest-900/90 border border-gold-900/40 rounded-3xl p-5 shadow-lg flex flex-col justify-between hover:border-gold-500/50 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  {/* Category Logo Image */}
                  <div className="w-16 h-16 rounded-full border-2 border-gold-500 overflow-hidden bg-stone-900 flex-shrink-0 shadow-luxury-gold p-0.5 group-hover:scale-105 transition-transform">
                    <img
                      src={c.image || '/logo.jpg'}
                      alt={c.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => { e.target.src = '/logo.jpg'; }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif font-bold text-ivory-50 text-base leading-tight truncate">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                      {c.description || '100% Pure Organic'}
                    </p>
                    <span className="text-[10px] text-gold-400 font-mono block mt-1">
                      slug: {c.slug}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-forest-800 flex items-center justify-between">
                  <button
                    onClick={() => setEditingCategory(c)}
                    className="bg-forest-950 hover:bg-forest-800 text-gold-300 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 border border-gold-900/40 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Change Logo & Info</span>
                  </button>

                  {c.slug !== 'all' && (
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Category Panel (4 cols) */}
        <div className="lg:col-span-4 bg-forest-900 border border-gold-900/40 rounded-3xl p-6 sm:p-7 space-y-4">
          <h3 className="font-serif font-bold text-ivory-50 text-xl border-b border-forest-800 pb-3">
            Add New Category
          </h3>

          <form onSubmit={handleAddCategory} className="space-y-4">
            {/* Logo Preview & Upload */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-2 border-gold-500 overflow-hidden bg-stone-900 mx-auto mb-2 shadow-luxury-gold p-0.5">
                <img
                  src={newCat.image || '/logo.jpg'}
                  alt="New Logo"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { e.target.src = '/logo.jpg'; }}
                />
              </div>
              <label className="cursor-pointer bg-forest-950 hover:bg-forest-800 border border-forest-700 text-gold-300 text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center space-x-1">
                <Upload className="w-3 h-3" />
                <span>{isUploading ? 'Uploading...' : 'Upload Logo Picture'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, false)}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gold-300 mb-1">
                Category Title *
              </label>
              <input
                type="text"
                required
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                placeholder="e.g. Organic Honey & Herbs"
                className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gold-300 mb-1">
                Description / Tagline
              </label>
              <input
                type="text"
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                placeholder="e.g. Raw, unheated & forest-sourced"
                className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gold-300 mb-1">
                Slug (Optional)
              </label>
              <input
                type="text"
                value={newCat.slug}
                onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                placeholder="e.g. organic-honey"
                className="w-full bg-forest-950 border border-forest-700 text-ivory-50 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-bold py-3 rounded-xl text-xs shadow-luxury-gold transition-all"
            >
              + Create Category with Logo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
