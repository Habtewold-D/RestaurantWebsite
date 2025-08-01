"use client";
import { Review } from "@/types/menu";
import StarRating from "./StarRating";

interface ReviewDisplayProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ReviewDisplay({ 
  reviews, 
  averageRating, 
  totalReviews 
}: ReviewDisplayProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (totalReviews === 0) {
    return (
      <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-orange-200">
        <h3 className="text-xl font-bold text-orange-700 mb-4">Reviews</h3>
        <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review this item!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-orange-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-orange-700">Reviews</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <StarRating rating={averageRating} readonly size="sm" />
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-800">{review.userName}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>

      {reviews.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Showing {reviews.length} of {totalReviews} reviews
          </p>
        </div>
      )}
    </div>
  );
} 