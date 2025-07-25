import React from "react";

const CountPage = ({ params }) => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">Count Page</h1>
        <p className="text-muted-foreground text-lg">
          Slug:{" "}
          <span className="bg-muted rounded px-2 py-1 font-mono">
            {params.slug}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CountPage;
