"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import StarRating from "./StarRating";

interface ReviewFormProps {
  productId: string;
  existingReview?: {
    id: string;
    rating: number;
    review_text: string | null;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  productId,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(
    existingReview?.review_text || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-600">
        Нэвтэрч орж бүтээгдэхүүнийг худалдаж авсны дараа үнэлгээ өгөх боломжтой
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Үнэлгээ сонгоно уу");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `/api/products/${productId}/reviews`;
      const method = existingReview ? "PUT" : "POST";
      const body = existingReview
        ? {
            review_id: existingReview.id,
            rating,
            review_text: reviewText.trim() || null,
          }
        : {
            rating,
            review_text: reviewText.trim() || null,
          };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Алдаа гарлаа");
      }

      onSuccess();
      if (!existingReview) {
        setRating(0);
        setReviewText("");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Үнэлгээ нэмэхэд алдаа гарлаа"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Үнэлгээ
        </label>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          readonly={false}
        />
      </div>

      <div>
        <label
          htmlFor="review-text"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Сэтгэгдэл (сонголттой)
        </label>
        <textarea
          id="review-text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
          placeholder="Бүтээгдэхүүний талаарх санал бодлоо бичнэ үү..."
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
        >
          {loading
            ? "Хадгалж байна..."
            : existingReview
            ? "Шинэчлэх"
            : "Илгээх"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Цуцлах
          </button>
        )}
      </div>
    </form>
  );
}
