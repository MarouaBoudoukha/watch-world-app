// components/VideoPlayer.tsx
/*
import { useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface VideoPlayerProps {
  src: string;
  onEnded: () => void;
}

export default function VideoPlayer({ src, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play().catch((error) => {
          console.error("Auto-play failed:", error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView]);

  return (
    <div ref={ref} style={{ margin: 0, height: "100vh", overflow: "hidden" }}>
      <video
        ref={videoRef}
        src={src}
        onEnded={onEnded}
        controls
        width="100%"
        style={{ objectFit: "cover", height: "100%" }}
        playsInline
        muted
      />
    </div>
  );
}
*/

// components/VideoPlayer.tsx
import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FaCoins, FaVolumeMute, FaVolumeUp  } from "react-icons/fa";

interface VideoPlayerProps {
  src: string;
  onEnded: () => void;
  onClaimReward: () => void;
}

export default function VideoPlayer({ src, onEnded, onClaimReward }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Combine the inView ref with the video element's ref
  const setRefs = (node: HTMLDivElement) => {
    inViewRef(node);
  };

  // Update the video element's muted property whenever isMuted changes.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  // Play/pause the video based on whether it is in view.
  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play().catch((error) => {
          console.error("Auto-play failed:", error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView]);

  const handleEnded = () => {
    setIsCompleted(true);
    onEnded();
  };

  const handleClaim = () => {
    onClaimReward();
    toast.success("Reward claimed successfully!", {
      style: { background: "#1a1a1a", color: "#fff" },
    });
  };

  // Toggle mute state and re-trigger play if unmuting.
  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const newMuted = !prevMuted;
      if (videoRef.current && prevMuted) {
        videoRef.current.play().catch((error) => {
          console.error("Play after unmute failed:", error);
        });
      }
      return newMuted;
    });
  };

  return (
    <div ref={setRefs} className="relative h-screen w-full">
      <video
        ref={videoRef}
        src={src}
        onEnded={handleEnded}
        controls={false}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 flex items-center justify-center bg-gray-800 bg-opacity-75 rounded-full p-3 shadow-lg transition-transform hover:scale-105"
      >
        {isMuted ? <FaVolumeMute className="h-6 w-6 text-white" /> : <FaVolumeUp className="h-6 w-6 text-white" />}
      </button>
      {isCompleted && (
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={handleClaim}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-8 rounded-full text-lg shadow-lg flex items-center space-x-2"
          >
            <FaCoins />
            <span>Claim Reward</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
}