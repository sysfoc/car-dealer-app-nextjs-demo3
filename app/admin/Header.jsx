"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownHeader,
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/UserContext";

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

const Header = () => {
  const { user } = useAuth();
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchSettings = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setLoading(true);
      
      // Check cache first
      const cachedData = CacheManager.get(CACHE_KEY);
      if (cachedData) {
        setLogo(cachedData?.settings?.logo3 || "");
        setLoading(false);
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

      setLogo(data?.settings?.logo3 || "");
      
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      
      // Try to use stale cache as fallback
      const staleCache = localStorage.getItem(CACHE_KEY);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data?.settings) {
            setLogo(data.settings.logo3 || "");
          }
        } catch (parseError) {
          console.warn('Failed to parse stale cache data:', parseError);
        }
      }
    } finally {
      setLoading(false);
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

  return (
    <Navbar
      fluid
      rounded
      className="min-h-[80px] border-b border-gray-300 dark:border-gray-700 dark:shadow-xl"
    >
      <NavbarBrand href="/admin/dashboard">
        <div className="flex items-center gap-0">
          <div className="flex h-16 w-20 items-center justify-center overflow-hidden md:h-16 md:w-24">
            {loading ? (
              <div className="h-12 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 md:h-14 md:w-20" />
            ) : logo ? (
              <div className="relative h-16 w-16 md:h-20 md:w-20">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : null}
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="text-lg font-bold tracking-tight text-app-text dark:text-white">
              CruiseControl
            </span>
            <span className="text-xs font-medium text-app-text/60 dark:text-gray-400">
              Built to sell cars
            </span>
          </div>
        </div>
      </NavbarBrand>
      <div className="flex items-center gap-x-5 md:order-2">
        <div className="hidden md:block">
          <Button
            color="none"
            href="/"
            className="bg-app-text hover:bg-app-text/90 text-white border-app-text"
          >
            <FiLogOut fontSize={20} />
          </Button>
        </div>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img={user?.profilePicture} rounded />
          }
          className="[&_.dropdown-header]:bg-slate-50 [&_.dropdown-header_.text-sm]:text-app-text [&_.dropdown-item]:text-app-text [&_.dropdown-item:hover]:text-app-button [&_.dropdown-item:hover]:bg-slate-50"
        >
          <DropdownHeader className="bg-slate-50">
            <span className="block text-sm text-app-text">{user?.username}</span>
            <span className="block truncate text-sm font-semibold text-app-text/80">
              {user?.email}
            </span>
          </DropdownHeader>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Header;