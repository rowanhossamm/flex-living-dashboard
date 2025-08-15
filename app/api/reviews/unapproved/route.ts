import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const filePath = path.join(process.cwd(), "mock", "approved.json");
    let approvedIds: number[] = [];

    if (fs.existsSync(filePath)) {
      approvedIds = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    approvedIds = approvedIds.filter((approvedId) => approvedId !== id);
    fs.writeFileSync(filePath, JSON.stringify(approvedIds, null, 2));

    return NextResponse.json({ status: "success", approvedIds });
  } catch (error) {
    console.error("Error unapproving review:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to unapprove review" },
      { status: 500 }
    );
  }
}
