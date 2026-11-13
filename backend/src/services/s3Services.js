
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../configs/awsConfig.js";


const BUCKET_NAME = process.env.AWS_S3_BUCKET;

// Generate presigned upload URL
export const getUploadUrl = async ({ key, contentType }) => {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType
    });

    return getSignedUrl(s3, command, {
        expiresIn: 300
    });
};


// Upload processed image to S3
export const uploadToS3 = async ({ key, buffer, contentType }) => {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType
    });

    await s3.send(command);
};


// Download image from S3 as Buffer
export const getFromS3 = async (key) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });

    const response = await s3.send(command);

    const bytes = await response.Body.transformToByteArray();

    return Buffer.from(bytes);
};


// Generate presigned download URL
export const getDownloadUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });

    return getSignedUrl(s3, command, {
        expiresIn: 3600
    });
};


// Check whether object exists
export const checkS3Object = async (key) => {
    const command = new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });

    return s3.send(command);
};


// Delete object
export const deleteFromS3 = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });

    return s3.send(command);
};
