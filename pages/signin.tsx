// pages/signin.tsx
/*
import { useCallback } from "react";
import { useRouter } from "next/router";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import Cookies from "js-cookie";

export default function SignIn() {
  const router = useRouter();

  const handleMiniKitVerify = useCallback(async () => {
    const payload = {
      action: "signin",
      signal: "",
      verification_level: VerificationLevel.Orb,
    };

    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit is not installed.");
      return;
    }
    try {
      const miniKitResult = await MiniKit.commandsAsync.verify(payload);
      const { finalPayload } = miniKitResult;
      if (finalPayload.status === "success") {
        const res = await fetch("/api/verify-signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ finalPayload }),
        });
        if (!res.ok) {
          console.error("Sign in verification failed on backend");
          return;
        }
        const data = await res.json();
        Cookies.set("userId", data.userId);
        router.push("/");
      } else {
        console.error("MiniKit sign in error:", finalPayload);
      }
    } catch (error) {
      console.error("Error during MiniKit sign in verification:", error);
    }
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl mb-6">Sign in with World ID</h1>
      <button
        onClick={handleMiniKitVerify}
        className="px-6 py-3 bg-blue-500 rounded text-lg hover:bg-blue-600 transition"
      >
        Sign in with World ID
      </button>
    </div>
  );
}
*/
import { useCallback } from "react";
import { useRouter } from "next/router";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import Cookies from "js-cookie";

export default function SignIn() {
  const router = useRouter();

  const handleMiniKitVerify = useCallback(async () => {
    const payload = {
      action: "signin",
      signal: "",
      verification_level: VerificationLevel.Orb,
    };

    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit is not installed.");
      return;
    }
    try {
      const miniKitResult = await MiniKit.commandsAsync.verify(payload);
      const { finalPayload } = miniKitResult;
      if (finalPayload.status === "success") {
        const res = await fetch("/api/verify-signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ finalPayload }),
        });
        if (!res.ok) {
          console.error("Sign in verification failed on backend");
          return;
        }
        const data = await res.json();
        Cookies.set("userId", data.userId);
        router.push("/");
      } else {
        console.error("MiniKit sign in error:", finalPayload);
      }
    } catch (error) {
      console.error("Error during MiniKit sign in verification:", error);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex flex-col items-center justify-center p-8">
      <img src="/watch_logo.png" alt="App Logo" className="w-70 h-70 mb-6" />
      <h1 className="text-gray-900 text-2xl font-semibold text-center mb-4">
        Welcome to Watch
      </h1>
      <button
        onClick={handleMiniKitVerify}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition py-3 px-10 rounded-full text-lg shadow-xl uppercase tracking-wide"
      >
        Verify with World ID
      </button>
    </div>
  );
}
