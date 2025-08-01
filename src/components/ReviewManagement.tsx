"use client";
import { useState, useEffect } from "react";
import { getAllReviews, updateReviewApproval, deleteReview } from "@/lib/reviewService";
import { Review } from "@/types/menu";
import StarRating from "./StarRating";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [updatingReview, setUpdatingReview] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const allReviews = await getAllReviews();
      setReviews(allReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalToggle = async (reviewId: string, currentApproved: boolean) => {
    // All reviews are auto-approved, so this function is not needed
    console.log("All reviews are auto-approved");
  };

  const handleDeleteReview = async (reviewId: string, menuItemId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setUpdatingReview(reviewId);
      await deleteReview(reviewId, menuItemId);
      
      // Remove from local state
      setReviews(prevReviews => 
        prevReviews.filter(review => review.id !== reviewId)
      );
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setUpdatingReview(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'approved') return review.approved;
    if (filter === 'pending') return !review.approved;
    return true;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.approved).length,
    pending: reviews.filter(r => !r.approved).length,
    averageRating: reviews.length > 0 
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-orange-700">Review Management</h2>
        <button
          onClick={loadReviews}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/90 rounded-lg p-4 border border-orange-200">
          <h3 className="text-sm font-medium text-gray-600">Total Reviews</h3>
          <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
        </div>
        <div className="bg-white/90 rounded-lg p-4 border border-orange-200">
          <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
          <div className="flex items-center space-x-2">
            <StarRating rating={stats.averageRating} readonly size="sm" />
            <span className="text-lg font-bold text-orange-700">{stats.averageRating}</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white/90 rounded-lg p-4 border border-orange-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Reviews ({stats.total})
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">All reviews are automatically approved</p>
      </div>

      {/* Reviews List */}
      <div className="bg-white/90 rounded-lg border border-orange-200">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No reviews found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="font-medium text-gray-800">{review.userName}</h3>
                      <span className="text-sm text-gray-500">{review.userEmail}</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Approved
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700">{review.comment}</p>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      Menu Item ID: {review.menuItemId}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleDeleteReview(review.id, review.menuItemId)}
                      disabled={updatingReview === review.id}
                      className="px-3 py-1 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 