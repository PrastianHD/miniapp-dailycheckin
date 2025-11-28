import { NextResponse } from "next/server";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const config = {
    accountAssociation: {
      header: "eyJfid...", // Nanti kita bahas cara generate ini (Domain Signing)
      payload: "eyJkb21haW4iOiIx...",
      signature: "MHhl..."
    },
    frame: {
      version: "1",
      name: "Daily Star Check-In",
      iconUrl: `${appUrl}/icon.png`, // Pastikan ada icon.png di folder public
      homeUrl: appUrl,
      imageUrl: `${appUrl}/opengraph-image.png`, // Gambar preview saat link dibagikan
      buttonTitle: "Check In Now",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#0f172a",
      webhookUrl: `${appUrl}/api/webhook`, // Opsional
    },
  };

  return NextResponse.json(config);
}