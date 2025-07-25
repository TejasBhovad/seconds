"use client";
import { getCountBySlug } from "@/actions/count";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import { rsvpToCount } from "@/actions/count";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, User, ExternalLink } from "lucide-react";
import { getFontStyles } from "@/lib/utils";

// Accepts the dynamic route params as a Promise (Next.js 15+)
const CountPage = ({ params }) => {
  // Unwrap the params Promise with React.use()
  const routeParams = use(params);
  const slug = routeParams.slug;

  const [countData, setCountData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  // RSVP state
  const [email, setEmail] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpErrorMsg, setRsvpErrorMsg] = useState(null);

  // Fetch count data by slug
  useEffect(() => {
    async function fetchCount() {
      try {
        const result = await getCountBySlug(slug);
        if (!result) {
          setNotFound(true);
        } else {
          setCountData(result);
        }
      } catch (err) {
        setNotFound(true);
      }
    }
    if (slug) fetchCount();
  }, [slug]);

  // Timer logic
  useEffect(() => {
    if (!countData) return;
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventDate = new Date(countData.date).getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [countData]);

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    if (!countData) return "#";
    const start = new Date(countData.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const formatCalDate = (date) =>
      date
        .toISOString()
        .replace(/-|:|\.\d{3}/g, "")
        .slice(0, 15);

    const details = {
      text: encodeURIComponent(countData.name),
      dates: `${formatCalDate(start)}/${formatCalDate(end)}`,
      details: encodeURIComponent(
        `Category: ${countData.category}\nOrganized by: ${countData.creator.name}`,
      ),
      location: encodeURIComponent("Online/Location TBD"),
    };

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${details.text}&dates=${details.dates}&details=${details.details}&location=${details.location}`;
  };

  // RSVP handler
  const handleRsvp = async (e) => {
    e.preventDefault();
    setRsvpLoading(true);
    setRsvpStatus(null);
    setRsvpErrorMsg(null);

    // Email validation (frontend)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRsvpStatus("error");
      setRsvpErrorMsg("Please enter a valid email address.");
      setRsvpLoading(false);
      return;
    }

    try {
      // Backend expects slug and email as arguments
      const response = await rsvpToCount(countData.slug, email);
      setRsvpStatus(response?.success ? "success" : "error");
      setRsvpErrorMsg(response?.message || "An error occurred.");
      if (response.success) {
        setEmail("");
      }
    } catch (err) {
      setRsvpStatus("error");
      setRsvpErrorMsg("Failed to submit RSVP. Please try again.");
    } finally {
      setRsvpLoading(false);
    }
  };

  const TimeUnit = ({ value, label }) => (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex flex-col items-center justify-center p-4">
        <div
          className={`mb-2 text-3xl font-extrabold tabular-nums md:text-5xl ${countData?.fontStyle ? getFontStyles(countData.fontStyle).className : "font-sans font-normal"}`}
          style={{
            color: countData?.colors?.primary || "#2563eb",
            letterSpacing: "1px",
          }}
        >
          {String(value).padStart(2, "0")}
        </div>
        <div
          className={`text-xs font-semibold tracking-widest uppercase ${countData?.fontStyle ? getFontStyles(countData.fontStyle).fontFamily : "font-sans"}`}
          style={{
            color: countData?.colors?.muted || "#95a7c8",
          }}
        >
          {label}
        </div>
      </CardContent>
    </Card>
  );

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

  // 404 Not found page
  if (notFound) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Card className="mx-auto max-w-lg border border-gray-200 p-8 shadow-xl">
          <CardContent>
            <div className="flex flex-col items-center">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
                <text
                  x="12"
                  y="16"
                  textAnchor="middle"
                  fill="#2563eb"
                  fontSize="10"
                >
                  404
                </text>
              </svg>
              <h1 className="mt-4 mb-2 text-2xl font-bold text-blue-700">
                Event Not Found
              </h1>
              <p className="mb-2 text-center text-gray-500">
                Sorry, we couldn't find that event. It may have been deleted or
                the link is incorrect.
              </p>
              <Button href="/" className="mt-4">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state (optional)
  if (!countData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: countData.colors.background }}
    >
      {/* Professional Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${countData.colors.primary} 0%, ${countData.colors.inverted} 100%)`,
        }}
      >
        {/* Geometric Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon points="0,0 100,0 85,100 0,100" fill="white" />
          </svg>
        </div>
        {/* Background Image Positioned Behind Title */}
        {countData.image && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ zIndex: 0, opacity: 0.12 }}
          >
            <Image
              src={countData.image}
              alt={countData.name}
              layout="fill"
              objectFit="cover"
              priority={false}
              unoptimized={false}
            />
          </div>
        )}

        <div className="relative px-6 py-10 md:py-16" style={{ zIndex: 1 }}>
          <div className="mx-auto max-w-4xl text-center">
            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="mb-6 bg-white/20 text-white backdrop-blur-sm"
              style={{ position: "relative", zIndex: 2 }}
            >
              {countData.category.toUpperCase()}
            </Badge>

            {/* Event Title */}
            <h1
              className={`mb-4 text-5xl font-extrabold text-white capitalize drop-shadow-xl md:text-6xl ${countData?.fontStyle ? getFontStyles(countData.fontStyle).className : "font-sans font-normal"}`}
              style={{ position: "relative", zIndex: 2 }}
            >
              {countData.name}
            </h1>

            {/* Event Date */}
            <p
              className={`mb-8 text-lg font-medium text-white/90 md:text-xl ${countData?.fontStyle ? getFontStyles(countData.fontStyle).fontFamily : "font-sans"}`}
              style={{ position: "relative", zIndex: 2 }}
            >
              <Clock className="mr-2 inline h-5 w-5" />
              {formatDate(countData.date)}
            </p>

            {/* Creator Info */}
            <div
              className={`flex items-center justify-center gap-2 text-white/80 ${countData?.fontStyle ? getFontStyles(countData.fontStyle).fontFamily : "font-sans"}`}
              style={{ position: "relative", zIndex: 2 }}
            >
              <User className="h-4 w-4" />
              <span className="text-sm">Organized by</span>
              <span className="font-semibold">{countData.creator.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Countdown Section */}
          {!isExpired ? (
            <div className="mb-8">
              <div className="mb-8 text-center">
                <h2
                  className={`mb-3 text-2xl font-bold md:text-3xl ${countData?.fontStyle ? getFontStyles(countData.fontStyle).className : "font-sans font-normal"}`}
                  style={{ color: countData.colors.inverted }}
                >
                  Event Countdown
                </h2>
                <p
                  className={`text-base ${countData?.fontStyle ? getFontStyles(countData.fontStyle).fontFamily : "font-sans"}`}
                  style={{ color: countData.colors.muted }}
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
            </div>
          ) : (
            <div className="mb-8 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
                style={{ backgroundColor: countData.colors.primary + "20" }}
              >
                🎉
              </div>
              <h2
                className={`mb-2 text-2xl font-bold md:text-3xl ${countData?.fontStyle ? getFontStyles(countData.fontStyle).className : "font-sans font-normal"}`}
                style={{ color: countData.colors.inverted }}
              >
                Event has started!
              </h2>
              <p
                className={`text-lg ${countData?.fontStyle ? getFontStyles(countData.fontStyle).fontFamily : "font-sans"}`}
                style={{ color: countData.colors.muted }}
              >
                The countdown has ended. We hope you enjoy the event!
              </p>
            </div>
          )}

          {/* RSVP Section */}
          <div className="mb-12 flex flex-col items-center">
            <Card className="w-full max-w-md">
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <Calendar
                    className="mx-auto mb-2 h-8 w-8"
                    style={{ color: countData.colors.primary }}
                  />
                  <h2
                    className={`text-xl font-bold ${countData?.fontStyle ? getFontStyles(countData.fontStyle).className : "font-sans font-normal"}`}
                    style={{ color: countData.colors.primary }}
                  >
                    RSVP for this Event
                  </h2>
                  <p
                    className={`mt-2 text-sm ${countData?.fontStyle ? getFontStyles(countData.fontStyle).fontFamily : "font-sans"}`}
                    style={{ color: countData.colors.muted }}
                  >
                    Reserve your spot! Enter your email and RSVP.
                    <br />
                    Receive a confirmation instantly.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleRsvp}>
                  <div>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className={`${rsvpStatus === "error" ? "border-red-500" : ""}`}
                      disabled={rsvpLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={rsvpLoading || !email.trim()}
                    className="w-full"
                    style={{
                      background: `linear-gradient(90deg, ${countData.colors.primary}, ${countData.colors.inverted})`,
                    }}
                  >
                    {rsvpLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        RSVP
                      </>
                    )}
                  </Button>

                  {rsvpErrorMsg && (
                    <div
                      className={`animate-fade-in mt-3 rounded-lg border px-4 py-3 text-center text-sm font-medium transition-all duration-300 ${
                        rsvpStatus === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {rsvpStatus === "success" ? (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
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
                        )}
                        {rsvpErrorMsg}
                      </div>
                    </div>
                  )}
                </form>

                {/* Google Calendar Button */}
                <Button
                  asChild
                  variant="outline"
                  className="mt-6 w-full bg-transparent hover:bg-blue-50"
                  style={{
                    borderColor: countData.colors.primary,
                    color: countData.colors.primary,
                  }}
                >
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Add to Google Calendar
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div
            className="mt-auto border-t pt-8 text-center"
            style={{ borderColor: countData.colors.muted + "30" }}
          >
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-2"
              style={{
                backgroundColor: countData.colors.primary + "10",
                color: countData.colors.muted,
              }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: countData.colors.primary }}
              />
              Event ID: {countData.slug}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountPage;
