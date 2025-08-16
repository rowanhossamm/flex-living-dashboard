// app/property/[slug]/page.tsx
import React from "react";

interface Review {
  id: number;
  guestName: string;
  publicReview: string;
  rating: number;
  listingName: string;
  channel: string;
  submittedAt: string;
}

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  let reviews: Review[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews/approved?slug=${slug}`, {
      cache: "no-store",
    });
    const data = await res.json();
    reviews = data.result || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{slug.replace("-", " ").toUpperCase()}</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No approved reviews yet.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-left">Guest</th>
              <th className="p-2 border text-left">Rating</th>
              <th className="p-2 border text-left">Channel</th>
              <th className="p-2 border text-left">Review</th>
              <th className="p-2 border text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="even:bg-gray-50">
                <td className="p-2 border">{review.guestName}</td>
                <td className="p-2 border">{review.rating}</td>
                <td className="p-2 border">{review.channel}</td>
                <td className="p-2 border">{review.publicReview}</td>
                <td className="p-2 border">{new Date(review.submittedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
