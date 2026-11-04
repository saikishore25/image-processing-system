
import express from "express";

import {
  createUploadUrl,
  downloadImage
} from "../controllers/imageControllers.js";

const router = express.Router();

router.post("/upload-url", createUploadUrl);
router.get("/:imageId/download",downloadImage);

export default router;
