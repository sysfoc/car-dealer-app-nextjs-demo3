"use client";
import Image from "next/image";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

const CACHE_DURATION = 5 * 60 * 1000; // 1 hour
const HOMEPAGE_CACHE_KEY = "homepage_data";
const FALLBACK_HEADING = "Website for Automotive Dealers Built to Sell Cars";

const CacheManager = {
  get: (key) => {
    try {
      if (typeof window === "undefined") return null;

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
      console.warn("Cache retrieval failed:", error);
      return null;
    }
  },

  set: (key, data) => {
    try {
      if (typeof window === "undefined") return;

      const cacheData = {
        data,
        timestamp: Date.now(),
      };

      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Cache storage failed:", error);
    }
  },
};

const ImageCacheManager = {
  cache: new Map(),

  preloadImage: (src) => {
    return new Promise((resolve, reject) => {
      if (ImageCacheManager.cache.has(src)) {
        resolve(ImageCacheManager.cache.get(src));
        return;
      }

      const img = new Image();
      img.onload = () => {
        ImageCacheManager.cache.set(src, {
          src,
          loaded: true,
          timestamp: Date.now(),
        });
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  },

  preloadBatch: async (imageSources) => {
    try {
      const promises = imageSources.map((src) =>
        ImageCacheManager.preloadImage(src),
      );
      await Promise.allSettled(promises);
      console.log("Hero images cached successfully");
    } catch (error) {
      console.warn("Image preloading failed:", error);
    }
  },

  isImageCached: (src) => ImageCacheManager.cache.has(src),
};

const HeroSection = () => {
  const router = useRouter();
  const [headingData, setHeadingData] = useState(FALLBACK_HEADING);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const mountedRef = useRef(true);

  const carImages = useMemo(
    () => [
      { src: "/abc1.webp", alt: "Premium Luxury Vehicle", priority: true },
      { src: "/abc3.webp", alt: "Sports Car Collection", priority: false },
      { src: "/abc4.webp", alt: "Executive Sedan", priority: false },
      { src: "/abc5.webp", alt: "High-Performance Vehicle", priority: false },
    ],
    [],
  );

  // Simplified homepage data fetch
  const fetchHomepageData = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setIsLoading(true);

      // Check cache first
      const cachedData = CacheManager.get(HOMEPAGE_CACHE_KEY);
      if (cachedData?.searchSection?.mainHeading) {
        setHeadingData(cachedData.searchSection.mainHeading);
        setIsDataLoaded(true);
        setIsLoading(false);
        return;
      }

      // Simple fetch without axios overhead
      const response = await fetch("/api/homepage", {
        next: { revalidate: 600 },
      });

      if (!response.ok) {
        throw new Error("Homepage fetch failed");
      }

      const data = await response.json();

      if (!mountedRef.current) return;

      // Cache the entire response
      CacheManager.set(HOMEPAGE_CACHE_KEY, data);

      if (
        data?.searchSection?.mainHeading &&
        data.searchSection.mainHeading !== FALLBACK_HEADING
      ) {
        setHeadingData(data.searchSection.mainHeading);
      }

      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error fetching homepage data:", error);

      // Try stale cache as fallback
      const staleCache = localStorage.getItem(HOMEPAGE_CACHE_KEY);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data?.searchSection?.mainHeading) {
            setHeadingData(data.searchSection.mainHeading);
            setIsDataLoaded(true);
          }
        } catch (parseError) {
          console.warn("Failed to parse stale cache:", parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize component
  useEffect(() => {
    mountedRef.current = true;

    // Use requestIdleCallback for non-critical data
    const scheduleTask =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const taskId = scheduleTask(
      () => {
        fetchHomepageData();
      },
      { timeout: 3000 },
    );

    return () => {
      mountedRef.current = false;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(taskId);
      } else {
        clearTimeout(taskId);
      }
    };
  }, [fetchHomepageData]);

  useEffect(() => {
    const imageUrls = carImages.map((img) => img.src);
    ImageCacheManager.preloadBatch(imageUrls);
  }, [carImages]);

  // Optimized slider functionality
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carImages.length);
  }, [carImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + carImages.length) % carImages.length);
  }, [carImages.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Optimized text processing
  const processedHeading = useMemo(() => {
    if (!headingData || headingData === FALLBACK_HEADING) {
      return {
        firstTwo: "Website for",
        nextTwo: "Automotive Dealers",
        remaining: "Built to Sell Cars",
      };
    }

    const words = headingData.split(" ");
    if (words.length <= 2)
      return { firstTwo: headingData, nextTwo: "", remaining: "" };

    const firstTwo = words.slice(0, 2).join(" ");
    const nextTwo = words.slice(2, 4).join(" ");
    const remaining = words.slice(4).join(" ");

    return { firstTwo, nextTwo, remaining };
  }, [headingData]);

  // Navigation handlers
  const handleExploreVehicles = useCallback(() => {
    router.push("/car-for-sale");
  }, [router]);

  const handleLikedCars = useCallback(() => {
    router.push("/liked-cars");
  }, [router]);

  const handleImageError = useCallback((index) => {
    setImageErrors((prev) => new Set([...prev, index]));
  }, []);

  const handleImageLoad = useCallback(
    (index) => {
      const src = carImages[index].src;
      if (!ImageCacheManager.isImageCached(src)) {
        ImageCacheManager.preloadImage(src);
      }
      setImagesLoaded((prev) => new Set([...prev, index]));
    },
    [carImages],
  );

  return (
    <section className="relative h-screen w-full overflow-hidden" role="banner">
      <style jsx>{`
        .carousel-container {
          transform: translateX(-${currentSlide * 100}%);
        }
        .progress-bar {
          width: ${((currentSlide + 1) / carImages.length) * 100}%;
        }
      `}</style>

      {/* Full-screen image carousel */}
      <div className="absolute inset-0 h-full w-full">
        <div className="carousel-container flex h-full w-full transition-transform duration-1000 ease-in-out will-change-transform">
          {carImages.map((imageObj, index) => (
            <div
              key={imageObj.src}
              className="relative h-full w-full flex-shrink-0"
            >
              {/* Error placeholder */}
              {imageErrors.has(index) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-600 to-gray-800">
                  <div className="text-center text-white/70">
                    <div className="mb-2 text-2xl">🚗</div>
                    <p>Image unavailable</p>
                  </div>
                </div>
              )}

              {/* Optimized image */}
              <Image
                src={imageObj.src}
                alt={imageObj.alt}
                fill
                className={`
                  object-cover object-center transition-opacity duration-500 ease-out
                  ${imagesLoaded.has(index) ? "opacity-100" : "opacity-0"}
                `}
                priority={imageObj.priority}
                loading={imageObj.priority ? "eager" : "lazy"}
                sizes="100vw"
                quality={80}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 sm:left-8 sm:p-4"
        aria-label="Previous image"
      >
        <FaChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 sm:right-8 sm:p-4"
        aria-label="Next image"
      >
        <FaChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Centered Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mt-32 w-full max-w-6xl space-y-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md sm:px-6 sm:py-3 sm:text-base">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#DC3C22]" />
            <span>Revolutionary Automotive Solutions</span>
          </div>

          {/* Main Heading with loading state */}
          <div className="space-y-6">
            {!isDataLoaded ? (
              // Skeleton loader
              <div className="space-y-4">
                <div className="mx-auto h-16 w-3/4 animate-pulse rounded-lg bg-white/20"></div>
                <div className="mx-auto h-16 w-5/6 animate-pulse rounded-lg bg-white/10"></div>
              </div>
            ) : (
              <h1
                className={`
                text-center text-4xl font-bold leading-tight text-white drop-shadow-2xl 
                transition-opacity duration-300 sm:text-5xl lg:text-6xl xl:text-7xl
                ${isLoading ? "opacity-75" : "opacity-100"}
              `}
              >
                {processedHeading.firstTwo}{" "}
                <span className="bg-gradient-to-r from-[#DC3C22] via-red-600 to-orange-600 bg-clip-text text-transparent">
                  {processedHeading.nextTwo}
                </span>
                {processedHeading.remaining
                  ? ` ${processedHeading.remaining}`
                  : ""}
              </h1>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:justify-center">
            <button
              onClick={handleExploreVehicles}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-red-500/20 bg-gradient-to-r from-[#DC3C22] via-red-600 to-red-700 px-8 py-4 text-base font-semibold text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:from-[#c23319] hover:via-red-700 hover:to-red-800 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#DC3C22]/50 sm:px-10 sm:py-5 sm:text-lg"
              aria-label="Explore vehicle inventory"
            >
              <span className="relative mr-3">Explore Our Vehicles</span>
              <FaArrowRight className="relative h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleLikedCars}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 sm:px-10 sm:py-5 sm:text-lg"
              aria-label="View favorite cars"
            >
              <span className="relative mr-3">Your Favorite Cars</span>
              <FaArrowRight className="relative h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 space-x-3 md:flex">
        {carImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              h-3 w-3 rounded-full border border-white/30 backdrop-blur-sm 
              transition-all duration-500 hover:scale-110 sm:h-4 sm:w-4
              ${
                currentSlide === index
                  ? "scale-125 bg-white shadow-lg ring-2 ring-white/50"
                  : "bg-white/30 hover:bg-white/60"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 z-30 hidden h-1 w-full bg-white/20 md:block">
        <div className="progress-bar h-full bg-gradient-to-r from-[#DC3C22] via-red-500 to-orange-500 transition-all duration-1000 ease-in-out" />
      </div>
    </section>
  );
};

export default HeroSection;
