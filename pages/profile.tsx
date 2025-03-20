// pages/profile.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import BottomNav from "../components/BottomNav";
import { FaCheckCircle, FaUpload, FaChartLine, FaCoins } from "react-icons/fa";
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
  const [userInfo, setUserInfo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (!userId) {
      router.push("/signin");
      return;
    }

    // Fetch user info
    fetch("/api/get-user-info", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUserInfo(data);
        setIsLoading(false);
      });

    // Fetch videos if company profile
    if (userInfo?.role === "company") {
      fetch("/api/get-company-videos", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setVideos(data.videos));
    }

    // Fetch earnings if user profile
    if (userInfo?.role === "user") {
      fetch("/api/get-earnings", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setEarnings(data.earnings));
    }
  }, [router, userInfo?.role]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  const isCompany = userInfo.role === "company";

  const chartData = {
    labels: earnings?.map((earning) => new Date(earning.created_at).toLocaleDateString()) || [],
    datasets: [
      {
        label: "Earnings (WLD)",
        data: earnings?.map((earning) => earning.reward) || [],
        borderColor: "rgb(59, 130, 246)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-16">
      <header className="py-6 text-center border-b border-gray-700">
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 mt-6">
        {/* Profile Header */}
        <div className="flex items-center justify-center mb-6">
          <img
            src={isCompany ? userInfo.logoUrl : userInfo.profilePictureUrl}
            alt={isCompany ? "Company Logo" : "Profile"}
            className="w-24 h-24 rounded-full border-2 border-blue-500"
          />
          <div className="ml-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">
                {isCompany ? userInfo.companyName : userInfo.username}
              </h2>
              <FaCheckCircle className="text-blue-500 ml-2" />
            </div>
            <p className="text-sm text-gray-400">
              {isCompany ? "Verified Company" : "Verified by World"}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {isCompany ? (
            <>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <FaChartLine className="text-blue-500 text-2xl mx-auto mb-2" />
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-xl font-bold">{userInfo.totalViews || 0}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <FaCoins className="text-yellow-500 text-2xl mx-auto mb-2" />
                <p className="text-sm text-gray-400">Budget</p>
                <p className="text-xl font-bold">{userInfo.budget} WLD</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <FaCoins className="text-yellow-500 text-2xl mx-auto mb-2" />
                <p className="text-sm text-gray-400">Total Earnings</p>
                <p className="text-xl font-bold">{userInfo.totalEarnings} WLD</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <FaChartLine className="text-blue-500 text-2xl mx-auto mb-2" />
                <p className="text-sm text-gray-400">Videos Watched</p>
                <p className="text-xl font-bold">{userInfo.videosWatched || 0}</p>
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {isCompany ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Your Videos</h3>
                <button
                  onClick={() => router.push("/upload")}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                >
                  <FaUpload className="mr-2" />
                  Upload Video
                </button>
              </div>
              <div className="space-y-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-800 rounded-lg overflow-hidden"
                  >
                    <video
                      src={video.url}
                      className="w-full h-48 object-cover"
                      controls
                    />
                    <div className="p-4">
                      <h4 className="font-bold">{video.title}</h4>
                      <p className="text-sm text-gray-400">{video.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          {video.views} views
                        </span>
                        <span className="text-sm text-blue-400">
                          {video.reward} WLD reward
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-4">Earnings History</h3>
              <div className="bg-gray-800 p-4 rounded-lg">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}