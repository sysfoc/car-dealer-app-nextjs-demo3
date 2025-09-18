"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {useEffect, useState, useMemo, useCallback } from "react";
import { FaHeart } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useCurrency } from "../context/CurrencyContext";
import { useDistance } from "../context/DistanceContext";
import { FaRegHeart } from "react-icons/fa6";
import { ArrowUpRight, Gauge, Fuel, Settings, ChevronDown, ChevronUp } from "lucide-react";

// Optimized skeleton with fixed dimensions to prevent CLS
const SimpleSkeleton = ({ className = "", height = "h-4", width = "w-full" }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${height} ${width} ${className}`}></div>
);

// Memoized vehicle card to prevent unnecessary re-renders
const VehicleCard = React.memo(({
  vehicle,
  userLikedCars,
  handleLikeToggle,
  convertedValues,
  selectedCurrency,
  currency,
  isLCP = false
}) => {
  const handleCardClick = useCallback(() => {
    window.location.href = `/car-detail/${vehicle.slug || vehicle._id}`;
  }, [vehicle.slug, vehicle._id]);

  const isLiked = userLikedCars && Array.isArray(userLikedCars) && userLikedCars.includes(vehicle._id);

  return (
    <div
      className="w-full transform cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800 dark:shadow-slate-900/20"
      onClick={handleCardClick}
    >
      {/* Image Section - Fixed aspect ratio to prevent CLS */}
      <div className="relative">
        <div className="relative aspect-[4/2.8] overflow-hidden">
          <Image
            src={(vehicle.imageUrls && vehicle.imageUrls[0]) || "/placeholder.svg"}
            fill
            alt={`${vehicle.make} ${vehicle.model}`}
            className="object-cover transition-all duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={isLCP}
            loading={isLCP ? "eager" : "lazy"}
            fetchPriority={isLCP ? "high" : "auto"}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>

        {/* Tag Badge - Top Right Corner with fixed positioning */}
        <div className="absolute right-3 top-3 z-20 min-h-[2rem]">
          {!vehicle.sold && vehicle.tag && vehicle.tag !== "default" && (
            <span className="rounded-full bg-app-button px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              {vehicle.tag.toUpperCase()}
            </span>
          )}
        </div>

        {/* Status ribbon with fixed positioning */}
        <div className="absolute left-5 top-20 z-10">
          <div
            className={`origin-bottom-left -translate-x-6 -translate-y-5 -rotate-45 transform shadow-lg ${
              vehicle.sold ? "bg-red-700" : "bg-green-700"
            }`}
          >
            <div className="w-32 px-0 py-2 text-center text-xs font-bold text-white">
              {vehicle.sold ? "SOLD" : "AVAILABLE"}
            </div>
          </div>
        </div>

        {/* Like button with fixed positioning */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLikeToggle(vehicle._id);
          }}
          aria-label={isLiked ? "Remove from liked cars" : "Add to liked cars"}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl dark:bg-slate-800/95"
        >
          {isLiked ? (
            <FaHeart className="h-3.5 w-3.5 text-red-500" />
          ) : (
            <FaRegHeart className="h-3.5 w-3.5 text-gray-600 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Content section with fixed heights to prevent CLS */}
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between min-h-[3rem]">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold leading-tight text-gray-800 dark:text-white line-clamp-1">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <div className="ml-4 text-right">
            <div className="text-xl font-bold text-app-text dark:text-app-button-hover">
              {selectedCurrency && selectedCurrency.symbol}{" "}
              {Math.round(
                (vehicle &&
                  vehicle.price *
                    ((selectedCurrency && selectedCurrency.value) || 1)) /
                  ((currency && currency.value) || 1),
              ).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Fixed height specs grid to prevent CLS */}
        <div className="grid grid-cols-3 gap-3 text-center min-h-[6rem]">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
              <Gauge className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-white">
              {convertedValues.kms}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {convertedValues.unit && convertedValues.unit.toUpperCase()}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
              <Fuel className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-1 sm:line-clamp-2">
              {vehicle && vehicle.fuelType}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Fuel</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-white">
              {vehicle && vehicle.gearbox}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Trans
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

VehicleCard.displayName = 'VehicleCard';

const VehicalsList = ({ loadingState }) => {
  const t = useTranslations("HomePage");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency, selectedCurrency } = useCurrency();
  const { distance: defaultUnit, loading: distanceLoading } = useDistance();
  const [userLikedCars, setUserLikedCars] = useState([]);
  const [user, setUser] = useState(null);
  const [visibleVehiclesCount, setVisibleVehiclesCount] = useState(6);
  const [listingData, setListingData] = useState({
    heading: "Featured Vehicles",
    status: "active"
  });

  // Enhanced cache with better key management
  const [apiCache, setApiCache] = useState(new Map());

  // Memoized conversion functions
  const convertKmToMiles = useCallback((km) => {
    const numericKm = Number.parseFloat(km);
    return isNaN(numericKm) ? km : (numericKm * 0.621371).toFixed(1);
  }, []);
  
  const convertMilesToKm = useCallback((miles) => {
    const numericMiles = Number.parseFloat(miles);
    return isNaN(numericMiles) ? miles : (numericMiles * 1.60934).toFixed(1);
  }, []);

  // Optimized conversion with memoization
  const getConvertedValues = useCallback((vehicle) => {
    if (distanceLoading || !defaultUnit || !vehicle.unit) {
      return {
        kms: vehicle.kms,
        mileage: vehicle.mileage,
        unit: vehicle.unit || defaultUnit,
      };
    }

    if (vehicle.unit === defaultUnit) {
      return {
        kms: vehicle.kms,
        mileage: vehicle.mileage,
        unit: vehicle.unit,
      };
    }

    let convertedKms = vehicle.kms;
    let convertedMileage = vehicle.mileage;
    if (vehicle.unit === "km" && defaultUnit === "miles") {
      convertedKms = convertKmToMiles(vehicle.kms);
      convertedMileage = convertKmToMiles(vehicle.mileage);
    } else if (vehicle.unit === "miles" && defaultUnit === "km") {
      convertedKms = convertMilesToKm(vehicle.kms);
      convertedMileage = convertMilesToKm(vehicle.mileage);
    }
    
    return {
      kms: convertedKms,
      mileage: convertedMileage,
      unit: defaultUnit,
    };
  }, [defaultUnit, distanceLoading, convertKmToMiles, convertMilesToKm]);

  // Optimized API fetch with better error handling and abort controllers
  const fetchWithCache = useCallback(async (url, cacheKey, cacheTime = 180000) => {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: Math.floor(cacheTime / 1000) }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setApiCache(prev => new Map(prev).set(cacheKey, {
        data,
        timestamp: Date.now()
      }));
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }, [apiCache]);

  const fetchListingData = useCallback(async () => {
    try {
      const result = await fetchWithCache("/api/homepage", 'homepage-listing', 300000);
      setListingData(result?.listingSection || listingData);
    } catch (error) {
      console.error("Error fetching listing data:", error);
      // Keep fallback data
    }
  }, [fetchWithCache, listingData]);

  const fetchVehicles = useCallback(async () => {
    try {
      const data = await fetchWithCache("/api/cars", 'vehicles-list', 180000);
      const filteredCars = data.cars.filter(
        (car) => car.status === 1 || car.status === "1",
      );
      setVehicles(filteredCars);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [fetchWithCache]);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/users/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setUserLikedCars(
          Array.isArray(data.user?.likedCars) ? data.user.likedCars : [],
        );
      }
    } catch (error) {
      // Silent fail for user data
      return;
    }
  }, []);

  const handleLikeToggle = useCallback(async (carId) => {
    try {
      const response = await fetch("/api/users/liked-cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carId }),
      });
      if (response.ok) {
        const data = await response.json();
        setUserLikedCars(Array.isArray(data.likedCars) ? data.likedCars : []);
        setUser((prev) => ({
          ...prev,
          likedCars: data.likedCars,
        }));
      }
    } catch (error) {
      console.error("Error updating liked cars:", error);
    }
  }, []);

  const handleToggleVisibility = useCallback(() => {
    if (visibleVehiclesCount >= vehicles.length) {
      setVisibleVehiclesCount(6);
    } else {
      setVisibleVehiclesCount((prevCount) =>
        Math.min(prevCount + 3, vehicles.length),
      );
    }
  }, [visibleVehiclesCount, vehicles.length]);

  // Optimized useEffect with proper cleanup
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (!mounted) return;
      
      // Load critical data first
      await fetchVehicles();
      
      if (!mounted) return;
      
      // Load non-critical data after a delay
      setTimeout(() => {
        if (mounted) {
          fetchListingData();
          fetchUserData();
        }
      }, 100);
    };

    loadData();
    
    return () => {
      mounted = false;
    };
  }, [fetchVehicles, fetchListingData, fetchUserData]);

  // Memoized visible vehicles to prevent recalculation
  const visibleVehicles = useMemo(() => 
    vehicles.slice(0, visibleVehiclesCount),
    [vehicles, visibleVehiclesCount]
  );

  // Early returns for error and inactive states
  if (error) {
    return (
      <div className="mx-4 my-10 sm:mx-8 md:my-20">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
          <div className="flex items-center space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
              <span className="text-sm text-white">!</span>
            </div>
            <span className="font-medium">Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (listingData && listingData.status === "inactive") {
    return null;
  }

  return (
    <section className="my-7 rounded-xl bg-slate-50 py-7 dark:bg-slate-900 sm:mx-8 md:my-10 md:py-10">
      {/* Header section with fixed min-height to prevent CLS */}
      <div className="mb-16 min-h-[200px] flex flex-col justify-center">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-app-button/30 px-4 py-2 text-sm font-medium text-app-button dark:bg-app-button/20 dark:text-app-button">
            <Gauge className="h-4 w-4" />
            <span>Premium Collection</span>
          </div>
          <h2 className="mb-6 bg-gradient-to-br from-app-text via-app-text/90 to-app-text/70 bg-clip-text text-4xl font-bold leading-tight text-transparent dark:from-white dark:via-slate-100 dark:to-slate-300 md:text-5xl lg:text-6xl">
            {listingData && listingData.heading}
          </h2>
          <Link href={"/car-for-sale"}>
            <div className="group inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-app-button to-app-button/90 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-app-button-hover hover:to-app-button-hover hover:shadow-2xl dark:from-app-button dark:to-app-button/90 dark:hover:from-app-button-hover dark:hover:to-app-button-hover">
              <span>{t("viewAll")}</span>
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* Grid with fixed aspect ratios to prevent CLS */}
      <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-8 md:grid-cols-3 lg:gap-8">
        {loading
          ? Array(6)
              .fill()
              .map((_, index) => (
                <div
                  className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
                  key={index}
                >
                  <div className="relative">
                    <SimpleSkeleton className="w-full" height="h-40" />
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between min-h-[3rem]">
                      <SimpleSkeleton height="h-6" width="w-3/5" />
                      <SimpleSkeleton height="h-7" width="w-1/4" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 min-h-[6rem]">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <SimpleSkeleton circle className="rounded-full mb-2" height="h-8" width="w-8" />
                          <SimpleSkeleton height="h-4" width="w-12" className="mb-1" />
                          <SimpleSkeleton height="h-3" width="w-8" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
          : visibleVehicles.map((vehicle, index) => {
              const convertedValues = getConvertedValues(vehicle);
              return (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  userLikedCars={userLikedCars}
                  handleLikeToggle={handleLikeToggle}
                  convertedValues={convertedValues}
                  selectedCurrency={selectedCurrency}
                  currency={currency}
                  isLCP={index === 0} // First image gets LCP optimization
                />
              );
            })}
      </div>

      {/* Show more/less button */}
      {!loading && vehicles.length > 6 && (
        <div className="mt-10 text-center">
          <button
            onClick={handleToggleVisibility}
            className="group inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-app-button to-app-button/90 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-app-button-hover hover:to-app-button-hover hover:shadow-2xl dark:from-app-button dark:to-app-button/90 dark:hover:from-app-button-hover dark:hover:to-app-button-hover"
          >
            <span>
              {visibleVehiclesCount >= vehicles.length
                ? "Show less"
                : "Show more"}
            </span>
            {visibleVehiclesCount >= vehicles.length ? (
              <ChevronUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
            ) : (
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
            )}
          </button>
        </div>
      )}

      {/* Empty state with fixed dimensions */}
      {vehicles.length === 0 && !loading && (
        <div className="py-20 text-center min-h-[400px] flex flex-col justify-center">
          <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-slate-50 shadow-inner dark:bg-slate-800">
            <svg
              className="h-16 w-16 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-app-text dark:text-white">
            No Vehicles Available
          </h3>
          <p className="mx-auto max-w-md text-lg text-app-text/60 dark:text-slate-400">
            Our premium collection is currently being updated. Please check back
            soon for the latest additions.
          </p>
        </div>
      )}
    </section>
  );
};

export default VehicalsList;