"use client";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = "md" 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl"
  };

  const handleMouseEnter = (starIndex: number) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleClick = (starIndex: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizeClasses[size]} transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer"
          }`}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(star)}
          disabled={readonly}
        >
          {star <= displayRating ? (
            <span className="text-yellow-400">★</span>
          ) : (
            <span className="text-gray-300">☆</span>
          )}
        </button>
      ))}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600">
          {displayRating}/5
        </span>
      )}
    </div>
  );
} 