
"use client";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const router = useRouter();
  const [heading, setHeading] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [headingLoaded, setHeadingLoaded] = useState(false);

  const carImages = [
    "/abc1.webp",
    "/abc4.webp",
    "/abc5.webp"
  ];

  // Simple heading fetch
  useEffect(() => {
    fetch("/api/homepage")
      .then(res => res.json())
      .then(data => {
        setHeading(data?.searchSection?.mainHeading || "Website for Automotive Dealers Built to Sell Cars");
        setHeadingLoaded(true);
      })
      .catch(() => {
        setHeading("Website for Automotive Dealers Built to Sell Cars");
        setHeadingLoaded(true);
      });
  }, []);

  // Simple auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const formatHeading = (text) => {
    const words = text.split(" ");
    const firstTwo = words.slice(0, 2).join(" ");
    const highlighted = words.slice(2, 4).join(" ");
    const remaining = words.slice(4).join(" ");
    
    return { firstTwo, highlighted, remaining };
  };

  const { firstTwo, highlighted, remaining } = formatHeading(heading);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Single visible image */}
      <div className="absolute inset-0">
        <Image
          src={carImages[currentSlide]}
          alt="Car showcase"
          fill
          className="object-cover"
          priority
          quality={85}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      </div>

      {/* Navigation */}
      <button
        onClick={() => setCurrentSlide(prev => (prev - 1 + carImages.length) % carImages.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentSlide(prev => (prev + 1) % carImages.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white mb-8">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>Revolutionary Automotive Solutions</span>
          </div>

          {/* Heading with skeleton */}
          {!headingLoaded ? (
            <div className="space-y-4 mb-8">
              <div className="h-12 bg-white/20 rounded-lg animate-pulse mx-auto w-3/4" />
              <div className="h-12 bg-white/10 rounded-lg animate-pulse mx-auto w-5/6" />
            </div>
          ) : (
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              {firstTwo}{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                {highlighted}
              </span>
              {remaining && ` ${remaining}`}
            </h1>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/car-for-sale")}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-colors flex items-center justify-center gap-3"
            >
              Explore Our Vehicles
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => router.push("/liked-cars")}
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-3 border border-white/20"
            >
              Your Favorite Cars
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Simple dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {carImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;