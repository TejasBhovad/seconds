import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Font style mapping for consistent font rendering
export const getFontStyles = (fontStyle) => {
  const fontStyles = {
    modern: {
      fontFamily: "font-inter",
      fontWeight: "font-medium",
      className: "font-inter font-medium",
    },
    classic: {
      fontFamily: "font-serif",
      fontWeight: "font-normal",
      className: "font-serif font-normal",
    },
    playful: {
      fontFamily: "font-comic",
      fontWeight: "font-bold",
      className: "font-comic font-bold",
    },
    elegant: {
      fontFamily: "font-playfair",
      fontWeight: "font-light",
      className: "font-playfair font-light",
    },
  };

  return fontStyles[fontStyle] || fontStyles.modern;
};
