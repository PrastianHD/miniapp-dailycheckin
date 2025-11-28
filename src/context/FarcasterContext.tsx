'use client';

import { useEffect, useState, createContext, useContext } from "react";
// PERBAIKAN: Import 'Context.FrameContext' (jika namespace) atau 'Context' saja.
// Pada v0.1.12, biasanya cukup import type { Context }
import sdk, { type Context } from "@farcaster/frame-sdk";

// Definisikan tipe untuk Context Value
interface FarcasterContextType {
  // Ganti FrameContext menjadi Context
  context: Context | undefined;
  isSDKLoaded: boolean;
}

// Buat React Context
const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined);

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  // Ganti FrameContext menjadi Context
  const [context, setContext] = useState<Context>();

  useEffect(() => {
    const load = async () => {
      // Ambil context dari SDK
      const ctx = await sdk.context;
      setContext(ctx);
      
      // Beritahu Farcaster client bahwa app siap
      sdk.actions.ready({});
    };

    // Cek apakah SDK ada (berjalan di dalam frame)
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

// Custom Hook untuk mempermudah penggunaan di komponen lain
export function useFarcaster() {
  return useContext(FarcasterContext);
}