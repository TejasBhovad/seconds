import React from "react";

const CountCard = ({ cardData, showDelete = false, onDelete }) => {
  const {
    title,
    link,
    date,
    image,
    creator,
    rsvpCount,
    colors = {},
  } = cardData;
  const eventDate = date ? new Date(date) : new Date();
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const isPopular = rsvpCount >= 10;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      {/* Delete Button Overlay */}
      {showDelete && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-1.5 text-gray-500 shadow transition-colors hover:bg-red-100 hover:text-red-600"
          title="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      {/* Landscape Header Image or Placeholder */}
      {image ? (
        <img
          src={image}
          alt={title}
          className="aspect-[3/1] w-full bg-gray-100 object-cover"
        />
      ) : (
        <div className="flex aspect-[3/1] w-full items-center justify-center bg-gradient-to-r from-gray-200 to-gray-100 text-3xl text-gray-300">
          📅
        </div>
      )}
      <a
        href={link || "#"}
        className="flex flex-1 flex-col px-4 py-3 no-underline hover:underline-offset-2 focus:outline-none"
      >
        <div className="mb-1 flex items-center gap-2">
          <h2 className="line-clamp-1 text-lg font-semibold text-gray-900">
            {title}
          </h2>
          {isPopular && (
            <span className="ml-1 rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">
              Popular
            </span>
          )}
        </div>
        <p className="mb-1 line-clamp-1 text-sm text-gray-500">
          {formattedDate}
        </p>
        {/* Optionally, add more event info here */}
      </a>
    </div>
  );
};

export default CountCard;
