import fs from "fs";
import path from "path";

export type ReviewCategory = {
  category: string;
  rating: number;
};

export type Review = {
  id: number;
  type?: string; // خليها اختيارية
  status?: string; // اختيارية
  rating: number | null;
  publicReview: string;
  reviewCategory?: ReviewCategory[]; // اختيارية
  submittedAt?: string; // اختيارية
  guestName: string;
  listingName: string;
  listingSlug: string;
  channel: string;
};

export async function getMockReviews(): Promise<Review[]> {
  const filePath = path.join(process.cwd(), "mock", "reviews.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  const reviews: Partial<Review>[] = JSON.parse(fileData);

  return reviews.map((review, index) => ({
    id: review.id ?? index + 1,
    type: review.type ?? "guest",
    status: review.status ?? "approved",
    rating: review.rating ?? (review.reviewCategory ? calculateAverageRating(review.reviewCategory) : null),
    publicReview: review.publicReview ?? "",
    reviewCategory: review.reviewCategory ?? [],
    submittedAt: review.submittedAt ? new Date(review.submittedAt).toISOString() : new Date().toISOString(),
    guestName: review.guestName ?? "Unknown Guest",
    listingName: review.listingName ?? "Unknown Listing",
    listingSlug: review.listingSlug ?? "unknown-listing",
    channel: review.channel ?? "Other"
  }));
}

function calculateAverageRating(categories: ReviewCategory[]): number {
  if (!categories || categories.length === 0) return 0;
  const total = categories.reduce((sum, c) => sum + c.rating, 0);
  return Math.round(total / categories.length);
}

// lib/hostaway.ts
export async function getReviewsBySlug(slug: string) {
  const res = await fetch('http://localhost:3000/api/reviews/hostaway');
  const data = await res.json();

  // Filter reviews for this property
  return data.result.filter((r: any) => r.listingSlug === slug);
}
