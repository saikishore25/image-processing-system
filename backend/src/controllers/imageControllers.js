
import {
    createImageUpload,
    confirmImageUpload,
    startImageProcessing,
    fetchAllImages,
    fetchImageById,
    createImageDownloadUrl,
    removeImage
} from "../services/imageServices.js";


export const createUploadUrl = async (req, res, next) => {
    try {
        const { fileName, contentType, fileSize } = req.body;

        console.log("Req Body For Upload URL: ", req.body)
        if (!fileName || !contentType || !fileSize) {
            return res.status(400).json({
                message: "fileName, contentType and fileSize are required"
            });
        }

        if (!contentType.startsWith("image/")) {
            return res.status(400).json({
                message: "Only image files are allowed"
            });
        }

        const result = await createImageUpload({
            fileName,
            contentType,
            fileSize
        });

        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};


export const completeUpload = async (req, res, next) => {
    try {
        const { imageId } = req.params;

        const result = await confirmImageUpload(imageId);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


export const processImage = async (req, res, next) => {
    try {
        const { imageId } = req.params;

        // Start processing without making the HTTP request
        // wait for all six transformations.
        await startImageProcessing(imageId);

        return res.status(202).json({
            message: "Image processing started",
            imageId,
            status: "PROCESSING"
        });
    } catch (error) {
        next(error);
    }
};


// Get all images
export const getAllImages = async (req, res, next) => {
    try {
        const images = await fetchAllImages();

        return res.status(200).json({
            count: images.length,
            images
        });
    } catch (error) {
        next(error);
    }
};


// Get one image and its variants
export const getImageById = async (req, res, next) => {
    try {
        const { imageId } = req.params;

        const image = await fetchImageById(imageId);

        return res.status(200).json(image);
    } catch (error) {
        next(error);
    }
};


// Generate download URL for a particular variant
export const downloadImage = async (req, res, next) => {
    try {
        const { imageId, variant } = req.params;

        const result = await createImageDownloadUrl(imageId, variant);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


// Delete image and all its variants
export const deleteImage = async (req, res, next) => {
    try {
        const { imageId } = req.params;

        await removeImage(imageId);

        return res.status(200).json({
            message: "Image and its variations deleted successfully",
            imageId
        });
    } catch (error) {
        next(error);
    }
};
