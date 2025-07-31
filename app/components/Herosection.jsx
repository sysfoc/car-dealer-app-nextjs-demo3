"use client";
import Image from "next/image";
import { FaArrowRight, FaPlay, FaCheck } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Precomputed blur placeholder (small base64 version of your image)
const BLUR_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YyZjJmMiIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiPkxvYWRpbmc8L3RleHQ+PC9zdmc+";

const HeroSection = () => {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const [headingData, setHeadingData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (response.ok) {
          setHeadingData(result.searchSection?.mainHeading);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Simple function: first two normal, next two gradient, rest normal
  const splitHeadingAfterTwoWords = (text) => {
    if (!text) return null;
    
    const words = text.split(' ');
    if (words.length <= 2) {
      return [{ text, style: 'normal' }];
    }
    
    const firstTwoWords = words.slice(0, 2).join(' ');
    const nextTwoWords = words.slice(2, 4).join(' ');
    const remainingWords = words.slice(4).join(' ');
    
    const parts = [
      { text: firstTwoWords + ' ', style: 'normal' },
      { text: nextTwoWords, style: 'gradient' }
    ];
    
    if (remainingWords) {
      parts.push({ text: ' ' + remainingWords, style: 'normal' });
    }
    
    return parts;
  };

  // Render styled text parts
  const renderStyledParts = (parts) => {
    return parts.map((part, index) => {
      switch (part.style) {
        case 'gradient':
          return (
            <span key={index} className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {part.text}
            </span>
          );

        default:
          return <span key={index}>{part.text}</span>;
      }
    });
  };

  // Get responsive text size based on content length
  const getResponsiveTextSize = (text) => {
    if (!text) return "text-4xl sm:text-5xl lg:text-6xl";
    
    const length = text.length;
    if (length < 40) return "text-5xl sm:text-6xl lg:text-7xl";
    if (length < 80) return "text-4xl sm:text-5xl lg:text-6xl";
    return "text-3xl sm:text-4xl lg:text-5xl";
  };

  // Process the heading data
  const processHeading = () => {
    if (!headingData) return null;

    const parts = splitHeadingAfterTwoWords(
      typeof headingData === 'string' ? headingData : String(headingData)
    );
    
    const textSizeClass = getResponsiveTextSize(
      typeof headingData === 'string' ? headingData : String(headingData)
    );

    return (
      <h1 className={`font-bold leading-tight text-gray-900 dark:text-white ${textSizeClass}`}>
        {renderStyledParts(parts)}
      </h1>
    );
  };

  // Loading skeleton for heading
  const HeadingSkeleton = () => (
    <div className="space-y-3">
      <div className="h-12 sm:h-16 lg:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      <div className="h-12 sm:h-16 lg:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-3/4"></div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-1/3 w-1/3 rounded-full bg-gradient-to-bl from-blue-100/50 to-transparent blur-3xl dark:from-blue-900/20"></div>
        <div className="absolute bottom-0 left-0 h-1/4 w-1/4 rounded-full bg-gradient-to-tr from-purple-100/50 to-transparent blur-3xl dark:from-purple-900/20"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-0 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-6rem)] grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="space-y-8 lg:pr-8">
            <div className="inline-flex items-center space-x-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 shadow-sm dark:bg-blue-900/30 dark:text-blue-200">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
              <span>Revolutionary Automotive Solutions</span>
            </div>

            <div className="space-y-6">
              {loading ? (
                <HeadingSkeleton />
              ) : (
                processHeading() || (
                  <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                    Website for{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                      Automotive Dealers
                    </span>{" "}
                    Built to{" "}
                    <span className="relative">
                      <span className="relative">Sell Cars</span>
                      <div className="absolute -bottom-2 left-0 right-0 h-3 -skew-x-12 transform bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-400/30 dark:to-yellow-500/30"></div>
                    </span>
                  </h1>
                )
              )}
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <button
                onClick={() => router.push("/car-for-sale")}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-6 py-3 text-base text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 sm:px-8 sm:py-4"
              >
                <span className="relative mr-3">Explore Our Vehicles</span>
                <FaArrowRight className="relative h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </button>
              
              <button
                onClick={() => router.push("/liked-cars")}
                className="sm:hidden group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
              >
                <span className="relative mr-5">Your Favorite Cars</span>
                <FaArrowRight className="relative h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          <div className="relative flex items-start lg:pl-8">
            <div className="relative w-full">
              <Image
                src="/sysfoc1.webp"
                alt="Automotive Web Solutions - Professional Dealer Websites"
                width={800}
                height={600}
                priority
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
              />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;