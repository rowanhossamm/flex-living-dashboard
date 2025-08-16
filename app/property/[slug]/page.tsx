"use client";

import { useState } from "react";

type Review = {
  id: number;
  name: string;
  comment: string;
};

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, name: "Rowan", comment: "Great place to stay!" },
    { id: 2, name: "Nadine", comment: "Very clean and comfortable." },
  ]);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: reviews.length + 1,
      name,
      comment,
    };

    setReviews([...reviews, newReview]);
    setName("");
    setComment("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Flex Living Reviews</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-4 rounded-2xl shadow mb-8"
      >
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          rows={3}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {/* Reviews List */}
      <div className="w-full max-w-md">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-4 rounded-2xl shadow mb-3"
          >
            <p className="font-semibold">{review.name}</p>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
