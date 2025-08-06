"use client";
import Image from "next/image";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";

const HeroSection = () => {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const [headingData, setHeadingData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Optimized: Smaller, compressed images and use webp
  const carImages = useMemo(() => [
    "/abc1.webp",
    "/abc3.webp", 
    "/abc4.webp",
    "/abc5.webp",
  ], []);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("/api/homepage");
      const result = await response.json();
      if (response.ok && result?.searchSection?.mainHeading) {
        setHeadingData(result?.searchSection?.mainHeading);
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    }
  };
  
  fetchData(); 
}, []);

  // Slider functionality
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carImages.length);
  }, [carImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + carImages.length) % carImages.length);
  }, [carImages.length]);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Optimized: Simplified text processing
  const processedHeading = useMemo(() => {
    if (!headingData) return null;
    
    const words = headingData.split(" ");
    if (words.length <= 2) return headingData;

    const firstTwo = words.slice(0, 2).join(" ");
    const nextTwo = words.slice(2, 4).join(" ");
    const remaining = words.slice(4).join(" ");

    return { firstTwo, nextTwo, remaining };
  }, [headingData]);

  // Optimized: Preload critical images
  useEffect(() => {
    // Preload first two images
    const link1 = document.createElement('link');
    link1.rel = 'preload';
    link1.href = carImages[0];
    link1.as = 'image';
    document.head.appendChild(link1);

    if (carImages[1]) {
      const link2 = document.createElement('link');
      link2.rel = 'preload';
      link2.href = carImages[1];
      link2.as = 'image';
      document.head.appendChild(link2);
    }

    return () => {
      document.head.removeChild(link1);
      if (carImages[1]) document.head.removeChild(document.head.querySelector(`link[href="${carImages[1]}"]`));
    };
  }, [carImages]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Optimized: Full-screen image carousel */}
      <div className="absolute inset-0 h-full w-full">
        <div
          className="flex h-full w-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carImages.map((image, index) => (
            <div key={index} className="relative h-full w-full flex-shrink-0">
              <Image
                src={image}
                alt={`Premium Car ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0} // Only first image gets priority
                loading={index === 0 ? "eager" : "lazy"} // Lazy load non-critical images
                sizes="100vw"
                quality={75} // Reduced from 90 to 75
                 />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
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

      {/* Optimized: Centered Content Overlay - Simplified animations */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl space-y-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md sm:px-6 sm:py-3 sm:text-base">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#DC3C22]"></div>
            <span>Revolutionary Automotive Solutions</span>
          </div>

          {/* Optimized: Main Heading - No complex animations */}
          <div className="space-y-6">
            <h1 className="text-center text-4xl font-bold leading-tight text-white drop-shadow-2xl sm:text-5xl lg:text-6xl xl:text-7xl">
              {processedHeading ? (
                <>
                  {processedHeading.firstTwo}{" "}
                  <span className="bg-gradient-to-r from-[#DC3C22] via-red-600 to-orange-600 bg-clip-text text-transparent">
                    {processedHeading.nextTwo}
                  </span>
                  {processedHeading.remaining ? ` ${processedHeading.remaining}` : ""}
                </>
              ) : (
                <>
                  Website for{" "}
                  <span className="bg-gradient-to-r from-[#DC3C22] via-red-500 to-orange-500 bg-clip-text text-transparent">
                    Automotive Dealers
                  </span>{" "}
                  Built to Sell Cars
                </>
              )}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/car-for-sale")}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-red-500/20 bg-gradient-to-r from-[#DC3C22] via-red-600 to-red-700 px-8 py-4 text-base font-semibold text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:from-[#c23319] hover:via-red-700 hover:to-red-800 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#DC3C22]/50 sm:px-10 sm:py-5 sm:text-lg"
            >
              <span className="relative mr-3">Explore Our Vehicles</span>
              <FaArrowRight className="relative h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => router.push("/liked-cars")}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 sm:px-10 sm:py-5 sm:text-lg"
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
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full border border-white/30 backdrop-blur-sm transition-all duration-500 sm:h-4 sm:w-4 ${
              currentSlide === index
                ? "scale-125 bg-white shadow-lg"
                : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 z-30 hidden h-1 w-full bg-white/20 md:block">
        <div
          className="h-full bg-gradient-to-r from-[#DC3C22] via-red-500 to-orange-500 transition-all duration-1000 ease-in-out"
          style={{
            width: `${((currentSlide + 1) / carImages.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
