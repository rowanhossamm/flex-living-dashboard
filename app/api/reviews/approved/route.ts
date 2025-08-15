import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const approvedFile = path.join(process.cwd(), "mock", "approved.json");

export async function GET(req: NextRequest) {
  let approvedIds: number[] = [];
  if (fs.existsSync(approvedFile)) {
    approvedIds = JSON.parse(fs.readFileSync(approvedFile, "utf-8"));
  }
  return NextResponse.json({ status: "success", result: approvedIds });
}

export async function POST(req: NextRequest) {
  const { id, approved: isApproved } = await req.json() as { id: number; approved: boolean };
  if (typeof id !== "number") {
    return NextResponse.json({ status: "error", message: "id must be a number" }, { status: 400 });
  }

  let approvedIds: number[] = [];
  if (fs.existsSync(approvedFile)) {
    approvedIds = JSON.parse(fs.readFileSync(approvedFile, "utf-8"));
  }

  if (isApproved && !approvedIds.includes(id)) approvedIds.push(id);
  if (!isApproved) approvedIds = approvedIds.filter(a => a !== id);

  fs.writeFileSync(approvedFile, JSON.stringify(approvedIds, null, 2));

  return NextResponse.json({ status: "success", result: approvedIds });
}
