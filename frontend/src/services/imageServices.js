
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/images";

// Helper to handle backend responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// STEP 1: Request pre-signed PUT URL from backend
export const generateUploadUrl = async (file) => {
  const response = await fetch(`${API_BASE_URL}/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
    }),
  });

  return handleResponse(response);
};

// STEP 2: Upload actual image directly to S3
export const uploadToS3 = async (file, uploadUrl) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image to S3");
  }

  return true;
};

// STEP 3: Request pre-signed GET URL from backend
export const generateDownloadUrl = async (imageId, key) => {
  const params = new URLSearchParams({ key });

  const response = await fetch(
    `${API_BASE_URL}/${imageId}/download?${params.toString()}`
  );

  return handleResponse(response);
};
