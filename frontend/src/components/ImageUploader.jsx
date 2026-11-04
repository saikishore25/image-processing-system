
const ImageUploader = ({ file, onFileSelect, onUpload, loading }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Upload Image
      </h2>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        className="block w-full cursor-pointer rounded-lg border border-gray-300 p-3 text-sm"
      />

      {file && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">
            {file.name}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      )}

      <button
        onClick={onUpload}
        disabled={!file || loading}
        className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default ImageUploader;
