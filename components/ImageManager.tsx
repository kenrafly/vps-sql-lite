"use client";

import { useState } from "react";
import UploadForm from "./UploadForm";
import ImageGallery from "./ImageGallery";

export default function ImageManager() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger a refresh of the gallery by changing the key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      {/* Upload Section */}
      <div className="max-w-md mx-auto mb-16">
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Gallery Section */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <ImageGallery key={refreshKey} />
      </div>
    </>
  );
}
