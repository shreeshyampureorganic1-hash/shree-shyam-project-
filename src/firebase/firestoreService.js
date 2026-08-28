import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  addDoc 
} from "firebase/firestore";
import { db } from "./config";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Enterprise Permanent Data Service (Server Disk Database + Firebase Firestore + Local Storage)
 */
export const FirestoreService = {
  // --- FETCH ALL STORE DATA ---
  async getStoreData() {
    try {
      const response = await fetch(`${API_BASE}/api/store/data`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          if (data.products?.length) localStorage.setItem("shree_products_cache", JSON.stringify(data.products));
          if (data.categories?.length) localStorage.setItem("shree_categories_cache", JSON.stringify(data.categories));
          if (data.videoBanner) localStorage.setItem("shree_video_banner_cache", JSON.stringify(data.videoBanner));
          if (data.settings) localStorage.setItem("shree_settings_cache", JSON.stringify(data.settings));
          return data;
        }
      }
    } catch (e) {
      console.warn("Server API not reachable directly, trying Firestore & local cache:", e);
    }

    // Fallback to Firestore
    try {
      const productsSnap = await getDocs(collection(db, "products"));
      const products = !productsSnap.empty ? productsSnap.docs.map(d => ({ id: d.id, ...d.data() })) : null;
      
      const settingsSnap = await getDocs(collection(db, "website_settings"));
      const settings = !settingsSnap.empty ? settingsSnap.docs[0].data() : null;

      const bannerSnap = await getDocs(collection(db, "video_banners"));
      const videoBanner = !bannerSnap.empty ? bannerSnap.docs[0].data() : null;

      if (products || settings || videoBanner) {
        return { products, settings, videoBanner };
      }
    } catch (e) {
      console.warn("Firestore fallback check:", e);
    }

    return null;
  },

  // --- PRODUCTS ---
  async getProducts() {
    try {
      const res = await fetch(`${API_BASE}/api/store/data`);
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          localStorage.setItem("shree_products_cache", JSON.stringify(data.products));
          return data.products;
        }
      }
    } catch (e) {
      // server check fallback
    }

    const cached = localStorage.getItem("shree_products_cache");
    return cached ? JSON.parse(cached) : null;
  },
  // --- PRODUCTS ---
async getProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/store/data`);
    if (res.ok) {
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        localStorage.setItem(
          "shree_products_cache",
          JSON.stringify(data.products)
        );
        return data.products;
      }
    }
  } catch (e) {}

  const cached = localStorage.getItem("shree_products_cache");
  return cached ? JSON.parse(cached) : [];
},

// --- GET CATEGORIES ---
async getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/store/data`);

    if (res.ok) {
      const data = await res.json();

      if (data.categories) {
        localStorage.setItem(
          "shree_categories_cache",
          JSON.stringify(data.categories)
        );

        return data.categories;
      }
    }
  } catch (e) {}

  const cached = localStorage.getItem(
    "shree_categories_cache"
  );

  return cached ? JSON.parse(cached) : [];
},

// --- GET VIDEO BANNER ---
async getVideoBanner() {
  try {
    const res = await fetch(`${API_BASE}/api/store/data`);

    if (res.ok) {
      const data = await res.json();

      if (data.videoBanner) {
        localStorage.setItem(
          "shree_video_banner_cache",
          JSON.stringify(data.videoBanner)
        );

        return data.videoBanner;
      }
    }
  } catch (e) {}

  const cached = localStorage.getItem(
    "shree_video_banner_cache"
  );

  return cached ? JSON.parse(cached) : {};
},

