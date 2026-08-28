import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FirestoreService } from '../firebase/firestoreService';

const AuthContext = createContext();

const ADMIN_EMAIL = 'shreeshyampure.organic1@gmail.com';
const ADMIN_PASS = 'ORGANIC1';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes auto-logout

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('shree_admin_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loginAttempts, setLoginAttempts] = useState(() => {
    try {
      const stored = localStorage.getItem('shree_admin_attempts');
      return stored ? JSON.parse(stored) : { count: 0, lockUntil: 0 };
    } catch {
      return { count: 0, lockUntil: 0 };
    }
  });

  const [lockCountdown, setLockCountdown] = useState(0);

  // Check lockout on timer
  useEffect(() => {
    const checkLock = () => {
      const now = Date.now();
      if (loginAttempts.lockUntil > now) {
        setLockCountdown(Math.ceil((loginAttempts.lockUntil - now) / 1000));
      } else {
        setLockCountdown(0);
      }
    };
    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [loginAttempts]);

  // Session idle auto-timeout
  const logout = useCallback(() => {
    sessionStorage.removeItem('shree_admin_session');
    setAdminUser(null);
    FirestoreService.logActivity('Admin Logged Out');
  }, []);

  useEffect(() => {
    if (!adminUser) return;

    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        alert('Your admin session has expired due to 30 minutes of inactivity for security reasons.');
      }, IDLE_TIMEOUT_MS);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [adminUser, logout]);

  // Secure login handler
  const login = async (email, password) => {
    const now = Date.now();
    if (loginAttempts.lockUntil > now) {
      const remainingSecs = Math.ceil((loginAttempts.lockUntil - now) / 1000);
      throw new Error(`Security Lockout Active: Please wait ${remainingSecs} seconds before trying again.`);
    }

    // Authenticate credentials
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASS) {
      const userData = {
        email: ADMIN_EMAIL,
        name: 'Super Admin',
        role: 'Super Admin',
        token: `shree_sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        loginTime: new Date().toISOString()
      };

      // Reset attempts
      const cleanAttempts = { count: 0, lockUntil: 0 };
      localStorage.setItem('shree_admin_attempts', JSON.stringify(cleanAttempts));
      setLoginAttempts(cleanAttempts);

      sessionStorage.setItem('shree_admin_session', JSON.stringify(userData));
      setAdminUser(userData);

      await FirestoreService.logActivity('Admin Logged In Successfully', { email: ADMIN_EMAIL });
      return userData;
    } else {
      const newCount = loginAttempts.count + 1;
      let newLockUntil = 0;
      if (newCount >= MAX_ATTEMPTS) {
        newLockUntil = now + LOCKOUT_MS;
      }
      const updated = { count: newCount, lockUntil: newLockUntil };
      localStorage.setItem('shree_admin_attempts', JSON.stringify(updated));
      setLoginAttempts(updated);

      await FirestoreService.logActivity('Failed Admin Login Attempt', { attemptedEmail: email });

      if (newCount >= MAX_ATTEMPTS) {
        throw new Error('Maximum failed attempts reached. Admin portal locked for 15 minutes for enterprise security.');
      } else {
        throw new Error(`Invalid Admin Credentials. ${MAX_ATTEMPTS - newCount} attempts remaining before temporary lockout.`);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      adminUser,
      isAuthenticated: Boolean(adminUser && adminUser.role === 'Super Admin'),
      login,
      logout,
      lockCountdown,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - loginAttempts.count)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
