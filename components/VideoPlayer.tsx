// components/VideoPlayer.tsx
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