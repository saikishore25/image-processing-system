
import { createImageUpload, getImageDownload } from "../services/imageServices.js";

export const createUploadUrl = async (req, res, next) => {
    try {
        const { fileName, contentType, fileSize } = req.body;

        if (!fileName || !contentType || fileSize === undefined) {
            return res.status(400).json({
                success: false,
                message: "fileName, contentType and fileSize are required",
            });
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(contentType)) {
            return res.status(400).json({
                success: false,
                message: "Only JPEG, PNG and WEBP images are allowed",
            });
        }

        const maxSize = 10 * 1024 * 1024;

        if (
            !Number.isInteger(fileSize) ||
            fileSize <= 0 ||
            fileSize > maxSize
        ) {
            return res.status(400).json({
                success: false,
                message: "Image size must be between 1 byte and 10 MB",
            });
        }

        const result = await createImageUpload({
            fileName,
            contentType,
            fileSize,
        });

        return res.status(200).json({
            success: true,
            message: "Upload URL generated successfully",
            data: result,
        });

    }
    catch (error) {
        next(error);
    }
};

export const downloadImage = async (req, res, next) => {
    try {
        const { key } = req.query;

        if (!key) {
            return res.status(400).json({
                success: false,
                message: "S3 key is required",
            });
        }

        const result = await getImageDownload(key);

        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        next(error);
    }
};