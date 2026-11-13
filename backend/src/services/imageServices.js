
import { randomUUID } from "crypto";
import path from "path";

import {
    uploadToS3,
    getFromS3,
    getUploadUrl,
    getDownloadUrl,
    checkS3Object,
    deleteFromS3
} from "./s3Services.js";

import {
    saveImage,
    getImage,
    getImages,
    updateImage,
    deleteImageRecord
} from "./dynamodbServices.js";

import { generateVariants } from "./processingServices.js";



// 1. Create image ID, database record and upload URL
export const createImageUpload = async ({
    fileName,
    contentType,
    fileSize
}) => {
    const imageId = randomUUID();

    const extension = path.extname(fileName).toLowerCase();
    const originalKey = `original/${imageId}${extension}`;
    console.log("Original Key: ", originalKey)
    const image = {
        imageId,
        originalName: fileName,
        originalKey,
        contentType,
        fileSize,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        variants: {}
    };

    await saveImage(image);

    const uploadUrl = await getUploadUrl({
        key: originalKey,
        contentType
    });

    console.log("Upload URL: ", uploadUrl)

    return {
        imageId,
        uploadUrl,
        originalKey,
        status: "PENDING"
    };
};


// 2. Confirm that the original image reached S3
export const confirmImageUpload = async (imageId) => {
    const image = await getImage(imageId);

    if (!image) {
        throw new Error("Image not found");
    }

    await checkS3Object(image.originalKey);

    await updateImage(imageId, {
        status: "UPLOADED"
    });

    return {
        imageId,
        status: "UPLOADED",
        message: "Original image uploaded successfully"
    };
};


// 3. Start processing
export const startImageProcessing = async (imageId) => {
    const image = await getImage(imageId);

    if (!image) {
        throw new Error("Image not found");
    }

    if (image.status !== "UPLOADED") {
        throw new Error("Image must be uploaded before processing");
    }

    await updateImage(imageId, {
        status: "PROCESSING"
    });

    // Run processing in the background on EC2.
    processImageInBackground(image).catch(async (error) => {
        console.error("Image processing failed:", error);

        await updateImage(imageId, {
            status: "FAILED",
            error: error.message
        });
    });

    return {
        imageId,
        status: "PROCESSING"
    };
};


// 4. Actual processing workflow
const processImageInBackground = async (image) => {
    const originalBuffer = await getFromS3(image.originalKey);

    const variants = await generateVariants(originalBuffer);

    const variantMetadata = {};

    for (const [variantName, variant] of Object.entries(variants)) {
        const key = `processed/${image.imageId}/${variantName}.${variant.extension}`;

        await uploadToS3({
            key,
            buffer: variant.buffer,
            contentType: variant.contentType
        });

        variantMetadata[variantName] = {
            key,
            contentType: variant.contentType,
            fileSize: variant.buffer.length,
            width: variant.width,
            height: variant.height
        };
    }

    await updateImage(image.imageId, {
        status: "COMPLETED",
        variants: variantMetadata,
        completedAt: new Date().toISOString()
    });
};


// 5. Get all images for gallery
export const fetchAllImages = async () => {
    const images = await getImages();

    return Promise.all(
        images.map(async (image) => ({
            ...image,
            originalUrl: await getDownloadUrl(image.originalKey)
        }))
    );
};


// 6. Get one image and its variations
export const fetchImageById = async (imageId) => {
    const image = await getImage(imageId);

    if (!image) {
        throw new Error("Image not found");
    }

    const originalUrl = await getDownloadUrl(image.originalKey);

    const variants = {};

    for (const [name, variant] of Object.entries(image.variants || {})) {
        variants[name] = {
            ...variant,
            url: await getDownloadUrl(variant.key)
        };
    }

    return {
        ...image,
        originalUrl,
        variants
    };
};


// 7. Download a particular image version
export const createImageDownloadUrl = async (imageId, variantName) => {
    const image = await getImage(imageId);

    if (!image) {
        throw new Error("Image not found");
    }

    let key;

    if (variantName === "original") {
        key = image.originalKey;
    } else {
        const variant = image.variants?.[variantName];

        if (!variant) {
            throw new Error("Image variant not found");
        }

        key = variant.key;
    }

    const url = await getDownloadUrl(key);

    return {
        imageId,
        variant: variantName,
        downloadUrl: url
    };
};


// 8. Delete original, variations and database record
export const removeImage = async (imageId) => {
    const image = await getImage(imageId);

    if (!image) {
        throw new Error("Image not found");
    }

    const keys = [
        image.originalKey,
        ...Object.values(image.variants || {}).map((variant) => variant.key)
    ];

    for (const key of keys) {
        await deleteFromS3(key);
    }

    await deleteImageRecord(imageId);

    return true;
};
