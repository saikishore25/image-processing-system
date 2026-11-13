import express from "express";

import {
    createUploadUrl,
    completeUpload,
    processImage,
    getAllImages,
    getImageById,
    downloadImage,
    deleteImage
} from "../controllers/imageControllers.js";

const router = express.Router();

// Upload
router.post("/upload-url", createUploadUrl);
router.post("/:imageId/complete-upload", completeUpload);

// Processing
router.post("/:imageId/process", processImage);

// Retrieve images
router.get("/", getAllImages);
router.get("/:imageId", getImageById);

// Download a specific variation
router.get("/:imageId/download/:variant", downloadImage);

// Delete
router.delete("/:imageId", deleteImage);

export default router;