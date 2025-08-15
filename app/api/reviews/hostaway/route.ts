import { NextResponse } from "next/server";
import { getMockReviews } from "@/lib/hostaway";

export async function GET() {
  try {
    const reviews = await getMockReviews();
    return NextResponse.json({ status: "success", result: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ status: "error", result: [] }, { status: 500 });
  }
}

