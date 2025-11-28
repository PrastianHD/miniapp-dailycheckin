import { NextResponse } from "next/server";

export async function GET() {
  // Redirect ke Hosted Manifest resmi Anda
  return NextResponse.redirect(
    "https://api.farcaster.xyz/miniapps/hosted-manifest/019ac8c4-c3c3-38bd-594b-df12d882bbe1", 
    { status: 307 }
  );
}