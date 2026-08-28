export const initialCategories = [
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
  },
];

export const initialProducts = [
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
];

export const initialVideoBanner = {
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
};

export const initialSettings = {
  siteName: 'Shree Shyam Pure Organic',
  tagline: 'Traditional Taste • Natural Wellness • Handmade Care',
  logoUrl: '/logo.jpg',
  email: 'shreeshyampure.organic1@gmail.com',
  phone: '+91 98765 43210',
  whatsappNumber: '+91 98765 43210',
  address: 'Mirthal, Near Pathankot, Punjab, India',
  mapsUrl: 'https://maps.app.goo.gl/REesz8dR2esjDu1X8',
  announcementText: '✨ 100% Pure Organic & Chemical Free • Dispatching from Mirthal, Punjab Across India ✨',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  footerDescription: 'Dedicated to resurrecting ancient Ayurvedic principles and traditional culinary wisdom. Pure, handmade, and free from all chemicals.',
  freeDeliveryThreshold: 999,
  currencySymbol: '₹'
};
