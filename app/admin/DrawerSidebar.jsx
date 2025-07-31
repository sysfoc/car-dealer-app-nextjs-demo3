"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { FaPencilAlt } from "react-icons/fa";
import { TiWorld } from "react-icons/ti";
import { FaList } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { HiChartPie } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import { MdAppSettingsAlt } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaIdeal } from "react-icons/fa6";
import { IoIosContact } from "react-icons/io";
import { TbCalendarSearch } from "react-icons/tb";
import { MdOutlineSubtitles } from "react-icons/md";
import { BiMessageSquareEdit } from "react-icons/bi";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

const DrawerSidebar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
        } else {
          console.error("Failed to fetch user data");
          const token = Cookies.get("token");
          if (token) {
            const decoded = jwt.decode(token);
            setUserRole(decoded?.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        const token = Cookies.get("token");
        if (token) {
          const decoded = jwt.decode(token);
          setUserRole(decoded?.role);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <Button
        className="mx-3 mt-3"
        color={"dark"}
        size={"sm"}
        disabled
      >
        <RiMenu2Fill fontSize={20} />
      </Button>
    );
  }

  return (
    <div>
      <Button
        className="mx-3 mt-3"
        color={"dark"}
        size={"sm"}
        onClick={() => setIsDrawerOpen(true)}
      >
        <RiMenu2Fill fontSize={20} />
      </Button>

      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-start bg-black/50"
          onClick={handleCloseDrawer}
        >
          <div
            className="w-fit max-w-xs max-h-screen overflow-y-auto bg-white shadow-lg dark:bg-gray-800 scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute right-3 top-3"
              color={"none"}
              onClick={handleCloseDrawer}
            >
              <IoMdClose fontSize={20} />
            </Button>
            <Sidebar aria-label="Sidebar for the dashboard to control and manage the overall functionality">
              <SidebarItems>
                <SidebarItemGroup>
                  {/* Single Items */}
                  <SidebarItem href="/admin/dashboard" icon={HiChartPie}>
                    Dashboard
                  </SidebarItem>
                  <SidebarItem href="/admin/contact" icon={IoIosContact}>
                    Contact Submissions
                  </SidebarItem>
                  <SidebarItem href="/admin/valuation" icon={BiMessageSquareEdit}>
                    Value Submissions
                  </SidebarItem>
                  <SidebarItem href="/admin/enquiries" icon={TbCalendarSearch}>
                    Car Enquiry
                  </SidebarItem>
                  <SidebarItem href="/admin/meta-editor" icon={MdOutlineSubtitles}>
                    Meta Editor
                  </SidebarItem>
                  <SidebarItem href="/admin/blog" icon={FaPencilAlt}>
                    Manage Blogs
                  </SidebarItem>

                  {/* Collapsible Groups - Only show user management for superadmin */}
                  {userRole === "superadmin" && (
                    <>
                      <SidebarCollapse icon={FaUser} label="Manage Users">
                        <SidebarItem href="/admin/manage-users">
                          All users
                        </SidebarItem>
                        <SidebarItem href="/admin/createUser">
                          Create User
                        </SidebarItem>
                      </SidebarCollapse>
                      <SidebarCollapse icon={FaIdeal} label="Manage Dealers">
                        <SidebarItem href="/admin/view-dealer">
                          All Dealers
                        </SidebarItem>
                        <SidebarItem href="/admin/create-dealer">
                          Create Dealers
                        </SidebarItem>
                      </SidebarCollapse>
                    </>
                  )}

                  <SidebarCollapse icon={FaList} label="Manage Listings">
                    <SidebarItem href="/admin/listing/brand">
                      Listing Brands
                    </SidebarItem>
                    <SidebarItem href="/admin/listing/add">
                      Add Listings
                    </SidebarItem>
                    <SidebarItem href="/admin/listing/view">
                      Listings
                    </SidebarItem>
                    <SidebarItem href="/admin/listing/approved">
                      Pending Listings
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse icon={TiWorld} label="Manage Website">
                    <SidebarItem href="/admin/manage-website/faq">
                      FAQ
                    </SidebarItem>
                    <SidebarItem href="/admin/manage-website/testimonial">
                      Testimonial
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse icon={IoSettingsSharp} label="Settings">
                    <SidebarItem href="/admin/setting/general">
                      General Settings
                    </SidebarItem>
                    <SidebarItem href="/admin/setting/default">
                      Default Settings
                    </SidebarItem>
                    <SidebarItem href="/admin/setting/currency">
                      Currency
                    </SidebarItem>
                    <SidebarItem href="/admin/setting/social">
                      Social Media
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse icon={MdAppSettingsAlt} label="Page Settings">
                    <SidebarItem href="/admin/setting/page/home">
                      Home
                    </SidebarItem>
                    <SidebarItem href="/admin/setting/page/contact">
                      Contact
                    </SidebarItem>
                    <SidebarItem href="/admin/setting/page/about">
                      Utility pages
                    </SidebarItem>
                  </SidebarCollapse>
                </SidebarItemGroup>
              </SidebarItems>
            </Sidebar>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawerSidebar;