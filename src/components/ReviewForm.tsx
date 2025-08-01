"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import StarRating from "./StarRating";
import { addReview } from "@/lib/reviewService";
import { CreateReviewData } from "@/types/menu";

interface ReviewFormProps {
  menuItemId: string;
  menuItemName: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ 
  menuItemId, 
  menuItemName, 
  onReviewSubmitted 
}: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be logged in to submit a review");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Please write a review with at least 10 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const reviewData: CreateReviewData = {
        menuItemId,
        userId: user.uid,
        userName: user.displayName || user.email!.split('@')[0],
        userEmail: user.email!,
        rating,
        comment: comment.trim(),
      };

      await addReview(reviewData);
      
      setSuccess(true);
      setRating(0);
      setComment("");
      
      // Call the callback to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
        <p className="text-orange-700">Please log in to write a review</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-700 font-medium">Thank you for your review!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-orange-200">
      <h3 className="text-xl font-bold text-orange-700 mb-4">
        Write a Review for {menuItemName}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <StarRating 
            rating={rating} 
            onRatingChange={setRating} 
            size="lg"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-black"
            rows={4}
            placeholder="Share your experience with this dish... (minimum 10 characters)"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
} 