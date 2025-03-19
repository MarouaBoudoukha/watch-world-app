//components/MiniKitProvider.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import config from "../miniKit.config";

interface MiniKitProviderProps {
  children: ReactNode;
}

export default function MiniKitProvider({ children }: MiniKitProviderProps) {
  useEffect(() => {
    // Cast config to any because MiniKit.install expects a string per the type definitions.
    MiniKit.install(config as any);
  }, []);

  return <>{children}</>;
}
