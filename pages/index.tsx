// pages/index.tsx
/*
import { useState, useEffect } from "react";
import VideoPlayer from "../components/VideoPlayer";
import BottomNav from "../components/BottomNav";
import VerifyBlock from "../components/VerifyBlock";

const videos = [
  { id: "1", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: "2", url: "https://www.w3schools.com/html/movie.mp4" },
  { id: "3", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
];

export default function Home() {
  // Remove the cookie check to force verification every time
  const [isVerified, setIsVerified] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState<Record<string, boolean>>({});
  const [totalEarnings, setTotalEarnings] = useState(0);

  // Update earnings once verified
  useEffect(() => {
    if (isVerified) {
      fetch("/api/get-earnings")
        .then((res) => res.json())
        .then((data) => setTotalEarnings(data.total));
    }
  }, [isVerified]);

  const handleVideoEnded = (videoId: string) => {
    setWatchedVideos((prev) => ({ ...prev, [videoId]: true }));
  };

  const handleClaimReward = async (videoId: string) => {
    try {
      const res = await fetch("/api/verify-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proof: "dummy-proof",
          action: "watch_video",
          signal: videoId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Reward claimed: ${data.reward} WID`);
        // Refresh earnings
        const earningsRes = await fetch("/api/get-earnings");
        const earningsData = await earningsRes.json();
        setTotalEarnings(earningsData.total);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error claiming reward.");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      {isVerified ? (
        <>
          <header className="fixed top-0 left-0 right-0 z-10 p-4 bg-black bg-opacity-80 flex justify-between items-center">
            <h1 className="text-xl font-bold">Video Feed</h1>
            <div className="text-sm">Earnings: {totalEarnings} WID</div>
          </header>

          <div className="mt-16">
            {videos.map((video) => (
              <div key={video.id} className="relative">
                <VideoPlayer src={video.url} onEnded={() => handleVideoEnded(video.id)} />
                {watchedVideos[video.id] && (
                  <div className="absolute bottom-1/4 left-4 z-20 bg-black bg-opacity-70 p-2 rounded-lg">
                    <button
                      onClick={() => handleClaimReward(video.id)}
                      className="px-4 py-2 text-lg bg-blue-500 rounded hover:bg-blue-600 transition"
                    >
                      Claim Reward
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <BottomNav />
        </>
      ) : (
        <div className="text-center p-8">
          <h2 className="text-2xl mb-4">
            Please verify your identity with World ID to access the video feed
          </h2>
          <VerifyBlock onVerified={() => setIsVerified(true)} />
        </div>
      )}
    </div>
  );
}
*/

// pages/index.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import VideoPlayer from "../components/VideoPlayer";
import BottomNav from "../components/BottomNav";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

// Added a "reward" field for each video.
/*const videos = [
    { id: "1", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", reward: 0.5 },
    { id: "2", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", reward: 1.0 },
    { id: "3", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", reward: 0.75 },
    { id: "4", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", reward: 0.8 },
    { id: "5", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", reward: 1.2 },
    { id: "6", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", reward: 0.6 },
    { id: "7", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", reward: 1.5 },
    { id: "8", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", reward: 0.9 },
    { id: "9", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", reward: 1.0 },
  ];
*/

  export default function Home() {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);
    const [completedVideos, setCompletedVideos] = useState<Record<string, boolean>>({});
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [videos, setVideos] = useState<any[]>([]);

    useEffect(() => {
      const uid = Cookies.get("userId");
      if (!uid) {
        router.push("/signin");
      } else {
        setIsVerified(true);
        fetch("/api/get-earnings")
          .then((res) => res.json())
          .then((data) => setTotalEarnings(data.total));
        fetch("/api/recommendations")
          .then((res) => res.json())
          .then((data) => setVideos(data.videos || []));
      }
    }, [router]);

    const handleVideoEnded = (videoId: string) => {
      setCompletedVideos((prev) => ({ ...prev, [videoId]: true }));
    };

    const handleClaimReward = async (videoId: string) => {
      // Look up the specific reward amount from our videos array.
      const video = videos.find((v) => v.id === videoId);
      const reward = video?.reward || 0.01;

      try {
        const res = await fetch("/api/verify-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proof: "dummy-proof",
            action: "watch_video",
            signal: videoId,
            reward, // Pass the custom reward amount.
          }),
        });
        const data = await res.json();
        if (data.success) {
          alert(`Reward claimed: ${data.reward} WID`);
          const earningsRes = await fetch("/api/get-earnings");
          const earningsData = await earningsRes.json();
          setTotalEarnings(earningsData.total);
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error(error);
        alert("Error claiming reward.");
      }
    };

    if (!isVerified) return null; // Render nothing while redirecting

    return (
      <div className="relative bg-black overflow-hidden h-screen">
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
          <h1 className="text-white text-xl font-bold">WatchWorld</h1>
          <div className="text-white text-sm">Earnings: {totalEarnings} WLD</div>
        </header>

        <div className="h-full overflow-y-scroll snap-y snap-mandatory">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              className="snap-start relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <VideoPlayer src={video.url} onEnded={() => handleVideoEnded(video.id)} />
              {completedVideos[video.id] && (
                <motion.div
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <button
                    onClick={() => handleClaimReward(video.id)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition py-3 px-10 rounded-full text-lg shadow-xl uppercase tracking-wide"
                  >
                    Claim Reward ({video.reward} WLD)
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <BottomNav />
      </div>
    );
  }