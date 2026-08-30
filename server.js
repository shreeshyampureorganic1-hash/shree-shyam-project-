import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// --- PERMANENT DISK DATABASE SYSTEM ---
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Default initial dataset (seeded ONCE only if database.json does not exist)
const defaultInitialDb = {
  categories: [
    { 
      id: 'cat_all', 
      name: 'All Products', 
      slug: 'all', 
      icon: 'Sparkles', 
      image: '/logo.jpg',
      description: 'Explore the full organic range'
    },
    { 
      id: 'cat_pickles', 
      name: 'Pickles (अचार)', 
      slug: 'pickles', 
      icon: 'Jar', 
      image: '/images/categories/pickles-logo.jpg',
      description: 'Taste Jo Dil Se Judta Hai • 100% Pure & Natural'
    },
    { 
      id: 'cat_powders', 
      name: 'Morning Powders', 
      slug: 'morning-powders', 
      icon: 'Leaf', 
      image: '/images/categories/moringa-powders-logo.jpg',
      description: 'Nutrient Rich • Boosts Energy • Immunity Support'
    },
    { 
      id: 'cat_soaps', 
      name: 'Natural Soaps', 
      slug: 'natural-soaps', 
      icon: 'Soap', 
      image: '/images/categories/soaps-logo.jpg',
      description: 'Gentle Care From Nature • Pure, Safe, Natural'
    },
    { 
      id: 'cat_ghee', 
      name: 'A2 Ghee & Cold Press Oils', 
      slug: 'ghee-oils', 
      icon: 'Droplets', 
      image: '/images/categories/ghee-oils-logo.jpg',
      description: "Nature's Goodness • Your Wellness • Cold Pressed"
    },
    { 
      id: 'cat_wellness', 
      name: 'Handmade Wellness', 
      slug: 'handmade-wellness', 
      icon: 'Heart', 
      image: '/images/categories/wellness-logo.jpg',
      description: 'Traditional Ayurvedic Care • Handcrafted with Devotion'
    }
  ],
  products: [
    {
      id: 'prod_1',
      name: 'Traditional Organic Mango Pickle (घर का बना आम का अचार)',
      slug: 'traditional-mango-pickle',
      category: 'Pickles (अचार)',
      categorySlug: 'pickles',
      price: 349,
      originalPrice: 449,
      weight: '500g',
      weightOptions: ['250g', '500g', '1kg'],
      inStock: true,
      rating: 4.9,
      reviewsCount: 128,
      badge: 'Best Seller',
      tagline: 'Taste Jo Dil Se Judta Hai — Handmade with Love & Cold Pressed Mustard Oil.',
      description: 'Our authentic traditional Mango Pickle is made using ancestral recipes from Marwar. Hand-cut raw Ramkela mangoes marinated in pure cold-pressed mustard oil, sun-dried fenugreek, fennel seeds, and rock salt. No artificial colors, preservatives, or synthetic vinegar.',
      ingredients: ['Raw Ramkela Mangoes', 'Cold-Pressed Mustard Oil', 'Fennel Seeds (Saunf)', 'Fenugreek (Methi)', 'Kalonji', 'Turmeric', 'Rock Salt (Sendha Namak)', 'Red Chilli Flakes'],
      benefits: ['Aids healthy digestion & gut microbiome', 'Rich in natural antioxidants & Vitamin C', 'Zero chemical preservatives or acidity regulators', 'Aged naturally under warm sunlight'],
      imageUrls: [
        '/images/categories/pickles-logo.jpg',
        'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      id: 'prod_2',
      name: 'Organic Moringa Superfood Leaf Powder (सहजन चूर्ण)',
      slug: 'organic-moringa-superfood-powder',
      category: 'Morning Powders',
      categorySlug: 'morning-powders',
      price: 320,
      originalPrice: 420,
      weight: '200g',
      weightOptions: ['200g', '500g', '1kg'],
      inStock: true,
      rating: 5.0,
      reviewsCount: 114,
      badge: '100% Pure',
      tagline: 'Nutrient Rich • Boosts Energy • Immunity Support • Natural Detox.',
      description: '100% Pure shade-dried Moringa Oleifera leaves, ozone-washed and finely ground at low temperatures. Packed with over 90 bio-available nutrients, 46 antioxidants, and essential amino acids. An ideal morning superfood ritual.',
      ingredients: ['100% Pure Certified Organic Moringa Oleifera Leaves'],
      benefits: ['Natural sustained energy without caffeine crashes', 'High iron, calcium, and plant protein', 'Enhances daily immune response & natural detox', 'Supports healthy metabolism and blood sugar'],
      imageUrls: [
        '/images/categories/moringa-powders-logo.jpg',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1512290900672-1f4868a8677c?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      id: 'prod_3',
      name: 'Artisanal Ayurvedic Neem, Tulsi & Aloe Vera Herbal Soap',
      slug: 'ayurvedic-herbal-soap',
      category: 'Natural Soaps',
      categorySlug: 'natural-soaps',
      price: 180,
      originalPrice: 220,
      weight: '125g',
      weightOptions: ['Pack of 1 (125g)', 'Pack of 3 (375g)', 'Pack of 5 (625g)'],
      inStock: true,
      rating: 4.9,
      reviewsCount: 96,
      badge: 'Gentle Care',
      tagline: 'Gentle Care from Nature • Pure, Safe, Chemical Free & Eco Friendly.',
      description: 'Cold-processed artisanal bath bar crafted using fresh farm-harvested Neem leaves, Krishna Tulsi, Aloe Vera, and lavender infused in virgin coconut oil and shea butter. Deeply cleanses impurities while preserving skin moisture.',
      ingredients: ['Cold-Pressed Virgin Coconut Oil', 'Raw Shea Butter', 'Neem Leaf Extract', 'Holy Basil (Krishna Tulsi) Oil', 'Aloe Vera Gel', 'Lavender Essence', 'Spring Water'],
      benefits: ['Naturally antibacterial and soothing for sensitive skin', 'Soothes acne, irritation, and blemishes', 'Chemical-free with zero SLS, parabens, or artificial perfume', 'Gentle nourishing hydration'],
      imageUrls: [
        '/images/categories/soaps-logo.jpg',
        'https://images.unsplash.com/photo-1607006314177-3e08c02c6381?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      id: 'prod_4',
      name: 'Authentic A2 Vedic Bilona Desi Gir Cow Ghee & Cold Press Oils',
      slug: 'a2-vedic-bilona-cow-ghee',
      category: 'A2 Ghee & Cold Press Oils',
      categorySlug: 'ghee-oils',
      price: 1450,
      originalPrice: 1750,
      weight: '500ml',
      weightOptions: ['250ml', '500ml', '1 Litre'],
      inStock: true,
      rating: 5.0,
      reviewsCount: 240,
      badge: 'Vedic Bilona',
      tagline: "Nature's Goodness • Your Wellness • Hand-churned Vedic Bilona Ghee.",
      description: 'Prepared strictly following ancient Ayurvedic Bilona method. Whole A2 milk from grass-fed indigenous Gir cows is converted to curd, hand-churned with bi-directional wooden churners (Manthan), and gently heated on low wood fire in brass vessels. Golden granular texture with divine aroma.',
      ingredients: ['100% Pure Cultured Butterfat from Grass-Fed A2 Desi Gir Cow Milk'],
      benefits: ['Enhances memory, gut lining, and Ojas (vitality)', 'Rich in A2 Beta-Casein, Omega-3, and Butyric Acid', 'Zero hormones, antibiotics, or synthetic additives', 'High smoke point for wholesome sattvic cooking'],
      imageUrls: [
        '/images/categories/ghee-oils-logo.jpg',
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      id: 'prod_5',
      name: 'Pure Wild Amla Vitamin C Immunity Powder (आंवला चूर्ण)',
      slug: 'pure-organic-wild-amla-powder',
      category: 'Morning Powders',
      categorySlug: 'morning-powders',
      price: 299,
      originalPrice: 399,
      weight: '250g',
      weightOptions: ['200g', '500g', '1kg'],
      inStock: true,
      rating: 5.0,
      reviewsCount: 94,
      badge: '100% Organic',
      tagline: 'Forest-sourced Indian Gooseberries, shade-dried and stone-ground.',
      description: '100% Pure shade-dried wild Amla fruit powder sourced directly from organic farms. Packed with concentrated Vitamin C, bioflavonoids, and rejuvenating antioxidants.',
      ingredients: ['100% Pure Forest-Harvested Emblica Officinalis (Wild Amla Fruit)'],
      benefits: ['Boosts natural immunity & collagen synthesis', 'Strengthens hair roots & prevents premature greying', 'Purifies blood & regulates digestive fire (Agni)'],
      imageUrls: [
        '/images/categories/moringa-powders-logo.jpg',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1512290900672-1f4868a8677c?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      id: 'prod_6',
      name: 'Handcrafted Heritage Wellness Chyawanprash & Herbal Tonics',
      slug: 'handmade-wellness-chyawanprash',
      category: 'Handmade Wellness',
      categorySlug: 'handmade-wellness',
      price: 650,
      originalPrice: 799,
      weight: '500g',
      weightOptions: ['250g', '500g', '1kg'],
      inStock: true,
      rating: 4.9,
      reviewsCount: 88,
      badge: 'Handmade Care',
      tagline: 'Prepared with wild forest amla, A2 ghee, raw honey & 40+ rejuvenating herbs.',
      description: 'Crafted in small wood-fired batches with wild amla paste cooked in A2 bilona cow ghee and infused with 40+ wild forest botanical roots like Ashwagandha, Shatavari, Pippali, and raw unpasteurized honey.',
      ingredients: ['Wild Organic Amla', 'A2 Desi Cow Ghee', 'Raw Unheated Forest Honey', 'Ashwagandha', 'Shatavari', 'Pippali', 'Cardamom', 'Vanshlochan'],
      benefits: ['Rejuvenates respiratory strength and cellular vitality', 'Enhances stamina and seasonal resistance', 'Free from refined sugar or chemical preservatives'],
      imageUrls: [
        '/images/categories/wellness-logo.jpg',
        'https://images.unsplash.com/photo-1512290900672-1f4868a8677c?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=85'
      ]
    }
  ],
  videoBanner: {
    enabled: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tea-plantation-with-a-blue-sky-4076-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1920&q=85',
    title: '100% Pure Organic Products',
    subtitle: 'Traditional Taste • Natural Wellness • Handmade Care',
    badgeText: 'Pure • Chemical-Free • Farm Direct',
    buttonText: 'Shop Pure Products',
    buttonLink: '#products-section',
    secondaryButtonText: 'Order on WhatsApp',
    secondaryButtonLink: '#whatsapp'
  },
  settings: {
    siteName: 'Shree Shyam Pure Organic',
    tagline: 'Traditional Taste • Natural Wellness • Handmade Care',
    logoUrl: '/logo.jpg',
    email: 'shreeshyampure.organic1@gmail.com',
    phone: '+91 90411 03099',
    whatsappNumber: '+91 90411 03099',
    address: 'Mirthal, Near Pathankot, Punjab, India',
    mapsUrl: 'https://maps.app.goo.gl/REesz8dR2esjDu1X8',
    announcementText: '✨ 100% Pure Organic & Chemical Free • Dispatching from Mirthal, Punjab Across India ✨',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    footerDescription: 'Dedicated to resurrecting ancient Ayurvedic principles and traditional culinary wisdom. Pure, handmade, and free from all chemicals.',
    freeDeliveryThreshold: 999,
    currencySymbol: '₹'
  },
  activityLogs: [
    {
      id: `log_init`,
      action: 'Database Initialized Permanently',
      details: { storage: 'Disk JSON + Cloudinary CDN' },
      timestamp: new Date().toISOString(),
      user: 'System'
    }
  ]
};

// Ensure database file exists on disk
function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultInitialDb, null, 2), 'utf-8');
    console.log('📦 Created new persistent database on disk at:', DB_FILE);
  } else {
    console.log('✅ Loaded existing persistent database from disk at:', DB_FILE);
  }
}

initDatabase();

function readDatabase() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return defaultInitialDb;
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// Configure Cloudinary securely from environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'alee6ahr';
const apiKey = process.env.CLOUDINARY_API_KEY || '815152624361853';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'kyPqnsgT2ap4Njy7eqFTTL6pBm4';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

// Configure Multer for memory buffer upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024 // 500 MB max for videos/images
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    cloudName,
    configured: Boolean(apiKey && apiSecret),
    database: 'persistent-disk',
    timestamp: new Date().toISOString()
  });
});

