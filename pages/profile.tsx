// pages/profile.tsx
/*
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
*/
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import BottomNav from "../components/BottomNav";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Profile() {
  const router = useRouter();
  const userId = Cookies.get("userId");
  const [actions, setActions] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [metrics, setMetrics] = useState({
    videosWatched: 0,
    rewardsClaimed: 0,
  });

  useEffect(() => {
    if (!userId) {
      router.push("/signin");
    } else {
      fetch("/api/get-user-actions")
        .then((res) => res.json())
        .then((data) => {
          setActions(data);
          const total = data.reduce(
            (sum: number, action: any) => sum + (action.reward || 0),
            0
          );
          setTotalEarnings(total);
          setMetrics({
            videosWatched: data.length,
            rewardsClaimed: data.filter((a) => a.reward > 0).length,
          });
        });
    }
  }, [userId, router]);

  // Dummy data for graph: earnings over time (or per video)
  // For demo purposes, we use the index as the time axis.
  const chartData = {
    labels: actions.map((_, index) => `Video ${index + 1}`),
    datasets: [
      {
        label: "Earnings per Video (WID)",
        data: actions.map((action) => action.reward || 0),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Earnings per Video",
      },
    },
  };

  if (!userId)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Redirecting to sign in...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative pb-16">
      <header className="py-6 text-center border-b border-gray-700">
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 mt-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-md text-center">
            <p className="text-sm text-gray-400">Total Earnings</p>
            <p className="text-2xl font-bold">{totalEarnings.toFixed(2)} WID</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md text-center">
            <p className="text-sm text-gray-400">Videos Watched</p>
            <p className="text-2xl font-bold">{metrics.videosWatched}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md text-center">
            <p className="text-sm text-gray-400">Rewards Claimed</p>
            <p className="text-2xl font-bold">{metrics.rewardsClaimed}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md text-center">
            <p className="text-sm text-gray-400">Average per Video</p>
            <p className="text-2xl font-bold">
              {metrics.videosWatched > 0
                ? (totalEarnings / metrics.videosWatched).toFixed(2)
                : 0}{" "}
              WID
            </p>
          </div>
        </div>

        <div className="mb-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Claimed Rewards</h2>
          <ul className="space-y-3">
            {actions.map((action: any, index: number) => (
              <li
                key={index}
                className="p-3 bg-gray-700 rounded-md flex justify-between"
              >
                <span>Video {action.signal}</span>
                <span>{action.reward.toFixed(2)} WID</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
