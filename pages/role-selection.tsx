//pages/role-selection.tsx
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaUser, FaBuilding } from "react-icons/fa";

export default function RoleSelection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = async (selectedRole: string) => {
    setIsLoading(true);
    try {
      // Set role in cookies
      document.cookie = `role=${selectedRole}; path=/`;

      // Update role in database
      const response = await fetch("/api/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      if (selectedRole === "company") {
        router.push("/register-company");
      } else {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error selecting role:", error);
      toast.error("Failed to select role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Watch World Logo"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Role</h1>
          <p className="text-gray-400">Select how you want to use Watch World</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect("user")}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 flex items-center justify-center space-x-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
          >
            <div className="bg-white/10 p-3 rounded-lg">
              <FaUser className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Watch & Earn</h3>
              <p className="text-sm text-white/80">Watch videos and earn rewards</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("company")}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 flex items-center justify-center space-x-4 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
          >
            <div className="bg-white/10 p-3 rounded-lg">
              <FaBuilding className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Create Content</h3>
              <p className="text-sm text-white/80">Upload videos and reward viewers</p>
            </div>
          </button>
        </div>

        {isLoading && (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
}