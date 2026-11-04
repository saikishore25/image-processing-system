
const ImagePreview = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Uploaded Image
      </h2>

      <img
        src={imageUrl}
        alt="Uploaded image"
        className="mx-auto max-h-96 max-w-full rounded-lg object-contain"
      />
    </div>
  );
};

export default ImagePreview;
