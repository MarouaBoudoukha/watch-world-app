// pages/signin.tsx
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import Cookies from "js-cookie";

export default function SignIn() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleMiniKitVerify = useCallback(async () => {
    if (isVerifying) return; // Prevent multiple verification attempts

    setIsVerifying(true);
    const payload = {
      action: "signin",
      signal: "",
      verification_level: VerificationLevel.Orb,
    };

    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit is not installed.");
      setIsVerifying(false);
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
          credentials: "include", // Important: Include credentials
        });

        if (!res.ok) {
          throw new Error("Sign in verification failed on backend");
        }

        const data = await res.json();
        Cookies.set("userId", data.userId);

        // Check if user has a role set
        const role = Cookies.get("role");
        if (role) {
          router.push("/");
        } else {
          router.push("/role-selection");
        }
      } else {
        console.error("MiniKit sign in error:", finalPayload);
        setIsVerifying(false);
      }
    } catch (error) {
      console.error("Error during MiniKit sign in verification:", error);
      setIsVerifying(false);
    }
  }, [router, isVerifying]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex flex-col items-center justify-center p-8">
      <img src="/watch_logo.png" alt="App Logo" className="w-70 h-70 mb-6" />
      <h1 className="text-gray-900 text-2xl font-semibold text-center mb-4">
        Watch to Earn
      </h1>
      <button
        onClick={handleMiniKitVerify}
        disabled={isVerifying}
        className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition py-3 px-10 rounded-full text-lg shadow-xl uppercase tracking-wide ${
          isVerifying ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isVerifying ? 'Verifying...' : 'Verify with World ID'}
      </button>
      {isVerifying && (
        <p className="mt-4 text-gray-600">Please complete the verification in your World ID app...</p>
      )}
    </div>
  );
}
