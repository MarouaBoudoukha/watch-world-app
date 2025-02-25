// pages/profile.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const router = useRouter();
  const userId = Cookies.get("userId");
  const [actions, setActions] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    if (!userId) {
      router.push("/signin");
    } else {
      fetch("/api/get-user-actions")
        .then((res) => res.json())
        .then((data) => {
          setActions(data);
          const total = data.reduce(
            (sum: number, action: any) => sum + (action.reward || 0.1),
            0
          );
          setTotalEarnings(total);
        });
    }
  }, [userId, router]);

  if (!userId) return <div>Redirecting to sign in...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-20">
      <header className="fixed top-0 left-0 right-0 z-10 p-4 bg-black bg-opacity-90 text-center">
        <h1 className="text-2xl font-bold">Profile</h1>
      </header>

      <div className="mt-16 max-w-xl mx-auto p-4">
        <p className="mb-4">
          <span className="font-semibold">User ID:</span> {userId}
        </p>
        <h2 className="text-xl font-semibold mb-2">Claimed Rewards</h2>
        <ul className="mb-4">
          {actions.map((action: any, index: number) => (
            <li key={index} className="mb-2">
              Video {action.signal}: {action.reward || 0.1} WID
            </li>
          ))}
        </ul>
        <p className="font-semibold">
          Total Earnings: {totalEarnings.toFixed(1)} WID
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
        >
          Back to Feed
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