// --- STORE DATA PERSISTENCE REST ENDPOINTS ---

/**
 * Fetch all store data (Products, Categories, Video Banner, Settings, Logs)
 */
app.get('/api/store/data', (req, res) => {
  try {
    const db = readDatabase();
    res.json({
      success: true,
      products: db.products || [],
      categories: db.categories || [],
      videoBanner: db.videoBanner || {},
      settings: db.settings || {},
      activityLogs: db.activityLogs || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read persistent store data' });
  }
});

/**
 * Save or update a product permanently
 */
app.post('/api/store/product', (req, res) => {
  try {
    const product = req.body;
    if (!product || !product.name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const db = readDatabase();
    const id = product.id || `prod_${Date.now()}`;
    const productData = { ...product, id, updatedAt: new Date().toISOString() };

    const index = db.products.findIndex(p => p.id === id);
    if (index >= 0) {
      db.products[index] = productData;
    } else {
      db.products.unshift(productData);
    }

    // Add activity log
    db.activityLogs = db.activityLogs || [];
    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      action: index >= 0 ? `Product Updated: ${product.name}` : `Product Added: ${product.name}`,
      details: { name: product.name, price: product.price },
      timestamp: new Date().toISOString(),
      user: 'Super Admin'
    });
    db.activityLogs = db.activityLogs.slice(0, 100);

    writeDatabase(db);
    res.json({ success: true, product: productData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save product permanently' });
  }
});

/**
 * Delete a product permanently
 */
app.delete('/api/store/product/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    const deletedProduct = db.products.find(p => p.id === id);

    db.products = db.products.filter(p => p.id !== id);

    db.activityLogs = db.activityLogs || [];
    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      action: `Product Deleted: ${deletedProduct?.name || id}`,
      details: { id },
      timestamp: new Date().toISOString(),
      user: 'Super Admin'
    });
    db.activityLogs = db.activityLogs.slice(0, 100);

    writeDatabase(db);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

/**
 * Save hero video banner permanently
 */
app.put('/api/store/video-banner', (req, res) => {
  try {
    const banner = req.body;
    const db = readDatabase();
    db.videoBanner = { ...banner, updatedAt: new Date().toISOString() };

    db.activityLogs = db.activityLogs || [];
    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'Hero Video Banner Updated',
      details: { title: banner.title, videoUrl: banner.videoUrl },
      timestamp: new Date().toISOString(),
      user: 'Super Admin'
    });
    db.activityLogs = db.activityLogs.slice(0, 100);

    writeDatabase(db);
    res.json({ success: true, videoBanner: db.videoBanner });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save video banner' });
  }
});

