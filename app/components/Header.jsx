"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaSearch,
  FaTimes,
  FaCalculator,
  FaHandshake,
  FaCar,
  FaSun,
  FaMoon,
  FaTags,
} from "react-icons/fa";
import CarSearchSidebar from "../components/Car-search-sidebar";
import { useSidebar } from "../context/SidebarContext";
import Image from "next/image";

const CACHE_DURATION = 5 * 60 * 1000;
const CACHE_KEY = 'header_settings';

const CacheManager = {
  get: (key) => {
    try {
      if (typeof window === 'undefined') return null;
      
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Cache retrieval failed:', error);
      return null;
    }
  },

  set: (key, data) => {
    try {
      if (typeof window === 'undefined') return;
      
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  }
};

// Static fallback data to prevent loading states
const DEFAULT_SETTINGS = {
  hideDarkMode: false,
  hideFavourite: false,
  hideLogo: false,
};

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [logo, setLogo] = useState("");
  const [logoError, setLogoError] = useState(false);
  const [topSettings, setTopSettings] = useState(DEFAULT_SETTINGS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const mountedRef = useRef(true);

  const { toggleSidebar } = useSidebar();

  const quickLinks = useMemo(() => [
    { name: "Find Cars", href: "/car-for-sale", icon: FaCar },
    { name: "Car valuation", href: "/cars/valuation", icon: FaCalculator },
    { name: "Lease deals", href: "/cars/leasing", icon: FaTags },
    { name: "Vehicle Services", href: "/cars/about-us", icon: FaHandshake },
  ], []);

  const mobileMenuLinks = useMemo(() => [
    ...quickLinks,
  ], [quickLinks]);

  useEffect(() => {
    // Check localStorage first for faster initialization
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    
    // Apply immediately to prevent flash
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Simplified settings fetch
  const fetchSettings = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setIsLoading(true);
      
      // Check cache first
      const cachedData = CacheManager.get(CACHE_KEY);
      if (cachedData) {
        setLogo(cachedData?.settings?.logo3 || "");
        setTopSettings({
          ...DEFAULT_SETTINGS,
          ...cachedData?.settings?.top,
        });
        setIsSettingsLoaded(true);
        setIsLoading(false);
        return;
      }

      // Simple fetch without axios overhead
      const response = await fetch("/api/settings/general", {
        next: { revalidate: 600 },
      });

      if (!response.ok) {
        throw new Error('Settings fetch failed');
      }

      const data = await response.json();

      if (!mountedRef.current) return;

      // Cache the response
      CacheManager.set(CACHE_KEY, data);

      const updates = {
        logo: data?.settings?.logo3 || "",
        settings: {
          ...DEFAULT_SETTINGS,
          ...data?.settings?.top,
        }
      };

      setLogo(updates.logo);
      setTopSettings(updates.settings);
      setIsSettingsLoaded(true);
      
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      
      // Try to use stale cache as fallback
      const staleCache = localStorage.getItem(CACHE_KEY);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data?.settings) {
            setLogo(data.settings.logo3 || "");
            setTopSettings({
              ...DEFAULT_SETTINGS,
              ...data.settings.top,
            });
          }
        } catch (parseError) {
          console.warn('Failed to parse stale cache data:', parseError);
        }
      }
      
      setIsSettingsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    // Use requestIdleCallback for non-critical settings
    const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const taskId = scheduleTask(() => {
      fetchSettings();
    }, { timeout: 3000 });
    
    return () => {
      mountedRef.current = false;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(taskId);
      } else {
        clearTimeout(taskId);
      }
    };
  }, [fetchSettings]);

  // Optimized dark mode toggle with persistence
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Persist preference
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    // Apply immediately
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleSearchSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const navigateToLikedCars = useCallback(() => {
    router.push("/liked-cars");
  }, [router]);

  const handleLogoError = useCallback(() => {
    setLogoError(true);
    setLogo("");
  }, []);

  // Optimized skeleton without animations to prevent CLS
  const LogoSkeleton = useMemo(() => (
    <div className="flex items-center space-x-3" style={{ height: '48px', width: '200px' }}>
      <div className="h-12 w-12 rounded-lg bg-white/20"></div>
      <div className="flex flex-col space-y-1">
        <div className="h-4 w-20 rounded bg-white/20"></div>
        <div className="h-3 w-24 rounded bg-white/10"></div>
      </div>
    </div>
  ), []);

  // Simplified logo component with fixed dimensions
  const LogoComponent = useMemo(() => {
    if (topSettings.hideLogo) return null;

    if (!isSettingsLoaded) return LogoSkeleton;

    const logoContent = (
      <div className="flex ml-1 items-center space-x-3">
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-white">
            CruiseControl
          </span>
          <span className="text-xs font-medium text-white/70">
            Built to Sell Cars
          </span>
        </div>
      </div>
    );

    return (
      <Link href="/" className="flex items-center space-x-3">
        <div style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}>
          {logo && !logoError ? (
            <>
              <div style={{ width: '48px', height: '48px', position: 'relative' }} className="rounded-xl bg-white p-1 backdrop-blur-sm">
                <Image
                  src={logo}
                  alt="Logo"
                  fill
                  className="object-contain"
                  onError={handleLogoError}
                  priority
                  sizes="48px"
                />
              </div>
              {logoContent}
            </>
          ) : (
            logoContent
          )}
        </div>
      </Link>
    );
  }, [topSettings.hideLogo, isSettingsLoaded, logo, logoError, LogoSkeleton, handleLogoError]);

  // Simplified navigation items
  const DesktopNavigation = useMemo(() => (
    <div className="hidden items-center space-x-6 lg:flex">
      {quickLinks.map((link, index) => {
        const IconComponent = link.icon;
        return (
          <Link
            key={index}
            href={link.href}
            className="group flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10 hover:text-white"
          >
            <IconComponent className="h-4 w-4" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </div>
  ), [quickLinks]);

  // Simplified action buttons
  const ActionButtons = useMemo(() => (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleMobileMenuToggle}
        aria-label="Open Menu"
        className={`rounded-xl bg-white/10 p-3 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 lg:hidden ${isLoading ? 'opacity-75' : 'opacity-100'}`}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <button
        onClick={toggleSearchSidebar}
        aria-label="Open Search"
        className="hidden rounded-xl bg-white/10 p-3 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 lg:block"
      >
        <FaSearch className="h-5 w-5" />
      </button>

      {!topSettings.hideFavourite && (
        <button
          onClick={navigateToLikedCars}
          aria-label="Liked Cars"
          className={`hidden rounded-xl bg-white/10 p-3 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 md:flex ${isLoading ? 'opacity-75' : 'opacity-100'}`}
        >
          <FaHeart className="h-5 w-5" />
        </button>
      )}

      <div className="flex items-center space-x-3">
        {!topSettings.hideDarkMode && (
          <button
            onClick={toggleDarkMode}
            className={`rounded-xl bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20 ${isLoading ? 'opacity-75' : 'opacity-100'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FaSun className="h-5 w-5" />
            ) : (
              <FaMoon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  ), [handleMobileMenuToggle, toggleSearchSidebar, navigateToLikedCars, topSettings.hideFavourite, topSettings.hideDarkMode, toggleDarkMode, darkMode, isLoading]);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 bg-app-text shadow-sm backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
          <div className="flex h-16 items-center justify-between">
            {LogoComponent}
            {DesktopNavigation} 
            {ActionButtons}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={closeMobileMenu}
          style={{ transform: 'translate3d(0, 0, 0)' }}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed left-0 top-0 z-[60] h-full w-full max-w-xs transform overflow-y-auto bg-white shadow-2xl dark:bg-gray-900 scrollbar-hide lg:hidden`}
        style={{ 
          transform: isMobileMenuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(-100%, 0, 0)',
          transition: 'transform 0.2s ease-out',
          willChange: 'transform'
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h2>
            <button
              onClick={closeMobileMenu}
              aria-label="Close Menu"
              className="rounded-lg p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-800"
            >
              <FaTimes className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="flex-1 space-y-2 p-4">
            {mobileMenuLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <CarSearchSidebar />
    </>
  );
};

export default Header;