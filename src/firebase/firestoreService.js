import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  deleteDoc, 
  addDoc,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./config";
import { 
  initialProducts, 
  initialCategories, 
  initialVideoBanner, 
  initialSettings 
} from "../utils/sampleData";

/**
 * Enterprise Production Firestore Service
 * Pure cloud-first database architecture with Firestore as single source of truth.
 * Zero localhost dependencies. Compatible with Vercel and local environments.
 */
export const FirestoreService = {
  // --- INITIAL ONE-TIME SETUP CHECK ---
  async initializeDefaultsIfEmpty() {
    try {
      const prodSnap = await getDocs(collection(db, "products"));
      if (prodSnap.empty) {
        console.log("🌱 First-time setup: Seeding initial products to Firestore...");
        for (const prod of initialProducts) {
          await setDoc(doc(db, "products", prod.id), {
            ...prod,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      }

      const catSnap = await getDocs(collection(db, "categories"));
      if (catSnap.empty) {
        console.log("🌱 First-time setup: Seeding initial categories to Firestore...");
        for (const cat of initialCategories) {
          await setDoc(doc(db, "categories", cat.id), {
            ...cat,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      }

      const bannerDoc = await getDoc(doc(db, "video_banners", "hero_banner"));
      if (!bannerDoc.exists()) {
        console.log("🌱 First-time setup: Seeding initial video banner to Firestore...");
        await setDoc(doc(db, "video_banners", "hero_banner"), {
          ...initialVideoBanner,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }

      const settingsDoc = await getDoc(doc(db, "website_settings", "general_settings"));
      if (!settingsDoc.exists()) {
        console.log("🌱 First-time setup: Seeding initial settings to Firestore...");
        await setDoc(doc(db, "website_settings", "general_settings"), {
          ...initialSettings,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore default initialization note:", err);
    }
  },

  // --- PRODUCTS ---
  async getProducts() {
    try {
      const snap = await getDocs(collection(db, "products"));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        localStorage.setItem("shree_products_cache", JSON.stringify(list));
        return list;
      }

      // If completely empty on cloud, seed once
      await this.initializeDefaultsIfEmpty();
      const freshSnap = await getDocs(collection(db, "products"));
      if (!freshSnap.empty) {
        const freshList = freshSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        localStorage.setItem("shree_products_cache", JSON.stringify(freshList));
        return freshList;
      }
    } catch (e) {
      console.error("Firestore getProducts error:", e);
    }

    const cached = localStorage.getItem("shree_products_cache");
    return cached ? JSON.parse(cached) : initialProducts;
  },

  async saveProduct(product) {
    const id = product.id || `prod_${Date.now()}`;
    const productData = { 
      ...product, 
      id, 
      updatedAt: new Date().toISOString() 
    };

    // 1. Direct Firestore write
    try {
      await setDoc(doc(db, "products", id), productData, { merge: true });
    } catch (e) {
      console.error("Firestore saveProduct error:", e);
    }

    // 2. Update local fallback cache
    try {
      const current = JSON.parse(localStorage.getItem("shree_products_cache") || "[]");
      const index = current.findIndex(p => p.id === id);
      if (index >= 0) {
        current[index] = productData;
      } else {
        current.unshift(productData);
      }
      localStorage.setItem("shree_products_cache", JSON.stringify(current));
    } catch (e) {
      // cache ignore
    }

    return productData;
  },

  async deleteProduct(id) {
    // 1. Direct Firestore delete
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (e) {
      console.error("Firestore deleteProduct error:", e);
    }

    // 2. Update local fallback cache
    try {
      const current = JSON.parse(localStorage.getItem("shree_products_cache") || "[]");
      const filtered = current.filter(p => p.id !== id);
      localStorage.setItem("shree_products_cache", JSON.stringify(filtered));
    } catch (e) {
      // cache ignore
    }

    return true;
  },

  // --- CATEGORIES ---
  async getCategories() {
    try {
      const snap = await getDocs(collection(db, "categories"));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        localStorage.setItem("shree_categories_cache", JSON.stringify(list));
        return list;
      }

      await this.initializeDefaultsIfEmpty();
      const freshSnap = await getDocs(collection(db, "categories"));
      if (!freshSnap.empty) {
        const freshList = freshSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        localStorage.setItem("shree_categories_cache", JSON.stringify(freshList));
        return freshList;
      }
    } catch (e) {
      console.error("Firestore getCategories error:", e);
    }

    const cached = localStorage.getItem("shree_categories_cache");
    return cached ? JSON.parse(cached) : initialCategories;
  },

  async saveCategories(categoriesList) {
    try {
      for (const cat of categoriesList) {
        await setDoc(doc(db, "categories", cat.id || `cat_${cat.slug}`), {
          ...cat,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      console.error("Firestore saveCategories error:", e);
    }

    localStorage.setItem("shree_categories_cache", JSON.stringify(categoriesList));
    return categoriesList;
  },

  async saveCategory(category) {
    const id = category.id || `cat_${category.slug || Date.now()}`;
    const data = { ...category, id, updatedAt: new Date().toISOString() };

    try {
      await setDoc(doc(db, "categories", id), data, { merge: true });
    } catch (e) {
      console.error("Firestore saveCategory error:", e);
    }

    try {
      const current = JSON.parse(localStorage.getItem("shree_categories_cache") || "[]");
      const idx = current.findIndex(c => c.id === id);
      if (idx >= 0) current[idx] = data;
      else current.push(data);
      localStorage.setItem("shree_categories_cache", JSON.stringify(current));
    } catch (e) {}

    return data;
  },

  async deleteCategory(id) {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (e) {
      console.error("Firestore deleteCategory error:", e);
    }

    try {
      const current = JSON.parse(localStorage.getItem("shree_categories_cache") || "[]");
      const filtered = current.filter(c => c.id !== id);
      localStorage.setItem("shree_categories_cache", JSON.stringify(filtered));
    } catch (e) {}

    return true;
  },

  // --- VIDEO BANNER ---
  async getVideoBanner() {
    try {
      const docSnap = await getDoc(doc(db, "video_banners", "hero_banner"));
      if (docSnap.exists()) {
        const banner = docSnap.data();
        localStorage.setItem("shree_video_banner_cache", JSON.stringify(banner));
        return banner;
      }

      await this.initializeDefaultsIfEmpty();
      const freshDoc = await getDoc(doc(db, "video_banners", "hero_banner"));
      if (freshDoc.exists()) {
        const freshBanner = freshDoc.data();
        localStorage.setItem("shree_video_banner_cache", JSON.stringify(freshBanner));
        return freshBanner;
      }
    } catch (e) {
      console.error("Firestore getVideoBanner error:", e);
    }

    const cached = localStorage.getItem("shree_video_banner_cache");
    return cached ? JSON.parse(cached) : initialVideoBanner;
  },

  async saveVideoBanner(bannerData) {
    const data = { ...bannerData, updatedAt: new Date().toISOString() };

    try {
      await setDoc(doc(db, "video_banners", "hero_banner"), data, { merge: true });
    } catch (e) {
      console.error("Firestore saveVideoBanner error:", e);
    }

    localStorage.setItem("shree_video_banner_cache", JSON.stringify(data));
    return data;
  },

  // --- WEBSITE SETTINGS ---
  async getSettings() {
    try {
      const docSnap = await getDoc(doc(db, "website_settings", "general_settings"));
      if (docSnap.exists()) {
        const settings = docSnap.data();
        localStorage.setItem("shree_settings_cache", JSON.stringify(settings));
        return settings;
      }

      await this.initializeDefaultsIfEmpty();
      const freshDoc = await getDoc(doc(db, "website_settings", "general_settings"));
      if (freshDoc.exists()) {
        const freshSettings = freshDoc.data();
        localStorage.setItem("shree_settings_cache", JSON.stringify(freshSettings));
        return freshSettings;
      }
    } catch (e) {
      console.error("Firestore getSettings error:", e);
    }

    const cached = localStorage.getItem("shree_settings_cache");
    return cached ? JSON.parse(cached) : initialSettings;
  },

  async saveSettings(settingsData) {
    const data = { ...settingsData, updatedAt: new Date().toISOString() };

    try {
      await setDoc(doc(db, "website_settings", "general_settings"), data, { merge: true });
    } catch (e) {
      console.error("Firestore saveSettings error:", e);
    }

    localStorage.setItem("shree_settings_cache", JSON.stringify(data));
    return data;
  },

  // --- ACTIVITY LOGS ---
  async getActivityLogs() {
    try {
      const q = query(collection(db, "activity_logs"), orderBy("timestamp", "desc"), limit(100));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const logs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        localStorage.setItem("shree_activity_logs", JSON.stringify(logs));
        return logs;
      }
    } catch (e) {
      console.warn("Firestore getActivityLogs error:", e);
    }

    const cached = localStorage.getItem("shree_activity_logs");
    return cached ? JSON.parse(cached) : [];
  },

  async logActivity(action, details = {}) {
    const logItem = {
      action,
      details,
      timestamp: new Date().toISOString(),
      user: 'Super Admin'
    };

    try {
      const docRef = await addDoc(collection(db, "activity_logs"), logItem);
      logItem.id = docRef.id;
    } catch (e) {
      logItem.id = `log_${Date.now()}`;
    }

    try {
      const current = JSON.parse(localStorage.getItem("shree_activity_logs") || "[]");
      current.unshift(logItem);
      localStorage.setItem("shree_activity_logs", JSON.stringify(current.slice(0, 100)));
    } catch (e) {}

    return logItem;
  }
};
