import ImageGallery from "@/components/ImageGallery";
import Link from "next/link";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Image Gallery
            </h1>
            <p className="text-lg text-gray-600">Browse all uploaded images</p>
          </div>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Upload New Image
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <ImageGallery />
        </div>
      </div>
    </div>
  );
}
