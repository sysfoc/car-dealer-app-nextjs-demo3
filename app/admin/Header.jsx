"use client";
import React, { useState, useEffect } from "react";
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

const Header = ({ isDarkMode }) => {
  const { user } = useAuth();
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/settings/general");
        const data = await response.json();
        if (data.settings?.logo) {
          setLogo(data.settings.logo);
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

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
                  src={logo}
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
