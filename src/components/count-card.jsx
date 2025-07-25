import React from "react";

const CountCard = ({ cardData }) => {
  return (
    <a
      className="flex h-full w-full items-center justify-center gap-2 rounded-lg bg-blue-200 p-2 shadow-lg"
      href={cardData?.link || "#"}
    >
      <div className="aspect-square h-12 rounded bg-red-300"></div>
      <div className="h-full w-full bg-blue-400/0">
        <h2 className="text-lg font-semibold">{cardData.title}</h2>
        <p className="text-sm text-gray-600">
          Event will be live on 30th July, Wednesday
        </p>
      </div>
    </a>
  );
};

export default CountCard;