/**
 * Save website settings permanently
 */
app.put('/api/store/settings', (req, res) => {
  try {
    const settings = req.body;
    const db = readDatabase();
    db.settings = { ...settings, updatedAt: new Date().toISOString() };

    db.activityLogs = db.activityLogs || [];
    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'Website Settings & Contacts Updated',
      details: { siteName: settings.siteName, whatsapp: settings.whatsappNumber },
      timestamp: new Date().toISOString(),
      user: 'Super Admin'
    });
    db.activityLogs = db.activityLogs.slice(0, 100);

    writeDatabase(db);
    res.json({ success: true, settings: db.settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

/**
 * Save categories permanently
 */
app.put('/api/store/categories', (req, res) => {
  try {
    const categories = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: 'Categories must be an array' });
    }

    const db = readDatabase();
    db.categories = categories;

    db.activityLogs = db.activityLogs || [];
    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'Categories Updated',
      details: { count: categories.length },
      timestamp: new Date().toISOString(),
      user: 'Super Admin'
    });
    db.activityLogs = db.activityLogs.slice(0, 100);

    writeDatabase(db);
    res.json({ success: true, categories: db.categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save categories' });
  }
});

/**
 * Restore full database snapshot
 */
app.post('/api/store/restore', (req, res) => {
  try {
    const snapshot = req.body;
    if (!snapshot) return res.status(400).json({ error: 'Invalid snapshot' });

    const db = readDatabase();
    if (snapshot.products) db.products = snapshot.products;
    if (snapshot.categories) db.categories = snapshot.categories;
    if (snapshot.videoBanner) db.videoBanner = snapshot.videoBanner;
    if (snapshot.settings) db.settings = snapshot.settings;

    writeDatabase(db);
    res.json({ success: true, message: 'Database restored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore database' });
  }
});

