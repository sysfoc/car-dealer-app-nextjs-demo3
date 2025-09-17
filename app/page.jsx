"use client"
import Herosection from "./components/Herosection"
import VehicalsList from "./components/VehicalsList"
import BrowseCars from "./components/BrowseCars"
import Blog from "./components/Blog"
import { useState } from "react"
import MainLayout from "./components/MainLayout.jsx"

export default function Home() {
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <MainLayout>
        <Herosection />
      </MainLayout>
      <VehicalsList loadingState={loading} />
      <BrowseCars />
      <Blog />
    </div>
  )
}
