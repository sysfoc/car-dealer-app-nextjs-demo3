"use client";
import { useState, useEffect } from "react";
import { ArrowUpRight, Car, Handshake, Wrench, Calculator } from "lucide-react";

const Services = () => {
  const [chooseUsData, setChooseUsData] = useState(null);

  useEffect(() => {
    const fetchChooseUsData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (response.ok) {
          setChooseUsData(result?.chooseUs);
        }
      } catch (error) {
        console.error("Error fetching choose us data:", error);
      }
    };

    fetchChooseUsData();
  }, []);
  
  const services = [
    {
      icon: Car, // Lucide icon
      title: chooseUsData?.first?.heading,
      description: chooseUsData?.first?.description,
      buttonText: chooseUsData?.first?.buttonText,
      href: chooseUsData?.first?.link,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Handshake, // Lucide icon
      title: chooseUsData?.second?.heading,
      description: chooseUsData?.second?.description,
      buttonText: chooseUsData?.second?.buttonText,
      href: chooseUsData?.second?.link,
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Wrench, // Lucide icon
      title: chooseUsData?.third?.heading,
      description: chooseUsData?.third?.description,
      buttonText: chooseUsData?.third?.buttonText,
      href: chooseUsData?.third?.link,
      color: "bg-orange-600",
      hoverColor: "hover:bg-orange-700",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: Calculator, // Lucide icon
      title: chooseUsData?.fourth?.heading,
      description: chooseUsData?.fourth?.description,
      buttonText: chooseUsData?.fourth?.buttonText,
      href: chooseUsData?.fourth?.link,
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];


  return (
    <section className="mx-0 sm:mx-4 my-6 rounded-2xl border border-gray-200 bg-gray-100 py-12 shadow-lg dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-purple-100">
              {chooseUsData?.heading || "Our Services"}
            </span>
          </h2>
          <p className="mx-auto mb-5 max-w-2xl text-base text-gray-700 dark:text-gray-300">
            Whether you are buying or selling, we are here to make your
            automotive journey seamless and rewarding
          </p>
          <div className="mx-auto h-1.5 w-16 rounded-full bg-blue-600 dark:bg-blue-400"></div>
        </div>
        {/* Services Grid */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="group rounded-xl border border-gray-300 bg-white p-6 shadow-md transition-all duration-300 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600/60 dark:hover:shadow-blue-900/20"
            >
              {/* Icon */}
              <div
                className={`h-12 w-12 ${service.iconBg} mb-4 flex items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <service.icon className={`h-6 w-6 ${service.iconColor}`} />
              </div>
              {/* Content */}
              <div className="mb-5 space-y-3">
                <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-700 dark:text-gray-50 dark:group-hover:text-blue-400">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {service.description}
                </p>
              </div>
              {/* CTA Button */}
              <a href={service.href}>
                <button
                  className={`${service.color} ${service.hoverColor} flex items-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 group-hover:shadow-lg`}
                >
                  {service.buttonText}
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
