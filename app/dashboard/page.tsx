"use client";

import { useEffect, useMemo, useState } from "react";

interface Review {
  id: number;
  type: string;
  status: "approved" | "pending";
  rating: number;
  publicReview: string;
  categories?: { name: string }[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  listingSlug: string;
  channel: string;
}

type DateRange = "30d" | "90d" | "all";

export default function DashboardPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");

  useEffect(() => {
    fetch("/api/reviews/hostaway")
      .then((res) => res.json())
      .then((data) => setReviews(data.result))
      .catch((err) => console.error(err));
  }, []);

  // All categories
  const categories = useMemo(() => {
    const all = reviews.flatMap((r) => (r.categories ?? []).map((c) => c.name));
    return Array.from(new Set(all));
  }, [reviews]);

  // Filter reviews
  const displayedReviews = useMemo(() => {
    const now = new Date();
    return reviews.filter((r) => {
      if (showApprovedOnly && r.status !== "approved") return false;
      if (r.rating < minRating) return false;

      if (selectedCategory !== "all") {
        const cats = r.categories?.map((c) => c.name) ?? [];
        if (!cats.includes(selectedCategory)) return false;
      }

      if (dateRange !== "all") {
        const submittedDate = new Date(r.submittedAt);
        const diffDays = (now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dateRange === "30d" && diffDays > 30) return false;
        if (dateRange === "90d" && diffDays > 90) return false;
      }

      return true;
    });
  }, [reviews, showApprovedOnly, minRating, selectedCategory, dateRange]);

  // Toggle approve/unapprove
  const toggleApproval = (id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "approved" ? "pending" : "approved" }
          : r
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Flex Living — Reviews Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showApprovedOnly}
            onChange={(e) => setShowApprovedOnly(e.target.checked)}
          />
          Show approved only
        </label>

        <label>
          Min rating:
          <input
            type="number"
            min={0}
            max={10}
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="ml-2 w-16 p-1 border rounded"
          />
        </label>

        <label>
          Category:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="ml-2 p-1 border rounded"
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date range:
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="ml-2 p-1 border rounded"
          >
            <option value="all">All</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </label>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Approve</th>
              <th className="p-2 border">Listing</th>
              <th className="p-2 border">Guest</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Channel</th>
              <th className="p-2 border">Review</th>
              <th className="p-2 border">View</th>
            </tr>
          </thead>
          <tbody>
            {displayedReviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={review.status === "approved"}
                    onChange={() => toggleApproval(review.id)}
                  />
                </td>
                <td className="p-2 border">{review.listingName}</td>
                <td className="p-2 border">{review.guestName}</td>
                <td className="p-2 border text-center">{review.rating}</td>
                <td className="p-2 border">{review.channel}</td>
                <td className="p-2 border">{review.publicReview}</td>
                <td className="p-2 border text-center">
                  <a
                    href={`/property/${review.listingSlug}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayedReviews.length === 0 && (
        <p className="text-gray-500 mt-4">No reviews to display.</p>
      )}
    </div>
  );
}
