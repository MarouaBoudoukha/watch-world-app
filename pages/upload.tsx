// pages/upload.tsx
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useUser } from "../components/UserContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaUpload, FaTimes, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function Upload() {
  const { role } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (role !== "company") {
    router.push("/");
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error("Video file size must be less than 100MB");
        return;
      }
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const rewardAmount = parseFloat(reward);
    if (isNaN(rewardAmount) || rewardAmount <= 0 || rewardAmount > 1000) {
      toast.error("Please enter a valid reward amount between 0 and 1000 WLD");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("reward", rewardAmount.toString());

    try {
      console.log("Starting upload...");
      console.log("Form data:", {
        title,
        description,
        reward: rewardAmount,
        videoFile: videoFile.name,
        videoSize: videoFile.size
      });

      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("Upload response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Upload failed:", errorData);
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      console.log("Upload response data:", data);

      if (data.success) {
        toast.success("Video uploaded successfully!");
        router.push("/");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Error uploading video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Upload Video</h1>
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-white hover:text-gray-300"
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label htmlFor="reward" className="block text-sm font-medium mb-2">
                Reward (WLD)
              </label>
              <Input
                type="number"
                id="reward"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="Enter reward amount"
                step="0.001"
                min="0"
                max="1000"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Enter a value between 0 and 1000 WLD
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Video
              </label>
              <div className="relative">
                {videoPreview ? (
                  <div className="relative">
                    <video
                      src={videoPreview}
                      className="w-full rounded-lg"
                      controls
                    />
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-400">Click to select video</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Max file size: 100MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg flex items-center justify-center"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              "Upload Video"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}