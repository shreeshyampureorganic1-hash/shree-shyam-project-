/**
 * Security Device Detection utility
 * Enforces Desktop-Only Admin Access (Windows PC, Mac, Linux Desktop)
 * Restricts Android, iPhone, iPad, Tablets, and narrow mobile viewports
 */
export function isDesktopDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return true;

  const ua = navigator.userAgent || navigator.vendor || window.opera;
  
  // Mobile / Tablet regex indicators
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
  
  // Check for iPadOS safari desktop mode indicator
  const isIPad = /Macintosh/i.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2;

  // Viewport width check (Desktop typically >= 1024px)
  const isNarrowScreen = window.innerWidth < 1024;

  if (isMobileUA || isIPad || isNarrowScreen) {
    return {
      allowed: false,
      reason: 'Mobile or Tablet device detected. Admin Dashboard is strictly restricted to Desktop and Laptop workstations.',
      deviceType: isIPad ? 'iPad / Tablet' : /iPhone|Android/i.test(ua) ? 'Smartphone' : 'Small Screen Device'
    };
  }

  return {
    allowed: true,
    deviceType: 'Desktop / Laptop Workstation'
  };
}
