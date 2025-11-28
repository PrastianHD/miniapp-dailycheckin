'use client';

import { useEffect, useState, createContext, useContext } from "react";
import sdk from "@farcaster/frame-sdk";

// SOLUSI UTAMA: 
// Kita "ambil" tipe data langsung dari sdk.context menggunakan TypeScript inference.
// Ini otomatis mendeteksi tipe yang benar (apakah FrameContext, MiniAppContext, dll).
type FrameContextType = Awaited<typeof sdk.context>;

interface FarcasterContextType {
  context: FrameContextType | undefined;
  isSDKLoaded: boolean;
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined);

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContextType>();

  useEffect(() => {
    const load = async () => {
      // Beritahu Farcaster client bahwa app siap
      sdk.actions.ready({});
      const ctx = await sdk.context;
      setContext(ctx);
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  return (
    <FarcasterContext.Provider value={{ context, isSDKLoaded }}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  return useContext(FarcasterContext);
}