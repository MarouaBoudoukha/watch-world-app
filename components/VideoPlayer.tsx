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

interface VideoPlayerProps {
  src: string;
  onEnded: () => void;
}

export default function VideoPlayer({ src, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({ threshold: 0.5 });
  const [isMuted, setIsMuted] = useState(true);

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
    <div ref={ref} className="relative h-screen w-full">
      <video
        ref={videoRef}
        src={src}
        onEnded={onEnded}
        controls={false}
        className="w-full h-full object-cover"
        playsInline
      />
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded"
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
}
