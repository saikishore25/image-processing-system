
import axios from "axios";

const API = axios.create({
    baseURL: "https://1ysr4d39q5.execute-api.ap-south-2.amazonaws.com/api/images" || "http://localhost:5000/api/images",
    headers: {
        "Content-Type": "application/json"
    }
});


// 1. Generate presigned S3 upload URL
export const createUploadUrl = async (file) => {
    const response = await API.post("/upload-url", {
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size
    });

    return response.data;
};


// 2. Upload original image directly to S3
export const uploadImageToS3 = async (uploadUrl, file) => {
    const response = await axios.put(uploadUrl, file, {
        headers: {
            "Content-Type": file.type
        }
    });

    return response.data;
};


// 3. Confirm original image upload
export const completeUpload = async (imageId) => {
    const response = await API.post(
        `/${imageId}/complete-upload`
    );

    return response.data;
};


// 4. Start image processing
export const processImage = async (imageId) => {
    const response = await API.post(
        `/${imageId}/process`
    );

    return response.data;
};


// 5. Get all uploaded images
export const getAllImages = async () => {
    const response = await API.get("/");

    return response.data;
};


// 6. Get one image and all its variations
export const getImageById = async (imageId) => {
    const response = await API.get(`/${imageId}`);

    return response.data;
};


// 7. Get download URL for a particular variation
export const getImageDownloadUrl = async (imageId, variant) => {
    const response = await API.get(
        `/${imageId}/download/${variant}`
    );

    return response.data;
};


// 8. Delete image and all its variations
export const deleteImage = async (imageId) => {
    const response = await API.delete(`/${imageId}`);

    return response.data;
};