// --- CLOUDINARY UPLOAD & MEDIA SERVICES ---

/**
 * Generate signed upload signature for direct secure client uploads
 */
app.post('/api/cloudinary/sign', (req, res) => {
  try {
    const { folder, timestamp = Math.round(new Date().getTime() / 1000) } = req.body;
    const paramsToSign = {
      folder: folder || 'shree-shyam/general',
      timestamp: timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    res.json({
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder: paramsToSign.folder
    });
  } catch (error) {
    console.error('Signature generation error:', error);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
});

/**
 * Server-Side Media Upload (Multipart Form Data)
 * Safely streams video and image buffers directly to Cloudinary
 */
app.post('/api/cloudinary/upload', upload.single('file'), async (req, res) => {
  try {
    const folder = req.body.folder || 'shree-shyam/general';
    const resourceType = req.body.resource_type || 'auto'; // 'image' | 'video' | 'auto'

    let fileBuffer;

    if (req.file) {
      fileBuffer = req.file.buffer;
    } else if (req.body.fileBase64) {
      // Base64 upload fallback
      const uploadResult = await cloudinary.uploader.upload(req.body.fileBase64, {
        folder: folder,
        resource_type: resourceType,
        transformation: resourceType === 'image' ? [
          { quality: 'auto', fetch_format: 'auto' }
        ] : undefined
      });
      return res.json({
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        resource_type: uploadResult.resource_type,
        width: uploadResult.width,
        height: uploadResult.height,
        duration: uploadResult.duration
      });
    } else {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Stream upload directly to Cloudinary using file buffer
    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: resourceType,
            // Optimizations for images
            ...(resourceType === 'image' ? { quality: 'auto', fetch_format: 'auto' } : {})
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const uploadResult = await uploadFromBuffer(fileBuffer);

    res.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      resource_type: uploadResult.resource_type,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      error: 'Cloudinary upload failed',
      details: error.message
    });
  }
});

/**
 * Delete Media Asset from Cloudinary
 */
app.delete('/api/cloudinary/delete', async (req, res) => {
  try {
    const { public_id, resource_type = 'image' } = req.body;
    if (!public_id) {
      return res.status(400).json({ error: 'Missing public_id' });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type
    });

    res.json({ success: true, result });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete media asset' });
  }
});

