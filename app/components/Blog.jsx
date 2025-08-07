"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react'
import Image from "next/image"
import { useTranslations } from "next-intl"

const Blog = () => {
  const t = useTranslations("HomePage")
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAll, setShowAll] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const INITIAL_DISPLAY_COUNT = 3 // Show 6 blogs initially (2 rows of 3)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog")
        if (!response.ok) {
          throw new Error("Failed to fetch blogs")
        }
        const data = await response.json()
        setBlogs(data.blogs)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blogs")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const handleToggleView = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setShowAll(!showAll)
      setIsTransitioning(false)
    }, 150)
  }

  const displayedBlogs = showAll ? blogs : blogs.slice(0, INITIAL_DISPLAY_COUNT)
  const hasMoreBlogs = blogs.length > INITIAL_DISPLAY_COUNT

  if (error) {
    return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-850"></div>
        <div className="relative px-4 py-12 sm:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="backdrop-blur-md bg-red-50/70 dark:bg-red-950/20 border border-red-200/50 dark:border-red-500/20 rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-2 text-app-button">
                Error Loading Blogs
              </h3>
              <p className="text-app-text/80 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-850"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 dark:bg-gray-700/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-gray-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative px-4 py-12 sm:px-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-block">
                  <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 rounded-full px-6 py-2">
                    <span className="text-sm font-semibold tracking-wider uppercase text-app-button">
                      Latest Updates
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-app-text dark:text-gray-100 leading-tight">
                  {t("blogHeading")}
                </h2>
              </div>
              <Link href={"/blogs"} className="group">
                <div className="flex items-center gap-3 text-white font-semibold px-6 py-3 rounded-2xl bg-app-button hover:bg-app-button-hover transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <span>{t("viewAll")}</span>
                  <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            </div>
            <div className="w-24 h-1 rounded-full bg-app-button"></div>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-app-button/30 border-t-app-button rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-app-button/50 rounded-full animate-ping"></div>
              </div>
            </div>
          )}
          
          {/* Blog Grid */}
          {!loading && blogs.length > 0 && (
            <div className="space-y-8">
              <div 
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out ${
                  isTransitioning ? 'opacity-50 transform scale-98' : 'opacity-100 transform scale-100'
                }`}
              >
                // Replace this part in your Blog component:

{displayedBlogs.map((blog, index) => (
  <Link href={`/blog/${blog.slug}`} key={`${blog.slug}-${index}`}>
    <div
      className="group relative backdrop-blur-md bg-white/70 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/25 cursor-pointer"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="relative overflow-hidden">
          <div className="relative h-48 sm:h-52">
            <Image
              src={blog.image || "/sydney.jpg"}
              alt={blog.metaTitle || blog.h1 || "Blog post"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <h3 className="text-lg md:text-xl font-bold text-app-text hover:text-app-button dark:text-gray-100 dark:hover:text-app-button transition-colors duration-300 line-clamp-2 leading-tight">
            {blog.h1 || blog.metaTitle}
          </h3>
          
          {blog.metaDescription && (
            <p className="text-sm text-app-text/70 dark:text-gray-300/80 line-clamp-2 leading-relaxed">
              {blog.metaDescription}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-app-text/60 dark:text-gray-400">
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div className="w-6 h-0.5 rounded-full bg-app-button"></div>
              <span className="text-xs font-medium text-app-button">
                Read More
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
))}
              </div>
              
              {/* Show More/Less Button */}
              {hasMoreBlogs && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleToggleView}
                    disabled={isTransitioning}
                    className="group flex items-center gap-3 text-white font-semibold px-8 py-4 rounded-2xl bg-app-button hover:bg-app-button-hover transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span>
                      {showAll ? 'Show Less' : `Show More (${blogs.length - INITIAL_DISPLAY_COUNT} more)`}
                    </span>
                    {showAll ? (
                      <ChevronUp className="transition-transform duration-300 group-hover:-translate-y-1" />
                    ) : (
                      <ChevronDown className="transition-transform duration-300 group-hover:translate-y-1" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* No blogs state */}
          {!loading && blogs.length === 0 && (
            <div className="text-center py-16">
              <div className="backdrop-blur-md bg-white/70 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 rounded-3xl p-10 max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-app-button">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-app-text dark:text-gray-100 mb-4">
                  No Blogs Available
                </h3>
                <p className="text-app-text/80 dark:text-blue-100/80 text-lg">
                  We are working on bringing you fresh content. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute top-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 fill-gray-900 dark:fill-white transform rotate-180"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          ></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  )
}

export default Blog