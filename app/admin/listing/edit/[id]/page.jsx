"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useCurrency } from "../../../../context/CurrencyContext";

const CarEditPage = ({ params }) => {
  const router = useRouter();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedImageUrls, setDeletedImageUrls] = useState([]);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    tag: "default",
    description: "",
    price: "",
    type: "",
    sold: false,
    kms: "",
    fuelType: "",
    fuelTankFillPrice: "",
    fuelCapacityPerTank: "",
    gearbox: "",
    condition: "",
    location: "",
    modelYear: "",
    mileage: "",
    registerationPlate: "",
    registerationExpire: "",
    unit: "km",
    bodyType: "",
    color: "",
    driveType: "",
    doors: "",
    seats: "",
    noOfGears: "",
    cylinder: "",
    batteryRange: "",
    chargingTime: "",
    engineSize: "",
    enginePower: "",
    fuelConsumption: "",
    co2Emission: "",
    features: [],
    vehicleFullName: "",
    sellerComments: "",
    images: [],
    imageUrls: [],
    video: "",
    isFinance: "",
    isLease: false,
    slug: "",
    year: "",
    engineCapacity: "",
    dealerId: "",
  });

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currency, selectedCurrency } = useCurrency();

  const featuresList = [
    { id: "bluetooth", label: "Bluetooth connectivity" },
    { id: "usb-ports", label: "USB ports" },
    { id: "carplay-androidauto", label: "Apple CarPlay and Android Auto" },
    { id: "wifi-hotspot", label: "Wi-Fi hotspot" },
    { id: "satellite-radio", label: "Satellite radio" },
    { id: "navigation-system", label: "Navigation system" },
    { id: "touchscreen-display", label: "Touchscreen infotainment display" },
    { id: "voice-recognition", label: "Voice recognition" },
    { id: "wireless-charging", label: "Wireless charging pad" },
    { id: "rear-seat-entertainment", label: "Rear-seat entertainment system" },
    { id: "air-conditioning", label: "Air conditioning" },
    { id: "climate-control", label: "Dual-zone or tri-zone climate control" },
    { id: "heated-seats", label: "Heated and ventilated seats" },
    { id: "power-adjustable-seats", label: "Power-adjustable seats" },
    { id: "leather-upholstery", label: "Leather upholstery" },
    { id: "keyless-entry", label: "Keyless entry and push-button start" },
    { id: "remote-start", label: "Remote start" },
    { id: "power-windows", label: "Power windows and mirrors" },
    { id: "sunroof", label: "Sunroof or moonroof" },
    { id: "ambient-lighting", label: "Ambient interior lighting" },
    { id: "valid-mot", label: "Valid MOT" },
    { id: "road-tax-paid", label: "Road Tax Paid" },
  ];

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const res = await fetch(`/api/cars/${id}`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();

          if (data.car.imageUrls && data.car.imageUrls.length > 0) {
            const previewsWithIds = data.car.imageUrls.map((url) => ({
              id: `existing-${url}`,
              url,
              isNew: false,
            }));
            setImagePreviews(previewsWithIds);
          }

          setFormData({
            ...data.car,
            images: data.car.imageUrls || [],
            slug: data.car.make
              ? data.car.make.toLowerCase().replace(/\s+/g, "-")
              : "",
            sold: data.car.sold || false,
            tag: data.car.tag || "default",
            // Ensure numeric fields are properly handled
            price: data.car.price || "",
            noOfGears: data.car.noOfGears || "",
            cylinder: data.car.cylinder || "",
            doors: data.car.doors || "",
            seats: data.car.seats || "",
            batteryRange: data.car.batteryRange || "",
            chargingTime: data.car.chargingTime || "",
            engineSize: data.car.engineSize || "",
            enginePower: data.car.enginePower || "",
            fuelConsumption: data.car.fuelConsumption || "",
            co2Emission: data.car.co2Emission || "",
            dealerId: data.car.dealerId || "",
            // Ensure boolean fields are properly handled
            isLease: data.car.isLease || false,
            // Ensure string fields are properly handled
            description: data.car.description || "",
            type: data.car.type || "",
            kms: data.car.kms || "",
            fuelType: data.car.fuelType || "",
            fuelTankFillPrice: data.car.fuelTankFillPrice || "",
            fuelCapacityPerTank: data.car.fuelCapacityPerTank || "",
            gearbox: data.car.gearbox || "",
            condition: data.car.condition || "",
            location: data.car.location || "",
            modelYear: data.car.modelYear || "",
            mileage: data.car.mileage || "",
            registerationPlate: data.car.registerationPlate || "",
            registerationExpire: data.car.registerationExpire || "",
            unit: data.car.unit || "km",
            bodyType: data.car.bodyType || "",
            color: data.car.color || "",
            driveType: data.car.driveType || "",
            isFinance: data.car.isFinance || "",
            vehicleFullName: data.car.vehicleFullName || "",
            sellerComments: data.car.sellerComments || "",
            video: data.car.video || "",
            year: data.car.year || "",
            engineCapacity: data.car.engineCapacity || "",
            // Handle features array
            features: Array.isArray(data.car.features) ? data.car.features : [],
          });

          // Set the selected make and model for the dropdowns
          setSelectedMake(data.car.make || "");
          setSelectedModel(data.car.model || "");

          setCar(data.car);
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarDetails();
  }, [id]);

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/Vehicle make and model data (2).json");
        const data = await response.json();
        setJsonData(data.Sheet1);
        // Extract unique makes
        const uniqueMakes = [...new Set(data.Sheet1.map((item) => item.Maker))];
        setMakes(uniqueMakes);
      } catch (error) {
        console.error("Error loading vehicle data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJsonData();
  }, []);

  useEffect(() => {
    if (selectedMake && jsonData.length > 0) {
      const makeData = jsonData.find((item) => item.Maker === selectedMake);
      if (makeData && makeData["model "]) {
        // Split models string into array and trim whitespace
        const modelArray = makeData["model "]
          .split(",")
          .map((model) => model.trim());
        setModels(modelArray);
      } else {
        setModels([]);
      }
      // Don't reset selectedModel if we're loading existing data
      if (!car) {
        setSelectedModel("");
      }
    }
  }, [selectedMake, jsonData, car]);

  // Update form data when make changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      make: selectedMake,
      // Only reset model if we're not loading existing data
      model: car ? prev.model : "",
    }));
  }, [selectedMake, car]);

  // Update form data when model changes
  useEffect(() => {
    if (selectedModel) {
      setFormData((prev) => ({
        ...prev,
        model: selectedModel,
      }));
    }
  }, [selectedModel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeatureChange = (e) => {
    const feature = e.target.value;
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const remainingImages = imagePreviews.length;
    const newImages = selectedImages.length;

    if (remainingImages === 0 && newImages === 0) {
      alert("Please add at least one image before updating the car.");
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();

    formDataToSend.append("deletedImageUrls", JSON.stringify(deletedImageUrls));

    // Append all form fields
    for (const key in formData) {
      if (key === "_id") continue;

      if (key === "images") {
        // Handle image uploads - append newly selected images
        selectedImages.forEach((image) => {
          formDataToSend.append("images", image.file);
        });
      } else if (key === "video" && formData.video instanceof File) {
        formDataToSend.append("video", formData.video);
      } else if (key === "features") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === "isLease" || key === "sold") {
        // Handle boolean fields
        formDataToSend.append(key, formData[key] ? "true" : "false");
      } else {
        // Handle all other fields
        const value = formData[key];
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      }
    }

    imagePreviews.forEach((preview) => {
      if (!preview.isNew) {
        formDataToSend.append("existingImages", preview.url);
      }
    });

    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: "PATCH",
        body: formDataToSend,
      });

      if (res.ok) {
        const data = await res.json();
        alert("Car updated successfully!");
        router.push("/admin/listing/view");
      } else {
        const errorData = await res.json();
        console.error("Failed to update car:", errorData);
        alert(`Failed to update car: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating car:", error);
      alert("An error occurred while updating the car.");
    } finally {
      // Re-enable the submit button
      setIsSubmitting(false);
    }
  };

  // When adding new images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files && files.length > 0) {
      const newImages = files.map((file) => {
        const uniqueId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          id: uniqueId,
          file,
          preview: URL.createObjectURL(file),
          isNew: true,
        };
      });

      setSelectedImages([...selectedImages, ...newImages]);
      setImagePreviews([
        ...imagePreviews,
        ...newImages.map((img) => ({
          id: img.id,
          url: img.preview,
          isNew: true,
        })),
      ]);
    }
  };

  const handleImageDelete = (id) => {
    const imageToDelete = imagePreviews.find((img) => img.id === id);

    if (!imageToDelete.isNew) {
      // Existing image - add to deleted list
      setDeletedImageUrls((prev) => [...prev, imageToDelete.url]);
    } else {
      // New image - remove from selectedImages and revoke object URL
      const newSelected = selectedImages.filter((img) => img.id !== id);
      const imageToRevoke = selectedImages.find((img) => img.id === id);
      if (imageToRevoke) {
        URL.revokeObjectURL(imageToRevoke.preview);
      }
      setSelectedImages(newSelected);
    }

    // Remove from previews
    setImagePreviews((prev) => prev.filter((img) => img.id !== id));
  };

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.url && preview.url.startsWith("blob:")) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [imagePreviews]);

  useEffect(() => {
    return () => {
      // Clean up object URLs for new images
      selectedImages.forEach((image) => {
        if (image.preview && image.preview.startsWith("blob:")) {
          URL.revokeObjectURL(image.preview);
        }
      });

      // Clean up any blob URLs in imagePreviews
      imagePreviews.forEach((preview) => {
        if (preview.isNew && preview.url && preview.url.startsWith("blob:")) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [selectedImages, imagePreviews]);

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <section className="my-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-app-text">Edit Car Listing</h2>
        <Link
          href={"/admin/listing/view"}
          className="rounded-lg bg-app-button p-3 text-sm text-white transition-colors duration-200 hover:bg-app-button-hover"
        >
          View All
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <Label htmlFor="make" className="text-app-text">
              Make:
            </Label>
            <Select
              id="make"
              name="make"
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              aria-label="Select Make"
              disabled={loading}
            >
              <option value="">Select Make</option>
              {makes.map((make, index) => (
                <option key={index} value={make}>
                  {make}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="model" className="text-app-text">
              Model:
            </Label>
            <Select
              id="model"
              name="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              aria-label="Select Model"
              disabled={!selectedMake || loading}
            >
              <option value="">Select Model</option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="price" className="text-app-text">
              Price:
            </Label>
            <TextInput
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              addon={selectedCurrency?.name}
            />
          </div>
          <div>
            <Label htmlFor="type" className="text-app-text">
              Vehicle Type:
            </Label>
            <Select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Convertible">Convertible</option>
              <option value="used">Used</option>
              <option value="new">New</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="fuelType" className="text-app-text">
              Fuel Type:
            </Label>
            <Select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
            >
              <option value="">Select Fuel Type</option>
              <option value="petrol">Petrol (Gasoline)</option>
              <option value="diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid (Petrol/Electric)">
                Hybrid (Petrol/Electric)
              </option>
              <option value="Plug-in Hybrid (PHEV)">
                Plug-in Hybrid (PHEV)
              </option>
              <option value="CNG (Compressed Natural Gas)">
                CNG (Compressed Natural Gas)
              </option>
              <option value="LPG (Liquefied Petroleum Gas)">
                LPG (Liquefied Petroleum Gas)
              </option>
              <option value="Hydrogen Fuel Cell">Hydrogen Fuel Cell</option>
              <option value="Ethanol (Flex-Fuel)">Ethanol (Flex-Fuel)</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="kms" className="text-app-text">
              Kilometers:
            </Label>
            <TextInput
              id="kms"
              name="kms"
              type="number"
              value={formData.kms}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="gearbox" className="text-app-text">
              Gearbox:
            </Label>
            <Select
              id="gearbox"
              name="gearbox"
              value={formData.gearbox}
              onChange={handleInputChange}
            >
              <option value="">Select Gearbox</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
              <option value="semi-automatic">Semi Automatic</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="condition" className="text-app-text">
              Condition:
            </Label>
            <Select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
            >
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="Used">Used</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="year" className="text-app-text">
              Year:
            </Label>
            <Select
              id="year"
              name="modelYear"
              value={formData.modelYear}
              onChange={handleInputChange}
            >
              <option value="">Select Year</option>
              {[...Array(20)].map((_, i) => (
                <option key={i} value={2025 - i}>
                  {2025 - i}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <Label htmlFor="fuelTankFillPrice" className="text-app-text">
              Fuel Tank Fill Price:
            </Label>
            <TextInput
              id="fuelTankFillPrice"
              name="fuelTankFillPrice"
              value={formData.fuelTankFillPrice}
              onChange={handleInputChange}
              addon={selectedCurrency?.name}
            />
          </div>
          <div>
            <Label htmlFor="fuelCapacityPerTank" className="text-app-text">
              Fuel Capacity Per Tank:
            </Label>
            <TextInput
              id="fuelCapacityPerTank"
              name="fuelCapacityPerTank"
              type="number"
              value={formData.fuelCapacityPerTank}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="noOfGears" className="text-app-text">
              Number of Gears:
            </Label>
            <TextInput
              id="noOfGears"
              name="noOfGears"
              type="number"
              value={formData.noOfGears}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="cylinder" className="text-app-text">
              Cylinder:
            </Label>
            <TextInput
              id="cylinder"
              name="cylinder"
              type="number"
              value={formData.cylinder}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="batteryRange" className="text-app-text">
              Battery Range:
            </Label>
            <TextInput
              id="batteryRange"
              name="batteryRange"
              type="text"
              value={formData.batteryRange}
              onChange={handleInputChange}
              placeholder="e.g., 200km, 300 miles, 200-400km"
            />
          </div>
          <div>
            <Label htmlFor="chargingTime" className="text-app-text">
              Charging Time:
            </Label>
            <TextInput
              id="chargingTime"
              name="chargingTime"
              type="number"
              value={formData.chargingTime}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="engineSize" className="text-app-text">
              Engine Size:
            </Label>
            <TextInput
              id="engineSize"
              name="engineSize"
              type="number"
              value={formData.engineSize}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="enginePower" className="text-app-text">
              Engine Power:
            </Label>
            <TextInput
              id="enginePower"
              name="enginePower"
              type="number"
              value={formData.enginePower}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="fuelConsumption" className="text-app-text">
              Fuel Consumption:
            </Label>
            <TextInput
              id="fuelConsumption"
              name="fuelConsumption"
              type="number"
              value={formData.fuelConsumption}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="co2Emission" className="text-app-text">
              CO2 Emission:
            </Label>
            <TextInput
              id="co2Emission"
              name="co2Emission"
              type="number"
              value={formData.co2Emission}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="vehicleFullName" className="text-app-text">
              Vehicle Full Name:
            </Label>
            <TextInput
              id="vehicleFullName"
              name="vehicleFullName"
              value={formData.vehicleFullName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="sellerComments" className="text-app-text">
              Seller Comments:
            </Label>
            <Textarea
              id="sellerComments"
              name="sellerComments"
              value={formData.sellerComments}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="tag" className="text-app-text">
              Tag:
            </Label>
            <Select
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleInputChange}
            >
              <option value="default">Default</option>
              <option value="featured">Featured</option>
              <option value="promotion">Promotion</option>
            </Select>
          </div>
          <div className="sm:col-span-1">
            <Label htmlFor="description" className="text-app-text">
              Description:
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              value={formData.description || ""}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-app-text">
              Location:
            </Label>
            <TextInput
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="mileage" className="text-app-text">
              Mileage:
            </Label>
            <TextInput
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="bodyType" className="text-app-text">
              Body Type:
            </Label>
            <TextInput
              id="bodyType"
              name="bodyType"
              value={formData.bodyType}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="color" className="text-app-text">
              Color:
            </Label>
            <TextInput
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="driveType" className="text-app-text">
              Drive Type:
            </Label>
            <TextInput
              id="driveType"
              name="driveType"
              value={formData.driveType}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="doors" className="text-app-text">
              Doors:
            </Label>
            <TextInput
              id="doors"
              name="doors"
              type="number"
              value={formData.doors}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="seats" className="text-app-text">
              Seats:
            </Label>
            <TextInput
              id="seats"
              name="seats"
              type="number"
              value={formData.seats}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="isFinance" className="text-app-text">
              Finance:
            </Label>
            <Select
              id="isFinance"
              name="isFinance"
              value={formData.isFinance}
              onChange={handleInputChange}
            >
              <option value="">Select Finance Status</option>
              <option value="finance">On Finance</option>
              <option value="paid">Paid in Full</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="unit" className="text-app-text">
              Unit:
            </Label>
            <Select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
            >
              <option value="km">Kilometers (km)</option>
              <option value="miles">Miles</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="registerationPlate" className="text-app-text">
              Registration Plate:
            </Label>
            <TextInput
              id="registerationPlate"
              name="registerationPlate"
              value={formData.registerationPlate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="registerationExpire" className="text-app-text">
              Registration Expiry:
            </Label>
            <TextInput
              id="registerationExpire"
              name="registerationExpire"
              type="date"
              value={formData.registerationExpire}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="year" className="text-app-text">
              Build Date:
            </Label>
            <TextInput
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="engineCapacity" className="text-app-text">
              Engine Capacity:
            </Label>
            <TextInput
              id="engineCapacity"
              name="engineCapacity"
              value={formData.engineCapacity}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="dealerId" className="text-app-text">
              Dealer ID:
            </Label>
            <TextInput
              id="dealerId"
              name="dealerId"
              type="number"
              value={formData.dealerId}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center">
            <Checkbox
              id="isLease"
              name="isLease"
              checked={formData.isLease || false}
              onChange={handleInputChange}
            />
            <Label htmlFor="isLease" className="ml-2 text-app-text">
              Available for Lease
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="sold"
              name="sold"
              checked={formData.sold || false}
              onChange={handleInputChange}
            />
            <Label htmlFor="sold" className="ml-2 text-app-text">
              Mark as Sold
            </Label>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-app-text">Features:</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {featuresList.map((feature) => (
              <div key={feature.id} className="flex items-center">
                <Checkbox
                  id={feature.id}
                  value={feature.label}
                  checked={formData.features.includes(feature.label)}
                  onChange={handleFeatureChange}
                />
                <Label htmlFor={feature.id} className="ml-2 text-app-text">
                  {feature.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <Label className="text-app-text">Images:</Label>
          <div className="mt-2 flex flex-wrap gap-4">
            {imagePreviews.length > 0 ? (
              imagePreviews.map((image) => (
                <div key={image.id} className="relative h-24 w-24">
                  <Image
                    src={image.url}
                    alt="Car Image"
                    width={96}
                    height={96}
                    className="h-full w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(image.id)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-app-text">No images available.</p>
            )}
          </div>
        </div>
        <div className="mt-5">
          <Label className="text-app-text">Existing Video:</Label>
          {formData.video && typeof formData.video === "string" && (
            <video controls width="300" className="mt-2">
              <source src={formData.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="mt-5">
          <Label htmlFor="images" className="text-app-text">
            Upload New Images:
          </Label>
          <FileInput
            id="images"
            name="images"
            multiple
            onChange={handleImageChange}
          />
        </div>
        <div className="mt-5">
          <Label htmlFor="video" className="text-app-text">
            Upload Video:
          </Label>
          <FileInput
            id="video"
            name="video"
            onChange={(e) => {
              const file = e.target.files[0];
              setFormData((prev) => ({ ...prev, video: file }));
            }}
          />
        </div>
        <div className="mt-5">
          <Button
            type="submit"
            disabled={isSubmitting}
            color="dark"
            className={`${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {isSubmitting ? "Updating..." : "Update Car"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CarEditPage;