/**
 * Fetch Media Assets for Media Library (Prefix search in 'shree-shyam')
 */
app.get('/api/cloudinary/resources', async (req, res) => {
  try {
    const folder = req.query.folder || 'shree-shyam';
    const resourceType = req.query.resource_type || 'image'; // image or video

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 100,
      resource_type: resourceType
    });

    res.json({
      success: true,
      resources: result.resources.map(item => ({
        public_id: item.public_id,
        url: item.secure_url,
        format: item.format,
        bytes: item.bytes,
        created_at: item.created_at,
        resource_type: item.resource_type,
        width: item.width,
        height: item.height
      }))
    });
  } catch (error) {
    console.error('List resources error:', error);
    // Return empty list gracefully if folder empty or error
    res.json({ success: true, resources: [] });
  }
});

// Admin brute-force tracker & login verification in-memory
const loginAttempts = new Map();

app.post('/api/auth/verify-admin', (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || '127.0.0.1';
  const now = Date.now();

  const attemptData = loginAttempts.get(ip) || { count: 0, lockUntil: 0 };

  if (attemptData.lockUntil > now) {
    const remainingSeconds = Math.ceil((attemptData.lockUntil - now) / 1000);
    return res.status(429).json({
      error: `Too many failed attempts. Access locked for ${remainingSeconds} seconds.`,
      lockRemaining: remainingSeconds
    });
  }

  // Admin credentials verification
  const ADMIN_EMAIL = 'shreeshyampure.organic1@gmail.com';
  const ADMIN_PASS = 'ORGANIC1';

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    loginAttempts.delete(ip);
    const token = Buffer.from(`${email}:${Date.now()}:shree_shyam_secure_admin`).toString('base64');
    return res.json({
      success: true,
      role: 'Super Admin',
      token,
      user: {
        email: ADMIN_EMAIL,
        name: 'Super Admin',
        role: 'Super Admin'
      }
    });
  } else {
    attemptData.count += 1;
    if (attemptData.count >= 5) {
      attemptData.lockUntil = now + 15 * 60 * 1000; // 15 min lock
      loginAttempts.set(ip, attemptData);
      return res.status(429).json({
        error: 'Too many failed login attempts. Account locked for 15 minutes for security.',
        lockRemaining: 900
      });
    } else {
      loginAttempts.set(ip, attemptData);
      return res.status(401).json({
        error: `Invalid credentials. Attempts left: ${5 - attemptData.count}`,
        attemptsRemaining: 5 - attemptData.count
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🌿 Shree Shyam Pure Organic API Server running on port ${PORT}`);
  console.log(`☁️ Cloudinary configured with cloud: ${cloudName}`);
  console.log(`💾 Permanent Database synced on disk at: ${DB_FILE}`);
});
