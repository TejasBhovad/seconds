"use client";
import { createCount, generateUniqueSlug } from "@/actions/count";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { useUser } from "@/providers/user";
import { Menu, X } from "lucide-react";
import CounterPreview from "@/components/counter-preview";
const Dashboard = () => {
  const { user, loading, isAuthenticated } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // LIFTED STATE: Event info for sidebar and preview
  const [currentStep, setCurrentStep] = useState(1); // 1 = basic, 2 = themes
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    slug: "",
    category: null,
    imageUrl: null,
    date: null,
    time: "",
  });
  const [themeInfo, setThemeInfo] = useState({
    primaryColor: "#2563eb",
    secondaryColor: "#1d4ed8",
    backgroundColor: "#f8fafc",
    mutedColor: "#64748b",
    fontStyle: "modern",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to convert CSS custom properties to actual hex values
  const resolveColorValue = (colorValue) => {
    if (!colorValue || !colorValue.startsWith("hsl(var(")) {
      return colorValue; // Return as-is if it's already a hex/rgb value
    }

    // Create a temporary element to compute the actual color
    const tempElement = document.createElement("div");
    tempElement.style.color = colorValue;
    document.body.appendChild(tempElement);

    const computedColor = window.getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);

    // Convert RGB to hex if needed
    if (computedColor.startsWith("rgb")) {
      const rgbMatch = computedColor.match(/\d+/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        const r = parseInt(rgbMatch[0]);
        const g = parseInt(rgbMatch[1]);
        const b = parseInt(rgbMatch[2]);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      }
    }

    return computedColor || "#000000"; // Fallback
  };

  const handleEventCreate = async (eventData) => {
    try {
      if (!isAuthenticated || !user?.id) {
        throw new Error("You must be logged in to create an event");
      }

      let finalSlug = eventData.slug;
      if (!finalSlug) {
        finalSlug = await generateUniqueSlug(eventData.title);
      }

      const category =
        eventData.category?.slug || eventData.category?.name || "general";

      const countData = {
        name: eventData.title,
        slug: finalSlug,
        category: category,
        date: new Date(
          eventData.date.toISOString().split("T")[0] +
            "T" +
            eventData.time +
            ":00",
        ),
        theme: eventData.fontStyle || "modern",
        colors: {
          primary: resolveColorValue(eventData.primaryColor) || "#000000",
          muted: resolveColorValue(eventData.mutedColor) || "#FFFFFF",
          inverted: resolveColorValue(eventData.secondaryColor) || "#000000",
          background: resolveColorValue(eventData.backgroundColor) || "#F0F0F0",
        },
        image: eventData.imageUrl || "",
        rsvpLink: "",
        creator: user.id,
      };

      console.log("Count data being sent:", countData);

      const createdCount = await createCount(countData);

      // Navigate to the count page
      router.push(`/c/${createdCount.slug}`);

      return createdCount;
    } catch (error) {
      console.error("Error creating event:", error);

      if (error.message.includes("already exists")) {
        alert(
          "An event with this name already exists. Please choose a different name.",
        );
      } else if (error.message.includes("Creator not found")) {
        alert("User not found. Please try logging in again.");
      } else if (
        error.message.includes("category") &&
        error.message.includes("required")
      ) {
        alert("Please select a category for your event.");
      } else {
        alert(`Failed to create event: ${error.message}`);
      }

      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="relative flex-1 transition-all duration-300">
        <div className="flex h-full w-full items-center justify-center bg-green-400/0">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 z-10 rounded-lg bg-white p-2 shadow-lg transition-colors hover:bg-gray-50"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-white">Dashboard</h1>
            {isAuthenticated ? (
              <div className="flex flex-col items-center">
                <CounterPreview
                  countData={{
                    name: basicInfo.title,
                    date: basicInfo.date
                      ? typeof basicInfo.date === "string"
                        ? basicInfo.date
                        : basicInfo.date.toISOString()
                      : new Date().toISOString(),
                    category:
                      basicInfo.category?.name ||
                      basicInfo.category?.slug ||
                      "general",
                    colors: {
                      primary: themeInfo.primaryColor,
                      muted: themeInfo.mutedColor,
                      inverted: themeInfo.secondaryColor,
                      background: themeInfo.backgroundColor,
                    },
                    image: basicInfo.imageUrl,
                    creator: user || {},
                    slug: basicInfo.slug,
                  }}
                />
                <p className="text-white/80">
                  Create and manage your events here.
                </p>
              </div>
            ) : (
              <p className="text-white/80">Please login to create events</p>
            )}
          </div>
        </div>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onEventCreate={handleEventCreate}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        imageUploading={imageUploading}
        setImageUploading={setImageUploading}
        basicInfo={basicInfo}
        setBasicInfo={setBasicInfo}
        themeInfo={themeInfo}
        setThemeInfo={setThemeInfo}
      />
    </div>
  );
};

export default Dashboard;
