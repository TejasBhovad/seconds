import React from "react";

const CategoryCard = ({ category }) => {
  return (
    <div className="flex h-fit w-fit items-center justify-center gap-2 rounded-lg bg-gray-200 p-4 shadow-lg">
      {category.icon}
      {category.name}
    </div>
  );
};

export default CategoryCard;
