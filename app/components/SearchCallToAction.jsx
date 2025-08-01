"use client";
import { useState, useEffect } from "react";
import { FaSearch, FaCar, FaFilter, FaArrowRight } from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";

const SearchCallToAction = () => {
  const [searchData, setSearchData] = useState(null);
  const { openSidebar } = useSidebar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (response.ok) {
          setSearchData(result?.searchSection);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearchClick = () => {
    openSidebar();
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-app-button/5 py-10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-app-button/10 via-transparent to-app-text/10"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-app-text dark:text-white sm:text-4xl lg:text-5xl">
              {searchData?.subheading || "Find Your Perfect Vehicle"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-app-text/70 dark:text-gray-300 sm:text-xl">
              {searchData?.descriptionText ||
                "Search through thousands of quality vehicles with our advanced filtering system. Find the car that matches your needs and budget."}
            </p>
          </div>
          {/* <div className="mb-10">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 justify-items-center mb-4 sm:mb-0 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-app-button/10 dark:bg-app-button/20">
                  <FaCar className="h-5 w-5 sm:h-6 sm:w-6 text-app-button dark:text-app-button" />
                </div>
                <p className="mt-2 text-xl sm:text-2xl font-bold text-app-text dark:text-white">
                  10,000+
                </p>
                <p className="text-xs sm:text-sm text-app-text/60 dark:text-gray-400">
                  Vehicles Available
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-app-button/10 dark:bg-app-button/20">
                  <FaFilter className="h-5 w-5 sm:h-6 sm:w-6 text-app-button dark:text-app-button" />
                </div>
                <p className="mt-2 text-xl sm:text-2xl font-bold text-app-text dark:text-white">
                  20+
                </p>
                <p className="text-xs sm:text-sm text-app-text/60 dark:text-gray-400">
                  Filter Options
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-center">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-app-button/10 dark:bg-app-button/20">
                  <FaArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-app-button dark:text-app-button" />
                </div>
                <p className="mt-2 text-xl sm:text-2xl font-bold text-app-text dark:text-white">
                  24/7
                </p>
                <p className="text-xs sm:text-sm text-app-text/60 dark:text-gray-400">
                  Instant Search
                </p>
              </div>
            </div>
            
            <div className="flex justify-center sm:hidden">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-app-button/10 dark:bg-app-button/20">
                  <FaArrowRight className="h-5 w-5 text-app-button dark:text-app-button" />
                </div>
                <p className="mt-2 text-xl font-bold text-app-text dark:text-white">
                  24/7
                </p>
                <p className="text-xs text-app-text/60 dark:text-gray-400">
                  Instant Search
                </p>
              </div>
            </div>
          </div> */}
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleSearchClick}
              className="hover:shadow-3xl group relative overflow-hidden rounded-xl bg-gradient-to-r from-app-button via-app-button/90 to-app-button px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-app-button-hover hover:via-app-button-hover hover:to-app-button-hover focus:outline-none focus:ring-4 focus:ring-app-button/30 dark:focus:ring-app-button/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-app-button-hover/90 via-app-button-hover/80 to-app-button-hover/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center space-x-3">
                <FaSearch className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Search Vehicles Now</span>
                <FaArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <div className="absolute inset-0 -bottom-1 -top-1 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:animate-pulse group-hover:opacity-100"></div>
            </button>
            <p className="text-sm text-app-text/50 dark:text-gray-400">
              Use our advanced filters to find exactly what you&apos;re looking
              for
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              "Filter by Make & Model",
              "Price Range Selection",
              "Color Preferences",
              "Condition Options",
              "Instant Results",
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-app-text shadow-sm ring-1 ring-gray-200 backdrop-blur-sm dark:bg-gray-800/80 dark:text-gray-300 dark:ring-gray-700"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchCallToAction;