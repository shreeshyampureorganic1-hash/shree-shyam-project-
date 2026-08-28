import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { uploadToCloudinary, CloudinaryFolders } from '../../services/cloudinaryService';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Star, 
  Check, 
  X, 
  Search, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  ShieldCheck
} from 'lucide-react';

export default function ProductManager() {
  const { products, categories, saveProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null); // null when table view, object when modal/form view
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Pickles (अचार)',
    categorySlug: 'pickles',
    price: '',
    originalPrice: '',
    weight: '500g',
    weightOptions: '250g, 500g, 1kg',
    inStock: true,
    badge: '100% Organic',
    tagline: '',
    description: '',
    ingredients: '',
    benefits: '',
    imageUrls: []
  });

  const openNewForm = () => {
    setFormData({
      id: `prod_${Date.now()}`,
      name: '',
      category: categories[1]?.name || 'Pickles (अचार)',
      categorySlug: categories[1]?.slug || 'pickles',
      price: '',
      originalPrice: '',
      weight: '500g',
      weightOptions: '250g, 500g, 1kg',
      inStock: true,
      badge: '100% Organic',
      tagline: '',
      description: '',
      ingredients: 'Organic Ingredients, Cold-Pressed Oil, Rock Salt',
      benefits: '100% Chemical-free\nAids digestion and vitality',
      imageUrls: []
    });
    setEditingProduct({});
  };

  const openEditForm = (product) => {
    setFormData({
      ...product,
      weightOptions: Array.isArray(product.weightOptions) ? product.weightOptions.join(', ') : product.weightOptions || '',
      ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients || '',
      benefits: Array.isArray(product.benefits) ? product.benefits.join('\n') : product.benefits || '',
      imageUrls: product.imageUrls || []
    });
    setEditingProduct(product);
  };

  // Image Upload handler (Up to 8 images into Cloudinary)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (formData.imageUrls.length + files.length > 8) {
      alert('You can upload a maximum of 8 images per product.');
      return;
    }

    setIsUploading(true);
    const newUrls = [...formData.imageUrls];

    for (const file of files) {
      try {
        const folder = CloudinaryFolders.productFolder(formData.categorySlug || 'general', formData.name || 'item');
        const res = await uploadToCloudinary(file, folder, 'image');
        if (res.url) {
          newUrls.push(res.url);
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }

    setFormData((prev) => ({ ...prev, imageUrls: newUrls }));
    setIsUploading(false);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const setPrimaryImage = (index) => {
    if (index === 0) return;
    const urls = [...formData.imageUrls];
    const [selected] = urls.splice(index, 1);
    urls.unshift(selected);
    setFormData((prev) => ({ ...prev, imageUrls: urls }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Please fill in Product Name and Price.');
      return;
    }

    const cleaned = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      weightOptions: typeof formData.weightOptions === 'string'
        ? formData.weightOptions.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.weightOptions,
      ingredients: typeof formData.ingredients === 'string'
        ? formData.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.ingredients,
      benefits: typeof formData.benefits === 'string'
        ? formData.benefits.split('\n').map((s) => s.trim()).filter(Boolean)
        : formData.benefits,
      imageUrls: formData.imageUrls.length > 0 ? formData.imageUrls : ['/logo.jpg']
    };

    await saveProduct(cleaned);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
            <Package className="w-4 h-4" />
            <span>Product Inventory Controller</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ivory-50 mt-1">
            Organic Product Catalog
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Manage product images (up to 8 per item), pricing, ingredients, and stock status.
          </p>
        </div>

        <button
          onClick={openNewForm}
          className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-luxury-gold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product Edit / Add Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-forest-900 border border-gold-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-2 rounded-full bg-forest-950"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-ivory-50 mb-6">
              {formData.id && products.some((p) => p.id === formData.id) ? 'Edit Organic Product' : 'Create New Organic Product'}
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                    Product Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rajasthani Mango Pickle"
                    className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selected = categories.find((c) => c.name === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categorySlug: selected?.slug || 'general'
                      });
                    }}
                    className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  >
                    {categories.filter((c) => c.slug !== 'all').map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                    Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="349"
                    className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none font-bold text-gold-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="449"
                    className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                    Default Weight / Pack
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="500g"
                    className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Best Seller / 100% Organic"
                    className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Weight Options */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                  Pack Size Options (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.weightOptions}
                  onChange={(e) => setFormData({ ...formData, weightOptions: e.target.value })}
                  placeholder="250g, 500g, 1kg"
                  className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                />
              </div>

              {/* Tagline & Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Handmade in small batches with cold-pressed mustard oil..."
                  className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full traditional background, preparation method, and purity aspects..."
                  className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                />
              </div>

              {/* Ingredients & Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                    Ingredients (Comma separated)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="Raw Mangoes, Mustard Oil, Fennel, Rock Salt"
                    className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                    Ayurvedic Benefits (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    placeholder="Aids healthy digestion&#10;Rich in natural antioxidants"
                    className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl px-4 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* MULTI-IMAGE UPLOAD SECTION (UP TO 8 IMAGES) */}
              <div className="border border-forest-800 bg-forest-950/80 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gold-300">
                      Product Gallery Photos ({formData.imageUrls.length}/8 Max)
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Upload up to 8 high-definition photos. First image is the primary cover photo.
                    </p>
                  </div>
                  {formData.imageUrls.length < 8 && (
                    <label className="cursor-pointer bg-forest-800 hover:bg-forest-700 text-gold-300 text-xs font-bold px-4 py-2 rounded-xl border border-gold-500/40 flex items-center space-x-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading to Cloudinary...' : 'Upload Photos'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Images Preview Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-2">
                  {formData.imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 group bg-stone-900 ${
                        index === 0 ? 'border-gold-500 shadow-luxury-gold' : 'border-forest-700'
                      }`}
                    >
                      <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />

                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-gold-500 text-forest-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                          PRIMARY
                        </span>
                      )}

                      {/* Hover controls */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center space-y-1 transition-opacity">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="bg-gold-500 text-forest-950 text-[9px] font-bold px-1.5 py-0.5 rounded"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-600 text-white p-1 rounded-full text-xs"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {formData.imageUrls.length === 0 && (
                    <div className="col-span-4 sm:col-span-8 p-6 text-center text-xs text-stone-500 border border-dashed border-forest-700 rounded-xl">
                      No photos uploaded yet. Upload up to 8 images for rich gallery preview.
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-forest-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-forest-950 text-stone-300 hover:text-white px-6 py-2.5 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-bold px-8 py-2.5 rounded-xl text-xs shadow-luxury-gold"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-forest-900/60 p-4 rounded-2xl border border-forest-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or category..."
            className="w-full bg-forest-950 border border-forest-700 focus:border-gold-500 text-ivory-50 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none"
          />
        </div>
        <div className="text-xs text-stone-400">
          Showing <strong className="text-gold-400">{filteredProducts.length}</strong> Products
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-forest-900/80 border border-gold-900/40 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-stone-300">
            <thead className="bg-forest-950 text-gold-400 font-bold uppercase tracking-wider border-b border-forest-800">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Pack Size</th>
                <th className="py-4 px-4">Images</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-forest-800/40 transition-colors">
                  <td className="py-3 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.imageUrls?.[0] || '/logo.jpg'}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gold-900 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-ivory-50 text-sm">{p.name}</h4>
                        {p.badge && (
                          <span className="text-[10px] text-gold-400 bg-forest-950 px-2 py-0.5 rounded font-bold border border-gold-900/60">
                            {p.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-stone-200">{p.category}</td>
                  <td className="py-3 px-4 font-bold text-gold-300 text-sm">₹{p.price}</td>
                  <td className="py-3 px-4">{p.weight}</td>
                  <td className="py-3 px-4 font-bold text-stone-300">
                    {p.imageUrls?.length || 1} / 8 Photos
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right space-x-2">
                    <button
                      onClick={() => openEditForm(p)}
                      className="p-2 bg-forest-950 hover:bg-forest-800 text-gold-300 rounded-xl border border-forest-700 transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                          deleteProduct(p.id, p.name);
                        }
                      }}
                      className="p-2 bg-red-950 hover:bg-red-900 text-red-400 rounded-xl border border-red-800 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
