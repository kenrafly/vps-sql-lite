"use client";

import { useState } from "react";
import Image from "next/image";

interface UploadResponse {
  success: boolean;
  message: string;
  image?: {
    id: number;
    title: string;
    image_path: string;
    created_at: string;
  };
  error?: string;
}

interface UploadFormProps {
  onUploadSuccess?: () => void;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<UploadResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !image) {
      setResponse({
        success: false,
        message: "",
        error: "Please provide both title and image",
      });
      return;
    }

    setUploading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: UploadResponse = await res.json();
      setResponse(data);

      if (data.success) {
        setTitle("");
        setImage(null);
        // Reset the file input
        const fileInput = document.getElementById("image") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Call the callback to refresh the gallery
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    } catch {
      setResponse({
        success: false,
        message: "",
        error: "Network error occurred",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setResponse({
          success: false,
          message: "",
          error: "Please select a valid image file",
        });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setResponse({
          success: false,
          message: "",
          error: "Image must be smaller than 10MB",
        });
        return;
      }

      setImage(file);
      setResponse(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Upload Image
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter image title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          {image && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {image.name} ({(image.size / 1024 / 1024).toFixed(2)}{" "}
              MB)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading || !title || !image}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      {/* Response Messages */}
      {response && (
        <div
          className={`mt-4 p-4 rounded-md ${
            response.success
              ? "bg-green-100 border border-green-400"
              : "bg-red-100 border border-red-400"
          }`}
        >
          {response.success ? (
            <div className="text-green-700">
              <p className="font-semibold">✅ {response.message}</p>
              {response.image && (
                <div className="mt-2">
                  <p className="text-sm">Title: {response.image.title}</p>
                  <p className="text-sm">
                    Uploaded:{" "}
                    {new Date(response.image.created_at).toLocaleString()}
                  </p>
                  <Image
                    src={response.image.image_path}
                    alt={response.image.title}
                    width={200}
                    height={128}
                    className="mt-2 max-w-full h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-700">❌ {response.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
