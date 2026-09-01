import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import Storefront from './pages/Storefront';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Check if current route is admin portal (supports path and hash routing)
  const isAdminRoute = 
    currentPath.startsWith('/secure-admin') || 
    currentPath.startsWith('/admin') || 
    currentPath.startsWith('/login') || 
    currentHash.includes('secure-admin') || 
    currentHash.includes('admin') ||
    currentHash.includes('login');

  return (
    <AuthProvider>
      <StoreProvider>
        {isAdminRoute ? <AdminDashboard /> : <Storefront />}
      </StoreProvider>
    </AuthProvider>
  );
}
