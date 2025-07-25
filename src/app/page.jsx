"use client";

import { useState, useEffect } from "react";
import { getAllCounts, getCountsByCategory } from "@/actions/count";
import { categories } from "@/constants/categories";
import CountCard from "@/components/count-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import FirstTimeLanding from "@/components/landing";

const Page = () => {
  const [counts, setCounts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showLanding, setShowLanding] = useState(false);

  // Check if user is visiting for the first time
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowLanding(true);
    }
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      try {
        let data = [];
        if (selectedCategory === "all") {
          data = await getAllCounts(20, 0);
        } else {
          data = await getCountsByCategory(selectedCategory, 20, 0);
        }
        setCounts(data);
        setHasMore(data.length >= 20);
      } catch (error) {
        setCounts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, [selectedCategory]);

  async function loadMoreEvents() {
    setLoadMoreLoading(true);
    try {
      let newCounts = [];
      if (selectedCategory === "all") {
        newCounts = await getAllCounts(20, counts.length);
      } else {
        newCounts = await getCountsByCategory(
          selectedCategory,
          20,
          counts.length,
        );
      }
      setCounts((prev) => [...prev, ...newCounts]);
      setHasMore(newCounts.length >= 20);
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoadMoreLoading(false);
    }
  }

  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <main className="h-full w-full max-w-6xl rounded-2xl bg-white px-4 py-8">
          {showLanding && (
            <FirstTimeLanding onClose={() => setShowLanding(false)} />
          )}

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Explore Events
            </h1>
            <p className="text-lg text-gray-500">
              Discover a variety of events happening around you.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-6 flex items-center gap-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-56 border border-gray-300 bg-gray-50 text-gray-700 shadow-sm">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    <span className="flex items-center gap-2">
                      {cat.icon}
                      {cat.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-xl font-medium text-gray-400">
              Loading events...
            </div>
          ) : counts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 py-4 md:grid-cols-2 lg:grid-cols-3">
              {counts.map((count) => {
                const cardData = {
                  title: count.name,
                  link: `/c/${count.slug}`,
                  date: count.date,
                  image: count.image,
                  creator: count.creator,
                  rsvpCount: count.emails?.length || 0,
                  theme: count.theme,
                  colors: count.colors,
                  slug: count.slug,
                };
                return <CountCard key={count._id} cardData={cardData} />;
              })}
            </div>
          ) : (
            <div className="flex flex-col items-start justify-start py-8 text-lg text-gray-400">
              No Events Found
            </div>
          )}

          {hasMore && !loading && (
            <div className="flex justify-center py-8">
              <Button
                onClick={loadMoreEvents}
                disabled={loadMoreLoading}
                className="rounded-lg bg-gray-900 px-8 py-2 text-base font-semibold text-white transition-colors hover:bg-gray-800"
              >
                {loadMoreLoading ? "Loading..." : "Load More Events"}
              </Button>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Page;
