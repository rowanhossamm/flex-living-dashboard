import fs from "fs";
import path from "path";
import { getMockReviews } from "@/lib/hostaway";

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const reviews = await getMockReviews();

  const approvedFile = path.join(process.cwd(), "mock", "approved.json");
  let approvedIds: number[] = [];
  if (fs.existsSync(approvedFile)) {
    approvedIds = JSON.parse(fs.readFileSync(approvedFile, "utf-8"));
  }

  const propertyReviews = reviews.filter(
    (r) => r.listingSlug === params.slug && approvedIds.includes(r.id)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Guest Reviews</h1>
      {propertyReviews.length === 0 ? (
        <p>No approved reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {propertyReviews.map((review) => (
            <li key={review.id} className="border p-4 rounded">
              <p className="font-semibold">{review.guestName}</p>
              <p>Rating: {review.rating}</p>
              <p>{review.publicReview}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