// --- GET SETTINGS ---
async getSettings() {
  try {
    const res = await fetch(`${API_BASE}/api/store/data`);

    if (res.ok) {
      const data = await res.json();

      if (data.settings) {
        localStorage.setItem(
          "shree_settings_cache",
          JSON.stringify(data.settings)
        );

        return data.settings;
      }
    }
  } catch (e) {}

  const cached = localStorage.getItem(
    "shree_settings_cache"
  );

  return cached ? JSON.parse(cached) : {};
},

  async saveProduct(product) {
    const id = product.id || `prod_${Date.now()}`;
    const productData = { ...product, id, updatedAt: new Date().toISOString() };

    // 1. Save to Server Disk Database
    try {
      await fetch(`${API_BASE}/api/store/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    } catch (e) {
      console.warn("Server disk product save error:", e);
    }

    // 2. Save to Local Cache
    const current = JSON.parse(localStorage.getItem("shree_products_cache") || "[]");
    const index = current.findIndex(p => p.id === id);
    if (index >= 0) {
      current[index] = productData;
    } else {
      current.unshift(productData);
    }
    localStorage.setItem("shree_products_cache", JSON.stringify(current));

    // 3. Save to Firebase Firestore
    try {
      await setDoc(doc(db, "products", id), productData, { merge: true });
    } catch (e) {
      console.warn("Firestore product save skipped:", e);
    }

    return productData;
  },

  async deleteProduct(id) {
    // 1. Delete from Server Disk Database
    try {
      await fetch(`${API_BASE}/api/store/product/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn("Server disk product delete error:", e);
    }

    // 2. Delete from Local Cache
    const current = JSON.parse(localStorage.getItem("shree_products_cache") || "[]");
    const filtered = current.filter(p => p.id !== id);
    localStorage.setItem("shree_products_cache", JSON.stringify(filtered));

    // 3. Delete from Firebase Firestore
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (e) {
      console.warn("Firestore product delete skipped:", e);
    }

    return true;
  },

  // --- VIDEO BANNERS ---
  async saveVideoBanner(bannerData) {
    const data = { ...bannerData, updatedAt: new Date().toISOString() };

    // 1. Save to Server Disk Database
    try {
      await fetch(`${API_BASE}/api/store/video-banner`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.warn("Server disk video banner save error:", e);
    }

    // 2. Local cache
    localStorage.setItem("shree_video_banner_cache", JSON.stringify(data));

    // 3. Firebase Firestore
    try {
      await setDoc(doc(db, "video_banners", "hero_banner"), data, { merge: true });
    } catch (e) {
      console.warn("Firestore video banner save skipped:", e);
    }

    return data;
  },

  // --- WEBSITE SETTINGS ---
  async saveSettings(settingsData) {
    const data = { ...settingsData, updatedAt: new Date().toISOString() };

    // 1. Save to Server Disk Database
    try {
      await fetch(`${API_BASE}/api/store/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.warn("Server disk settings save error:", e);
    }

    // 2. Local cache
    localStorage.setItem("shree_settings_cache", JSON.stringify(data));

    // 3. Firebase Firestore
    try {
      await setDoc(doc(db, "website_settings", "general_settings"), data, { merge: true });
    } catch (e) {
      console.warn("Firestore settings save skipped:", e);
    }

    return data;
  },

  // --- CATEGORIES ---
  async saveCategories(categoriesList) {
    // 1. Save to Server Disk Database
    try {
      await fetch(`${API_BASE}/api/store/categories`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoriesList)
      });
    } catch (e) {
      console.warn("Server disk categories save error:", e);
    }

    // 2. Local cache
    localStorage.setItem("shree_categories_cache", JSON.stringify(categoriesList));

    // 3. Firebase Firestore
    try {
      await setDoc(doc(db, "categories", "catalog"), { items: categoriesList, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.warn("Firestore categories save skipped:", e);
    }

    return categoriesList;
  },

  // --- ACTIVITY LOGS ---
  async logActivity(action, details = {}) {
    const logItem = {
      id: `log_${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      user: 'Super Admin'
    };

    const current = JSON.parse(localStorage.getItem("shree_activity_logs") || "[]");
    current.unshift(logItem);
    const trimmed = current.slice(0, 100);
    localStorage.setItem("shree_activity_logs", JSON.stringify(trimmed));
    
    try {
      await addDoc(collection(db, "activity_logs"), logItem);
    } catch (e) {
      // safe
    }
    return logItem;
  },

  async getActivityLogs() {
    const cached = localStorage.getItem("shree_activity_logs");
    return cached ? JSON.parse(cached) : [];
  }
};
