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
      imageUrl: "https://miniapp-dailycheckin.vercel.app/opengraph-image.png",
      buttonTitle: "Check In Now",
      splashImageUrl: "https://miniapp-dailycheckin.vercel.app/icon.png",
      splashBackgroundColor: "#0f172a"
    }
  };

  return NextResponse.json(config);
}