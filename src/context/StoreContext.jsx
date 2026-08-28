import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirestoreService } from '../firebase/firestoreService';


const StoreContext = createContext();

export function StoreProvider({ children }) {
 const [products, setProducts] = useState([]);

  const [categories, setCategoriesState] = useState([]);

  const [videoBanner, setVideoBanner] = useState({});

  const [settings, setSettings] = useState({});
  useEffect(() => {
  async function loadStoreData() {
    try {
      const [
        productsData,
        categoriesData,
        bannerData,
        settingsData
      ] = await Promise.all([
        FirestoreService.getProducts(),
        FirestoreService.getCategories(),
        FirestoreService.getVideoBanner(),
        FirestoreService.getSettings()
      ]);

      setProducts(productsData || []);
      setCategoriesState(categoriesData || []);
      setVideoBanner(bannerData || {});
      setSettings(settingsData || {});
    } catch (error) {
      console.error("Failed to load store data:", error);
    }
  }

  loadStoreData();
}, []);

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('shree_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('shree_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

 useEffect(() => {
  async function loadStoreData() {
    try {
      const [
        productsData,
        categoriesData,
        bannerData,
        settingsData
      ] = await Promise.all([
        FirestoreService.getProducts(),
        FirestoreService.getCategories(),
        FirestoreService.getVideoBanner(),
        FirestoreService.getSettings()
      ]);

      setProducts(productsData || []);
      setCategoriesState(categoriesData || []);
      setVideoBanner(bannerData || {});
      setSettings(settingsData || {});
    } catch (error) {
      console.error("Failed to load store data:", error);

      setProducts(
        JSON.parse(
          localStorage.getItem("shree_products_cache") || "[]"
        )
      );

      setCategoriesState(
        JSON.parse(
          localStorage.getItem("shree_categories_cache") || "[]"
        )
      );

      setVideoBanner(
        JSON.parse(
          localStorage.getItem("shree_video_banner_cache") || "{}"
        )
      );

      setSettings(
        JSON.parse(
          localStorage.getItem("shree_settings_cache") || "{}"
        )
      );
    }
  }

  loadStoreData();
}, []); // Sync initial data permanently from backend disk database and Firestore
  useEffect(() => {
  localStorage.setItem(
    'shree_products_cache',
    JSON.stringify(products)
  );
}, [products]);

useEffect(() => {
  localStorage.setItem(
    'shree_categories_cache',
    JSON.stringify(categories)
  );
}, [categories]);

useEffect(() => {
  localStorage.setItem(
    'shree_video_banner_cache',
    JSON.stringify(videoBanner)
  );
}, [videoBanner]);

useEffect(() => {
  localStorage.setItem(
    'shree_settings_cache',
    JSON.stringify(settings)
  );
}, [settings]);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('shree_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to local storage
  useEffect(() => {
    localStorage.setItem('shree_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- CART ACTIONS ---
  const addToCart = (product, quantity = 1, weight = null) => {
    const selectedWeight = weight || product.weight || 'Standard';
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedWeight === selectedWeight
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity, selectedWeight }];
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateCartQuantity = (id, selectedWeight, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, selectedWeight);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedWeight === selectedWeight
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const removeFromCart = (id, selectedWeight) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && item.selectedWeight === selectedWeight))
    );
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- WISHLIST ACTIONS ---
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved to wishlist! ❤️`);
        return [...prev, product];
      }
    });
  };

  // --- ADMIN PRODUCT ACTIONS (PERMANENT) ---
  const saveProduct = async (productData) => {
    const saved = await FirestoreService.saveProduct(productData);
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    await FirestoreService.logActivity(
      productData.id ? `Product Edited: ${productData.name}` : `Product Added: ${productData.name}`,
      { name: productData.name, price: productData.price }
    );
    showToast(`Changes Saved Successfully`);
    return saved;
  };

  const deleteProduct = async (id, name = 'Product') => {
    await FirestoreService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await FirestoreService.logActivity(`Product Deleted: ${name}`, { id });
    showToast(`Product deleted successfully.`);
  };

  // --- ADMIN VIDEO BANNER ACTIONS (PERMANENT) ---
  const updateVideoBanner = async (bannerData) => {
    const updated = await FirestoreService.saveVideoBanner(bannerData);
    setVideoBanner(updated);
    await FirestoreService.logActivity('Hero Video Banner Updated', { title: bannerData.title });
    showToast('Changes Saved Successfully');
    return updated;
  };

  // --- ADMIN SETTINGS ACTIONS (PERMANENT) ---
  const updateSettings = async (settingsData) => {
    const updated = await FirestoreService.saveSettings(settingsData);
    setSettings(updated);
    if (updated.whatsappNumber) {
      localStorage.setItem('shree_whatsapp_number', updated.whatsappNumber);
    }
    await FirestoreService.logActivity('Website Settings Updated');
    showToast('Changes Saved Successfully');
    return updated;
  };

  // --- ADMIN CATEGORIES ACTIONS (PERMANENT) ---
  const setCategories = async (categoriesList) => {
    setCategoriesState(categoriesList);
    await FirestoreService.saveCategories(categoriesList);
    showToast('Changes Saved Successfully');
  };

  // --- ADMIN BACKUP & RESTORE ACTIONS ---
  const exportBackupJSON = () => {
    const backup = {
      version: '1.0',
      brand: 'Shree Shyam Pure Organic',
      timestamp: new Date().toISOString(),
      products,
      categories,
      videoBanner,
      settings
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `shree_shyam_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    FirestoreService.logActivity('Full Database Backup Exported');
    showToast('Backup JSON downloaded successfully!');
  };

  const importBackupJSON = async (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }
      if (data.categories && Array.isArray(data.categories)) {
        setCategoriesState(data.categories);
      }
      if (data.videoBanner) {
        setVideoBanner(data.videoBanner);
      }
      if (data.settings) {
        setSettings(data.settings);
      }

      // Save to server permanent database
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/store/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      await FirestoreService.logActivity('Database Restored From Backup');
      showToast('Changes Saved Successfully');
      return true;
    } catch (e) {
      showToast('Failed to restore backup. Invalid JSON file format.', 'error');
      return false;
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        videoBanner,
        settings,
        cart,
        wishlist,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isCartOpen,
        setIsCartOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        activeModalProduct,
        setActiveModalProduct,
        toastMessage,
        showToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        saveProduct,
        deleteProduct,
        updateVideoBanner,
        updateSettings,
        setCategories,
        exportBackupJSON,
        importBackupJSON,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
