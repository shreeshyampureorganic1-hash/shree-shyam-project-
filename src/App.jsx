import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import Storefront from './pages/Storefront';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Determine if on hidden secure admin route
  const isAdminRoute = currentPath.startsWith('/secure-admin') || window.location.hash.includes('secure-admin');

  return (
    <AuthProvider>
      <StoreProvider>
        {isAdminRoute ? <AdminDashboard /> : <Storefront />}
      </StoreProvider>
    </AuthProvider>
  );
}
