import UploadForm from "@/components/UploadForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Upload App
          </h1>
          <p className="text-lg text-gray-600">
            Upload images with titles and store them in PostgreSQL database
          </p>
        </div>

        <UploadForm />

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                File Upload
              </h3>
              <p className="text-gray-600">
                Upload images up to 10MB with automatic validation
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                PostgreSQL Storage
              </h3>
              <p className="text-gray-600">
                Store image metadata in PostgreSQL database
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Real-time Feedback
              </h3>
              <p className="text-gray-600">
                Get instant success/error messages after upload
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
