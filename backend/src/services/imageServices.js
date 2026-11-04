import {
  generateUploadUrl,
  generateDownloadUrl,
} from "./s3Services.js";
import { randomUUID } from "crypto";


export const createImageUpload = async ({fileName, contentType, fileSize}) => {
  
  const imageId = randomUUID();
  const extension = contentType.split("/")[1];
  const key = `original/${imageId}.${extension}`;

  const uploadUrl = await generateUploadUrl({
    key,
    contentType,
  });

  return {
    imageId,
    fileName,
    contentType,
    fileSize,
    key,
    uploadUrl,
    status: "PENDING",
  };
};


export const getImageDownload = async (key) => {
  const downloadUrl = await generateDownloadUrl(key);

  return {
    downloadUrl,
    expiresIn: 300,
  };
};