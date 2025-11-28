import type { Metadata } from "next";
import { headers } from 'next/headers';
import './globals.css';
import ContextProvider from '@/context';
import FarcasterProvider from '@/context/FarcasterContext';

const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Daily Star Check-In",
  description: "Build your streak and earn STAR tokens daily!",
  openGraph: {
    title: "Daily Star Check-In",
    description: "Build your streak and earn STAR tokens daily!",
    url: appUrl,
    siteName: "Daily Star",
    images: [
      {
        url: `${appUrl}/opengraph-image.png`, // Buat gambar ini di folder public
        width: 1200,
        height: 800,
        alt: "Daily Star Preview",
      },
    ],
  },
  other: {
    // Properti khusus Frame v2
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/opengraph-image.png`,
      button: {
        title: "Check In Now",
        action: {
          type: "launch_frame",
          name: "Daily Star",
          url: appUrl,
          splashImageUrl: `${appUrl}/splash.png`,
          splashBackgroundColor: "#0f172a",
        },
      },
    }),
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get('cookie');

  return (
    <html lang="en">
      <body>
        {/* --- BACKGROUND LAYERS --- */}
        <div className="space-bg"></div> {/* Nebula Gradient Bergerak */}
        <div className="stars"></div>    {/* Bintang Berkelip */}
        <div className="dust"></div>     {/* Debu Angkasa Melayang */}
        
        <FarcasterProvider>
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </FarcasterProvider>
      </body>
    </html>
  );
}
