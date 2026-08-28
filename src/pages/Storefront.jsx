import React from 'react';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import MobileDrawer from '../components/layout/MobileDrawer';
import Footer from '../components/layout/Footer';
import WhatsAppFloat from '../components/layout/WhatsAppFloat';
import HeroVideoBanner from '../components/home/HeroVideoBanner';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import ProductDetailModal from '../components/product/ProductDetailModal';
import SearchModal from '../components/search/SearchModal';
import CartDrawer from '../components/cart/CartDrawer';
import Toast from '../components/common/Toast';

export default function Storefront() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 text-stone-800">
      {/* Top Banner */}
      <AnnouncementBar />

      {/* Main Navigation (NO Admin button anywhere!) */}
      <Navbar />
      <MobileDrawer />

      {/* Hero Video Banner (Dynamic from Admin) */}
      <HeroVideoBanner />

      {/* Categories & Products */}
      <CategorySection />
      <FeaturedProducts />

      {/* Story & Benefits */}
      <WhyChooseUs />

      {/* Verified Reviews */}
      <Testimonials />

      {/* Footer */}
      <Footer />

      {/* Floating Utilities & Modals */}
      <WhatsAppFloat />
      <ProductDetailModal />
      <SearchModal />
      <CartDrawer />
      <Toast />
    </div>
  );
}
