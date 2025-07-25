import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User } from "lucide-react";
import { getFontStyles } from "@/lib/utils";

const CounterPreview = ({ countData }) => {
  if (!countData) return null;

  const {
    name = "Event Title",
    date = new Date().toISOString(),
    category = "General",
    colors = {},
    image,
    creator = {},
    slug = "preview-slug",
    fontStyle = "modern",
  } = countData;

  // Get font styles based on selected font
  const fontStyles = getFontStyles(fontStyle);

  // Countdown logic (live)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime();
      const eventDate = new Date(date).getTime();
      const diff = eventDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [date]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const TimeUnit = ({ value, label }) => (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex flex-col items-center justify-center p-4">
        <div
          className={`mb-2 text-3xl font-extrabold tabular-nums md:text-5xl ${fontStyles.className}`}
          style={{
            color: colors.primary || "#2563eb",
            letterSpacing: "1px",
          }}
        >
          {String(value).padStart(2, "0")}
        </div>
        <div
          className={`text-xs font-semibold tracking-widest uppercase ${fontStyles.fontFamily}`}
          style={{
            color: colors.muted || "#95a7c8",
          }}
        >
          {label}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div
      className="mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl shadow-xl"
      style={{ backgroundColor: colors.background || "#f8fafc" }}
    >
      {/* Header with gradient and image */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary || "#2563eb"} 0%, ${colors.inverted || colors.secondary || "#1d4ed8"} 100%)`,
        }}
      >
        {/* Image overlay */}
        {image && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ zIndex: 0, opacity: 0.12 }}
          >
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        )}
        <div className="relative px-6 py-10 md:py-12" style={{ zIndex: 1 }}>
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-white/20 text-white backdrop-blur-sm"
              style={{ position: "relative", zIndex: 2 }}
            >
              {category?.toUpperCase?.() || category}
            </Badge>
            <h1
              className={`mb-2 text-4xl font-extrabold text-white capitalize drop-shadow-xl md:text-5xl ${fontStyles.className}`}
              style={{ position: "relative", zIndex: 2 }}
            >
              {name}
            </h1>
            <p
              className={`mb-4 text-base font-medium text-white/90 md:text-lg ${fontStyles.fontFamily}`}
              style={{ position: "relative", zIndex: 2 }}
            >
              <Clock className="mr-2 inline h-5 w-5" />
              {formatDate(date)}
            </p>
            <div
              className={`flex items-center justify-center gap-2 text-white/80 ${fontStyles.fontFamily}`}
              style={{ position: "relative", zIndex: 2 }}
            >
              <User className="h-4 w-4" />
              <span className="text-sm">Organized by</span>
              <span className="font-semibold">{creator.name || "Unknown"}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Countdown Section */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2
              className={`mb-3 text-2xl font-bold md:text-3xl ${fontStyles.className}`}
              style={{
                color: colors.inverted || colors.secondary || "#1d4ed8",
              }}
            >
              Event Countdown
            </h2>
            <p
              className={`text-base ${fontStyles.fontFamily}`}
              style={{ color: colors.muted || "#64748b" }}
            >
              Time remaining until the event begins
            </p>
          </div>
          <div className="mx-auto mb-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <TimeUnit value={timeLeft.seconds} label="Seconds" />
          </div>
          {/* Footer */}
          <div
            className="mt-8 border-t pt-8 text-center"
            style={{ borderColor: (colors.muted || "#64748b") + "30" }}
          >
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-2"
              style={{
                backgroundColor: (colors.primary || "#2563eb") + "10",
                color: colors.muted || "#64748b",
              }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.primary || "#2563eb" }}
              />
              Event ID: {slug}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterPreview;
