"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface ReviewListProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export default function ReviewList({
  productId,
  averageRating,
  totalReviews,
}: ReviewListProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/products/${productId}/reviews?page=${pageNum}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [productId, page]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Энэ үнэлгээг устгахдаа итгэлтэй байна уу?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${productId}/reviews?review_id=${reviewId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        fetchReviews(page);
      }
    } catch (error) {
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const userReview = user ? reviews.find((r) => r.profiles.id === user.id) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Үнэлгээ ба сэтгэгдэл
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} readonly size="lg" />
              <span className="text-lg font-medium text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({totalReviews} үнэлгээ)
            </span>
          </div>
        </div>
        {user && !userReview && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
          >
            {showForm ? "Цуцлах" : "Үнэлгээ нэмэх"}
          </button>
        )}
      </div>

      {showForm && user && !userReview && (
        <div className="p-4 border border-gray-200 rounded-lg">
          <ReviewForm
            productId={productId}
            onSuccess={() => {
              setShowForm(false);
              fetchReviews(page);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingReviewId && userReview && (
        <div className="p-4 border border-gray-200 rounded-lg">
          <ReviewForm
            productId={productId}
            existingReview={userReview}
            onSuccess={() => {
              setEditingReviewId(null);
              fetchReviews(page);
            }}
            onCancel={() => setEditingReviewId(null)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Уншиж байна...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Хараахан үнэлгээ байхгүй байна
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {review.profiles.avatar_url ? (
                      <img
                        src={review.profiles.avatar_url}
                        alt={review.profiles.full_name || "User"}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm font-medium">
                        {(review.profiles.full_name || "U")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.profiles.full_name || "Хэрэглэгч"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                </div>
                {user?.id === review.profiles.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingReviewId(
                          editingReviewId === review.id ? null : review.id
                        )
                      }
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Засах
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Устгах
                    </button>
                  </div>
                )}
              </div>
              <StarRating rating={review.rating} readonly size="sm" />
              {review.review_text && (
                <p className="mt-3 text-sm text-gray-700">{review.review_text}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Өмнөх
          </button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Дараах
          </button>
        </div>
      )}
    </div>
  );
}
