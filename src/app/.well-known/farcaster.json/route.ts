import { NextResponse } from "next/server";

export async function GET() {
  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjIzNzYyMiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDMwNTFDNDdDODgyQ0ZBOURhNmMzMjg1OUMwMzZmNmI0MTVmMDhFMTAifQ",
      payload: "eyJkb21haW4iOiJtaW5pYXBwLWRhaWx5Y2hlY2tpbi52ZXJjZWwuYXBwIn0",
      signature: "3c0kHk+C36P+AAK+haoPu0lgS7KlwLwv60Hy0npSe2N/UPo343Da8ZETD008avwC9jNMieCJ5oC0/mpW4lahLBs="
    },
    frame: {
      version: "1",
      name: "Daily Star",
      iconUrl: "https://miniapp-dailycheckin.vercel.app/icon.png",
      homeUrl: "https://miniapp-dailycheckin.vercel.app",
      imageUrl: "https://miniapp-dailycheckin.vercel.app/image.png",
      buttonTitle: "Check In Now",
      splashImageUrl: "https://miniapp-dailycheckin.vercel.app/icon.png",
      splashBackgroundColor: "#0f172a",

      subtitle: "Build streaks, earn rewards.",
      description: "Daily checkin app. Maintain your streak to earn $STAR tokens airdropped directly to your wallet.",
      primaryCategory: "productivity",
      tags: [
        "checkin",
        "base",
        "rewards",
        "streak",
        "token"
      ],
      tagline: "Checkin and earn STAR tokens!",
      ogTitle: "Daily Star Check-In",
      ogDescription: "Join the daily streak on Base and earn crypto rewards!",
      castShareUrl: "https://warpcast.com/~/compose?text=I%20just%20checked%20in%20on%20Daily%20Star!%20%2B1%20Streak%20%F0%9F%94%A5&embeds[]=https://miniapp-dailycheckin.vercel.app"
    }
  };

  return NextResponse.json(config);
}