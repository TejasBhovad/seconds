"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { categories } from "@/constants/categories";
import { UploadDropzone } from "@uploadthing/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Upload, Plus, X, Clock } from "lucide-react";
import { format } from "date-fns";

export function Sidebar({
  isOpen,
  onToggle,
  onEventCreate,
  currentStep,
  setCurrentStep,
  isLoading,
  setIsLoading,
  imageUploading,
  setImageUploading,
  basicInfo,
  setBasicInfo,
  themeInfo,
  setThemeInfo,
}) {
  const fontStyles = [
    { id: "modern", name: "Modern", preview: "Aa" },
    { id: "classic", name: "Classic", preview: "Aa" },
    { id: "playful", name: "Playful", preview: "Aa" },
    { id: "elegant", name: "Elegant", preview: "Aa" },
  ];

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setBasicInfo((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  // Handle category selection (single choice)
  const handleCategorySelect = (category) => {
    setBasicInfo((prev) => ({
      ...prev,
      category: prev.category?.slug === category.slug ? null : category,
    }));
  };

  // Handle successful image upload
  const handleImageUploadComplete = (res) => {
    console.log("Upload completed:", res);
    if (res && res.length > 0) {
      const uploadedFile = res[0];
      setBasicInfo((prev) => ({
        ...prev,
        imageUrl: uploadedFile.url,
      }));
      setImageUploading(false);
    }
  };

  // Handle upload error
  const handleImageUploadError = (error) => {
    console.error("Upload error:", error);
    alert(`Upload failed: ${error.message}`);
    setImageUploading(false);
  };

  // Handle upload begin
  const handleImageUploadBegin = (name) => {
    console.log("Upload started for:", name);
    setImageUploading(true);
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setBasicInfo((prev) => ({
      ...prev,
      imageUrl: null,
    }));
  };

  // Generate time options
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const displayTime = new Date(
          `2000-01-01T${timeString}`,
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        times.push({ value: timeString, display: displayTime });
      }
    }
    return times;
  };

  // Validate basic info step
  const isBasicInfoValid = () => {
    return (
      basicInfo.title.trim() &&
      basicInfo.slug.trim() &&
      basicInfo.category &&
      basicInfo.date &&
      basicInfo.time
    );
  };

  // Handle next step
  const handleNext = () => {
    if (isBasicInfoValid()) {
      setCurrentStep(2);
    }
  };

  // Handle back step
  const handleBack = () => {
    setCurrentStep(1);
  };

  // Handle final submission
  const handleProceed = async () => {
    setIsLoading(true);
    try {
      const eventData = {
        ...basicInfo,
        ...themeInfo,
        colors: {
          primary: themeInfo.primaryColor,
          secondary: themeInfo.secondaryColor,
          muted: themeInfo.mutedColor,
          background: themeInfo.backgroundColor,
        },
      };

      await onEventCreate(eventData);

      // Reset form
      setBasicInfo({
        title: "",
        slug: "",
        category: null,
        imageUrl: null,
        date: null,
        time: "",
      });
      setThemeInfo({
        primaryColor: "#2563eb", // Blue-600
        secondaryColor: "#1d4ed8", // Blue-700
        backgroundColor: "#f8fafc", // Slate-50
        mutedColor: "#64748b", // Slate-500
        fontStyle: "modern",
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`border-sidebar-border bg-sidebar flex h-full flex-col overflow-hidden border-l shadow-xl transition-all duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-0"
      }`}
    >
      {/* Sidebar Header */}
      <div className="border-sidebar-border border-b p-4">
        <h2 className="text-sidebar-foreground text-lg font-semibold whitespace-nowrap">
          {currentStep === 1 ? "Basic Information" : "Themes"}
        </h2>
        <div className="mt-2 flex space-x-1">
          <div
            className={`h-1 flex-1 rounded ${
              currentStep >= 1 ? "bg-sidebar-primary" : "bg-muted"
            }`}
          />
          <div
            className={`h-1 flex-1 rounded ${
              currentStep >= 2 ? "bg-sidebar-primary" : "bg-muted"
            }`}
          />
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {currentStep === 1 && (
          <>
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sidebar-foreground">
                Title of event
              </Label>
              <Input
                id="title"
                placeholder="Enter event title"
                value={basicInfo.title}
                onChange={handleTitleChange}
                className="bg-sidebar border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sidebar-foreground">
                Slug for the event
              </Label>
              <Input
                id="slug"
                placeholder="event-slug"
                value={basicInfo.slug}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  }))
                }
                className="bg-sidebar border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Categories - Compact Grid */}
            <div className="space-y-2">
              <Label className="text-sidebar-foreground">Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleCategorySelect(category)}
                    className={`flex flex-col items-center space-y-1 rounded-lg border p-2 text-center transition-all duration-200 ${
                      basicInfo.category?.slug === category.slug
                        ? "border-sidebar-primary bg-sidebar-accent shadow-sm"
                        : "border-sidebar-border hover:border-sidebar-primary/50 hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded text-sm"
                      style={{ backgroundColor: category.color }}
                    >
                      <span className="text-foreground [&>svg]:h-3 [&>svg]:w-3">
                        {category.icon}
                      </span>
                    </div>
                    <span className="text-sidebar-foreground text-xs font-medium">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label className="text-sidebar-foreground">Cover Image</Label>
              {basicInfo.imageUrl ? (
                <div className="relative">
                  <img
                    src={basicInfo.imageUrl}
                    alt="Uploaded cover"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="border-sidebar-border overflow-hidden rounded-lg border-2 border-dashed">
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={handleImageUploadComplete}
                    onUploadError={handleImageUploadError}
                    onUploadBegin={handleImageUploadBegin}
                    onDrop={(acceptedFiles) => {
                      console.log("Files dropped:", acceptedFiles);
                    }}
                    disabled={imageUploading}
                    config={{
                      mode: "auto",
                      cn: (classes) => {
                        if (Array.isArray(classes)) {
                          return classes.join(" ");
                        }
                        if (typeof classes === "string") {
                          return classes;
                        }
                        return "";
                      },
                    }}
                    appearance={{
                      button: {
                        backgroundColor: "hsl(var(--sidebar-primary))",
                        color: "hsl(var(--sidebar-primary-foreground))",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        padding: "0.5rem 1rem",
                        border: "1px solid hsl(var(--sidebar-border))",
                        transition: "all 0.2s",
                      },
                      container: {
                        width: "100%",
                        maxWidth: "100%",
                        minHeight: "120px",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                      },
                      allowedContent: {
                        color: "hsl(var(--muted-foreground))",
                        fontSize: "0.75rem",
                        marginTop: "0.5rem",
                      },
                      label: {
                        color: "hsl(var(--sidebar-foreground))",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        marginBottom: "0.5rem",
                      },
                      uploadIcon: {
                        color: "hsl(var(--muted-foreground))",
                        width: "2rem",
                        height: "2rem",
                      },
                    }}
                  />
                  {imageUploading && (
                    <div className="flex items-center justify-center p-4">
                      <div className="text-sidebar-foreground text-sm">
                        Uploading...
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date */}
              <div className="space-y-2">
                <Label className="text-sidebar-foreground">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-sidebar border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start px-2 text-left text-xs font-normal"
                    >
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {basicInfo.date
                        ? format(basicInfo.date, "MMM dd")
                        : "Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-popover border-border w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={basicInfo.date}
                      onSelect={(date) =>
                        setBasicInfo((prev) => ({ ...prev, date }))
                      }
                      initialFocus
                      className="bg-popover"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label className="text-sidebar-foreground">Time</Label>
                <Select
                  value={basicInfo.time}
                  onValueChange={(value) =>
                    setBasicInfo((prev) => ({ ...prev, time: value }))
                  }
                >
                  <SelectTrigger className="bg-sidebar border-sidebar-border text-sidebar-foreground w-full px-2 text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    <SelectValue placeholder="Time" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-h-60">
                    {generateTimeOptions().map((timeOption) => (
                      <SelectItem
                        key={timeOption.value}
                        value={timeOption.value}
                        className="text-popover-foreground hover:bg-accent text-xs"
                      >
                        {timeOption.display}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Primary Color */}
            <div className="space-y-2">
              <Label className="text-sidebar-foreground">Primary color</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={themeInfo.primaryColor}
                  onChange={(e) =>
                    setThemeInfo((prev) => ({
                      ...prev,
                      primaryColor: e.target.value,
                    }))
                  }
                  className="border-sidebar-border h-8 w-10 rounded border"
                />
                <Input
                  value={themeInfo.primaryColor}
                  onChange={(e) =>
                    setThemeInfo((prev) => ({
                      ...prev,
                      primaryColor: e.target.value,
                    }))
                  }
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground flex-1 text-xs"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <Label className="text-sidebar-foreground">Secondary color</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={themeInfo.secondaryColor}
                  onChange={(e) =>
                    setThemeInfo((prev) => ({
                      ...prev,
                      secondaryColor: e.target.value,
                    }))
                  }
                  className="border-sidebar-border h-8 w-10 rounded border"
                />
                <Input
                  value={themeInfo.secondaryColor}
                  onChange={(e) =>
                    setThemeInfo((prev) => ({
                      ...prev,
                      secondaryColor: e.target.value,
                    }))
                  }
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground flex-1 text-xs"
                />
              </div>
            </div>

            {/* Muted Color */}
            <div className="space-y-2">
              <Label className="text-sidebar-foreground">Muted color</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={themeInfo.mutedColor}
                  onChange={(e) =>
                    setThemeInfo((prev) => ({
                      ...prev,
                      mutedColor: e.target.value,
                    }))
                  }
                  className="border-sidebar-border h-8 w-10 rounded border"
                />
                <Input
                  value={themeInfo.mutedColor}
                  onChange={(e) =>
                    setThemeInfo((prev) => ({
                      ...prev,
                      mutedColor: e.target.value,
                    }))
                  }
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground flex-1 text-xs"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label className="text-sidebar-foreground">
                Background color
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={themeInfo.backgroundColor}
                  onChange={(e) =>
                    setThemeInfo((prev) => ({
                      ...prev,
                      backgroundColor: e.target.value,
                    }))
                  }
                  className="border-sidebar-border h-8 w-10 rounded border"
                />
                <Input
                  value={themeInfo.backgroundColor}
                  onChange={(e) =>
                    setThemeInfo((prev) => ({
                      ...prev,
                      backgroundColor: e.target.value,
                    }))
                  }
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground flex-1 text-xs"
                />
              </div>
            </div>

            {/* Font Styles */}
            <div className="space-y-2">
              <Label className="text-sidebar-foreground">Font styles</Label>
              <div className="grid grid-cols-2 gap-2">
                {fontStyles.map((font) => (
                  <button
                    key={font.id}
                    onClick={() =>
                      setThemeInfo((prev) => ({
                        ...prev,
                        fontStyle: font.id,
                      }))
                    }
                    className={`rounded-lg border p-2 text-center transition-colors ${
                      themeInfo.fontStyle === font.id
                        ? "border-sidebar-primary bg-sidebar-accent"
                        : "border-sidebar-border hover:border-sidebar-primary/50 hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <div className="text-sidebar-foreground text-lg font-bold">
                      {font.preview}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {font.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="border-sidebar-border border-t p-4">
        <div className="flex space-x-2">
          {currentStep === 2 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="bg-sidebar border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent flex-1"
            >
              Back
            </Button>
          )}

          {currentStep === 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isBasicInfoValid()}
              className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 flex-1 disabled:opacity-50"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleProceed}
              disabled={isLoading}
              className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 flex-1 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Proceed"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
