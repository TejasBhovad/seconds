import React from "react";
import { getAllCounts } from "@/actions/count";
import CountCard from "@/components/count-card";
import { Button } from "@/components/ui/button";
const Page = async () => {
  let counts = [];

  try {
    // Fetch all counts server-side
    counts = await getAllCounts(20, 0);
  } catch (error) {
    console.error("Failed to fetch counts:", error);
    // Continue with empty array to show fallback UI
  }

  async function loadMoreEvents() {
    const newCounts = await getAllCounts(20, counts.length);
    counts.push(...newCounts);
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <main className="h-full w-full max-w-6xl bg-red-200 px-4 py-4">
        <span className="text-inverted text-2xl font-bold">Explore Events</span>
        <p className="text-black/50">
          Discover a variety of events happening around you.
        </p>

        {counts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
            {counts.map((count) => {
              const cardData = {
                title: count.name,
                link: `/count/${count.slug}`,
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
          <div className="flex flex-col items-start justify-start py-4">
            No Events Found
          </div>
        )}

        {counts.length >= 20 && (
          <div className="flex justify-center py-4">
            <Button onClick={loadMoreEvents}>Load More Events</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
