// pages/upload.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "../components/UserContext";

export default function Upload() {
  const { role } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  if (role !== "company") {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("reward", reward);

    try {
      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("Video uploaded successfully!");
        router.push("/");
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading video.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md p-2"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="reward" className="block text-sm font-medium">Reward (WLD)</label>
          <input
            type="number"
            id="reward"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md p-2"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="video" className="block text-sm font-medium">Video File</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Upload
        </button>
      </form>
    </div>
  );
}