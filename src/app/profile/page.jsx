"use client";
import React, { useEffect, useState } from "react";
import { getUserCounts, deleteCount } from "@/actions/count";
import { useUser } from "@/providers/user";
import CountCard from "@/components/count-card";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { user, loading: userLoading, isAuthenticated } = useUser();
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!userLoading && user?.id) {
      setLoading(true);
      getUserCounts(user.id)
        .then((data) => setCounts(data))
        .finally(() => setLoading(false));
    }
  }, [user, userLoading]);

  const handleDelete = async (countId) => {
    if (!user?.id) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This cannot be undone.",
      )
    )
      return;
    setDeletingId(countId);
    try {
      await deleteCount(countId, user.id);
      setCounts((prev) => prev.filter((c) => c._id !== countId));
    } catch (err) {
      alert("Failed to delete event: " + (err?.message || "Unknown error"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">My Events</h1>
        <p className="mb-8 text-gray-500">
          Manage your created events below. You can delete any event you own.
        </p>
        {userLoading || loading ? (
          <div className="py-16 text-center text-lg text-gray-400">
            Loading your events...
          </div>
        ) : counts.length === 0 ? (
          <div className="py-16 text-center text-lg text-gray-400">
            No events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {counts.map((count) => (
              <CountCard
                key={count._id}
                cardData={{
                  title: count.name,
                  link: `/count/${count.slug}`,
                  date: count.date,
                  image: count.image,
                  creator: count.creator,
                  rsvpCount: count.emails?.length || 0,
                  theme: count.theme,
                  colors: count.colors,
                  slug: count.slug,
                }}
                showDelete={count.creator?._id === user.id}
                onDelete={() => handleDelete(count._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
