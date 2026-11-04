
import { useState } from "react";

import ImageUploader from "../components/image/ImageUploader";
import ImagePreview from "../components/image/ImagePreview";
import UploadStatus from "../components/image/UploadStatus";

import {
  generateUploadUrl,
  uploadToS3,
  generateDownloadUrl,
} from "../services/imageService";

const HomeScreen = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [statusType, setStatusType] = useState("info");

  // Handle image selection
  const handleFileSelect = (selectedFile) => {
    setImageUrl("");
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setMessage("Only JPEG, PNG and WEBP images are allowed");
      setStatusType("error");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setMessage("Image size must be below 10 MB");
      setStatusType("error");
      return;
    }

    setFile(selectedFile);
  };

  // Complete upload and download workflow
  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setImageUrl("");

      // STEP 1: Generate upload URL
      setMessage("Generating upload URL...");
      setStatusType("info");

      const uploadResult = await generateUploadUrl(file);

      const { imageId, key, uploadUrl } = uploadResult.data;

      // STEP 2: Upload image directly to S3
      setMessage("Uploading image to S3...");

      await uploadToS3(file, uploadUrl);

      // STEP 3: Generate download URL
      setMessage("Generating download URL...");

      const downloadResult = await generateDownloadUrl(
        imageId,
        key
      );

      const downloadUrl = downloadResult.data.downloadUrl;

      // STEP 4: Display image
      setImageUrl(downloadUrl);

      setMessage("Image uploaded successfully!");
      setStatusType("success");

    } catch (error) {
      console.error("Image upload error:", error);

      setMessage(error.message || "Something went wrong");
      setStatusType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Image Processing System
          </h1>

          <p className="mt-2 text-gray-500">
            Upload and retrieve images using AWS S3
          </p>
        </div>

        <div className="space-y-6">

          <ImageUploader
            file={file}
            onFileSelect={handleFileSelect}
            onUpload={handleUpload}
            loading={loading}
          />

          <UploadStatus
            message={message}
            type={statusType}
          />

          <ImagePreview imageUrl={imageUrl} />

        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
