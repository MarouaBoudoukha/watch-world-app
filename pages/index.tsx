// pages/index.tsx
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
