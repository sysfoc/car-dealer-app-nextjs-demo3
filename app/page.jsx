"use client"
import Herosection from "./components/Herosection"
import VehicalsList from "./components/VehicalsList"
import BrandsList from "./components/BrandsList"
import Services from "./components/Services"
import BrowseCars from "./components/BrowseCars"
import Blog from "./components/Blog"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import MainLayout from "./components/MainLayout.jsx"
import { iconComponentsMap, allSocialPlatforms } from "../app/lib/social-icons"

export default function Home() {
  const t = useTranslations("HomePage")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add("no-scrollbar")
    return () => {
      document.documentElement.classList.remove("no-scrollbar")
    }
  }, [])

  return (
    <div>
      <MainLayout>
        <Herosection />
      </MainLayout>
      <VehicalsList loadingState={loading} />
      <BrandsList />
      <BrowseCars />
      <Services />
      <Blog />
    </div>
  )
}
