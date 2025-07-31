"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { IoSpeedometer } from "react-icons/io5";
import { GiGasPump } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { BiTachometer } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslations } from "next-intl";
import { useCurrency } from "../context/CurrencyContext";
import { useDistance } from "../context/DistanceContext";
import { FaRegHeart } from "react-icons/fa6";
import { ChevronDown, ChevronUp } from "lucide-react";

const VehicalsList = ({ loadingState }) => {
  const t = useTranslations("HomePage");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency, selectedCurrency } = useCurrency();
  const { distance: defaultUnit, loading: distanceLoading } = useDistance();
  const [userLikedCars, setUserLikedCars] = useState([]);
  const [user, setUser] = useState(null);
  const [visibleVehiclesCount, setVisibleVehiclesCount] = useState(3); // State to manage visible vehicles
  const [listingData, setListingData] = useState(null);

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (response.ok) {
          setListingData(result?.listingSection);
        }
      } catch (error) {
        console.error("Error fetching listing data:", error);
      }
    };

    fetchListingData();
  }, []);

  // Conversion functions with decimal precision
  const convertKmToMiles = (km) => {
    const numericKm = Number.parseFloat(km);
    return isNaN(numericKm) ? km : (numericKm * 0.621371).toFixed(1);
  };
  const convertMilesToKm = (miles) => {
    const numericMiles = Number.parseFloat(miles);
    return isNaN(numericMiles) ? miles : (numericMiles * 1.60934).toFixed(1);
  };
  // Function to convert car values based on default unit
  const getConvertedValues = (vehicle) => {
    if (distanceLoading || !defaultUnit || !vehicle.unit) {
      return {
        kms: vehicle.kms,
        mileage: vehicle.mileage,
        unit: vehicle.unit || defaultUnit,
      };
    }
    // If car unit matches default unit, no conversion needed
    if (vehicle.unit === defaultUnit) {
      return {
        kms: vehicle.kms,
        mileage: vehicle.mileage,
        unit: vehicle.unit,
      };
    }
    // Convert based on units
    let convertedKms = vehicle.kms;
    let convertedMileage = vehicle.mileage;
    if (vehicle.unit === "km" && defaultUnit === "miles") {
      // Convert from km to miles
      convertedKms = convertKmToMiles(vehicle.kms);
      convertedMileage = convertKmToMiles(vehicle.mileage);
    } else if (vehicle.unit === "miles" && defaultUnit === "km") {
      // Convert from miles to km
      convertedKms = convertMilesToKm(vehicle.kms);
      convertedMileage = convertMilesToKm(vehicle.mileage);
    }
    return {
      kms: convertedKms,
      mileage: convertedMileage,
      unit: defaultUnit,
    };
  };
  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/cars");
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      const data = await response.json();
      const filteredCars = data.cars.filter(
        (car) => car.status === 1 || car.status === "1",
      );
      setVehicles(filteredCars);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  const fetchUserData = async () => {
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
      return;
    }
  };
  const handleLikeToggle = async (carId) => {
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
      } else {
        console.error("Failed to update liked cars");
      }
    } catch (error) {
      console.error("Error updating liked cars:", error);
    }
  };

  const handleToggleVisibility = () => {
    if (visibleVehiclesCount >= vehicles.length) {
      setVisibleVehiclesCount(3); // Show less
    } else {
      setVisibleVehiclesCount((prevCount) =>
        Math.min(prevCount + 3, vehicles.length),
      );
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchUserData();
  }, []);

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

  if (listingData && listingData?.status === 'inactive') {
  return null;
}

  return (
    <section className=" my-7 rounded-xl bg-slate-50 py-7 dark:bg-slate-900 sm:mx-8 md:my-10 md:py-10">
      <div className="mb-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <BiTachometer className="h-4 w-4" />
            <span>Premium Collection</span>
          </div>
          <h2 className="mb-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-4xl font-bold leading-tight text-transparent dark:from-white dark:via-slate-100 dark:to-slate-300 md:text-5xl lg:text-6xl">
            {listingData?.heading}
          </h2>
          <Link href={"/car-for-sale"}>
            <div className="group inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-slate-800 hover:to-slate-600 hover:shadow-2xl dark:from-slate-100 dark:to-slate-300 dark:text-slate-900 dark:hover:from-white dark:hover:to-slate-200">
              <span>{t("viewAll")}</span>
              <MdOutlineArrowOutward className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-8 md:grid-cols-3 lg:gap-8">
        {loading
          ? Array(3) // Show 3 skeleton cards initially
              .fill()
              .map((_, index) => (
                <div
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
                  key={index}
                >
                  <div className="relative">
                    <Skeleton className="h-64 w-full" />
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="space-y-3">
                      <Skeleton height={28} />
                      <Skeleton height={16} width="70%" />
                    </div>
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton circle width={32} height={32} />
                          <Skeleton height={16} width="60%" />
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
                      <Skeleton height={32} width="50%" />
                      <Skeleton height={40} className="mt-3" />
                    </div>
                  </div>
                </div>
              ))
          : vehicles.slice(0, visibleVehiclesCount).map((vehicle) => {
              const convertedValues = getConvertedValues(vehicle);
              return (
                <div
                  className="group transform overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                  key={vehicle._id}
                >
                  <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={vehicle.imageUrls?.[0]}
                        fill
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                      <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                        {vehicle.sold ? (
                          <div className="rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                              SOLD
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-full bg-emerald-900 px-3 py-1.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                              AVAILABLE
                            </div>
                          </div>
                        )}
                        {vehicle.tag && vehicle.tag !== "default" && (
                          <div className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                              {vehicle.tag.toUpperCase()}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="absolute right-4 top-4 flex translate-x-4 transform gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleLikeToggle(vehicle._id);
                          }}
                          aria-label={
                            userLikedCars?.includes(vehicle._id)
                              ? "Unlike Car"
                              : "Like Car"
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-xl"
                        >
                          {userLikedCars &&
                          Array.isArray(userLikedCars) &&
                          userLikedCars.includes(vehicle._id) ? (
                            <FaHeart className="h-4 w-4 text-red-500" />
                          ) : (
                            <FaRegHeart className="h-4 w-4 hover:text-red-500" />
                          )}
                        </button>
                      </div>
                      <div className="absolute bottom-4 right-4 rounded-2xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md dark:bg-slate-800/95">
                        <div className="text-right">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            From
                          </p>
                          <p className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-slate-300">
                            {selectedCurrency?.symbol}{" "}
                            {Math.round(
                              (vehicle?.price *
                                (selectedCurrency?.value || 1)) /
                                (currency?.value || 1),
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {vehicle?.description?.slice(0, 80)}...
                      </p>
                    </div>
                    <div className="mb-6 space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                          <IoSpeedometer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-400">
                          Mileage:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {convertedValues.kms}{" "}
                          {convertedValues.unit?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                          <GiGasPump className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-400">
                          Fuel Type:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {vehicle?.fuelType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30">
                          <TbManualGearbox className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-400">
                          Transmission:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {vehicle?.gearbox}
                        </span>
                      </div>
                    </div>
                    {/* CTA Button */}
                    <Link
                      href={`/car-detail/${vehicle.slug || vehicle._id}`}
                      className="group/cta block w-full"
                    >
                      <div className="transform rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-3.5 text-center font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-slate-800 hover:to-slate-600 hover:shadow-xl dark:from-slate-100 dark:to-slate-300 dark:text-slate-900 dark:hover:from-white dark:hover:to-slate-200">
                        <div className="flex items-center justify-center gap-2">
                          <span>View Details</span>
                          <MdOutlineArrowOutward className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-1 group-hover/cta:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
      </div>
      {!loading && vehicles.length > 3 && (
        <div className="mt-10 text-center">
          <button
            onClick={handleToggleVisibility}
            className="group inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-slate-800 hover:to-slate-600 hover:shadow-2xl dark:from-slate-100 dark:to-slate-300 dark:text-slate-900 dark:hover:from-white dark:hover:to-slate-200"
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
      {/* Empty State */}
      {vehicles.length === 0 && !loading && (
        <div className="py-20 text-center">
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
          <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
            No Vehicles Available
          </h3>
          <p className="mx-auto max-w-md text-lg text-slate-600 dark:text-slate-400">
            Our premium collection is currently being updated. Please check back
            soon for the latest additions.
          </p>
        </div>
      )}
    </section>
  );
};
export default VehicalsList;
