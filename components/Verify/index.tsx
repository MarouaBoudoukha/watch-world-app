// components/verify/index.tsx
"use client";

import { useState, useCallback } from "react";
//import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";

import {
  MiniKit,
  VerificationLevel,
  MiniAppVerifyActionErrorPayload,
  MiniAppVerifyActionSuccessPayload,
  IVerifyResponse,
} from "@worldcoin/minikit-js";
import Cookies from "js-cookie";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel;
};

const verifyPayload: VerifyCommandInput = {
  action: "signin", // this action can be customized
  signal: "",
  verification_level: VerificationLevel.Orb,
};

export default function VerifyBlock({ onVerified }: { onVerified?: () => void }) {
  const [handleVerifyResponse, setHandleVerifyResponse] = useState<
    MiniAppVerifyActionErrorPayload | MiniAppVerifyActionSuccessPayload | IVerifyResponse | null
  >(null);
  const router = useRouter();

  const handleMiniKitVerify = useCallback(async () => {
    console.log("Starting verification with MiniKit");

    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit is not installed.");
      return null;
    }
    console.log("MiniKit is installed.");
    console.log("Sending verify command with payload:", verifyPayload);

    try {
      const miniKitResult = await MiniKit.commandsAsync.verify(verifyPayload);
      console.log("Received raw response:", miniKitResult);

      const { finalPayload } = miniKitResult;
      console.log("Final payload:", finalPayload);

      if (finalPayload.status === "error") {
        console.log("Error during verification:", finalPayload);
        setHandleVerifyResponse(finalPayload);
        return finalPayload;
      }

      if (finalPayload.status === "success") {
        console.log("Verification successful. Setting cookie and notifying parent.");
        const userId = finalPayload.nullifier_hash || "dummyUserId";
        Cookies.set("userId", userId);
        setHandleVerifyResponse(finalPayload);
        if (onVerified) {
          onVerified();
        }
        return finalPayload;
      }

      console.log("Unknown status in finalPayload:", finalPayload);
      setHandleVerifyResponse(finalPayload);
      return finalPayload;
    } catch (error) {
      console.error("Error during MiniKit verification:", error);
      return null;
    }
  }, [router, onVerified]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <Button
        variant="primary"
        size="lg"
        onClick={handleMiniKitVerify}
        style={{
          backgroundColor: "#222",
          borderColor: "#444",
          color: "#fff",
          padding: "1rem 2rem",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Sign in with World ID
      </Button>
      {handleVerifyResponse && (handleVerifyResponse).status === "error" && (
        <p style={{ color: "red" }}>Verification failed. Please try again.</p>
      )}
    </div>
  );
}
