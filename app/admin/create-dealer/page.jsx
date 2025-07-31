"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaUserPlus, FaUserTag, FaMapMarkerAlt, FaPhone, FaFileAlt, FaBuilding, FaMap } from "react-icons/fa" // Using react-icons/fa for consistency

export default function CreateDealer() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    licence: "",
    abn: "",
    map: "", // Optional field
  })
  const [errors, setErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const [userRole, setUserRole] = useState("")

  // Fetch user role for access control
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/users/me")
        const data = await res.json()
        if (data.user.role !== "superadmin") {
          router.replace("/admin/dashboard")
        } else {
          setUserRole(data.user.role)
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error)
        router.replace("/login") // Example: redirect to login if role fetch fails
      }
    }
    fetchUserRole()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = "Dealer name is required"
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required"
    }
    if (!formData.licence.trim()) {
      newErrors.licence = "Licence number is required"
    }
    if (!formData.abn.trim()) {
      newErrors.abn = "ABN is required"
    }
    // Map is optional, no validation needed if empty

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm() || isSubmitting) return

    setIsSubmitting(true)
    setErrors({}) // Clear previous errors

    try {
      const response = await fetch("/api/dealor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        const serverErrors = {}
        const errorMessage = data.error ? data.error.toLowerCase() : "An unknown error occurred."

        if (errorMessage.includes("name")) serverErrors.name = data.error
        else if (errorMessage.includes("address")) serverErrors.address = data.error
        else if (errorMessage.includes("contact")) serverErrors.contact = data.error
        else if (errorMessage.includes("licence")) serverErrors.licence = data.error
        else if (errorMessage.includes("abn")) serverErrors.abn = data.error
        else if (errorMessage.includes("map")) serverErrors.map = data.error
        else serverErrors.general = data.error || "Failed to create dealer."

        setErrors(serverErrors)
        return
      }

      setIsSuccess(true)
      setFormData({ name: "", address: "", contact: "", licence: "", abn: "", map: "" })
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      setErrors({ general: "Failed to connect to server. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

    if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600 font-medium">Loading Dealer...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Dealer</h1>
            <p className="text-gray-600">Add new dealership to the system</p>
          </div>
          {errors.general && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {errors.general}</span>
            </div>
          )}
          {isSuccess && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> Dealer created successfully.</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="form-group md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserTag className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="Dealer Name"
                  />
                </div>
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>

              {/* Address Field */}
              <div className="form-group md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-md pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="123 Main St, City, Country"
                  />
                </div>
                {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
              </div>

              {/* Contact Field */}
              <div className="form-group">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    required
                    value={formData.contact}
                    onChange={handleChange}
                    className={`w-full border ${errors.contact ? "border-red-500" : "border-gray-300"} rounded-md pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="+1234567890"
                  />
                </div>
                {errors.contact && <div className="text-red-500 text-sm mt-1">{errors.contact}</div>}
              </div>

              {/* Licence Field */}
              <div className="form-group">
                <label htmlFor="licence" className="block text-sm font-medium text-gray-700 mb-1">
                  Licence
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFileAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="licence"
                    name="licence"
                    required
                    value={formData.licence}
                    onChange={handleChange}
                    className={`w-full border ${errors.licence ? "border-red-500" : "border-gray-300"} rounded-md pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="DL123456"
                  />
                </div>
                {errors.licence && <div className="text-red-500 text-sm mt-1">{errors.licence}</div>}
              </div>

              {/* ABN Field */}
              <div className="form-group">
                <label htmlFor="abn" className="block text-sm font-medium text-gray-700 mb-1">
                  ABN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="abn"
                    name="abn"
                    required
                    value={formData.abn}
                    onChange={handleChange}
                    className={`w-full border ${errors.abn ? "border-red-500" : "border-gray-300"} rounded-md pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="12 345 678 901"
                  />
                </div>
                {errors.abn && <div className="text-red-500 text-sm mt-1">{errors.abn}</div>}
              </div>

              {/* Map Field (Optional) */}
              <div className="form-group">
                <label htmlFor="map" className="block text-sm font-medium text-gray-700 mb-1">
                  Map URL (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMap className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="map"
                    name="map"
                    value={formData.map}
                    onChange={handleChange}
                    className={`w-full border ${errors.map ? "border-red-500" : "border-gray-300"} rounded-md pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                {errors.map && <div className="text-red-500 text-sm mt-1">{errors.map}</div>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition duration-200 flex items-center justify-center disabled:opacity-50"
              >
                <FaUserPlus className="mr-2" />
                {isSubmitting ? "Creating..." : "Create Dealer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
