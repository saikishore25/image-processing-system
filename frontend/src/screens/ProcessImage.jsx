
import { useState } from "react";
import {
    Upload,
    Image as ImageIcon,
    WandSparkles,
    CheckCircle2,
    X,
    LoaderCircle,
} from "lucide-react";

import {
    createUploadUrl,
    uploadImageToS3,
    completeUpload,
    processImage as startProcessing,
    getImageById,
} from "../services/imageServices.js";

const variants = [
    { key: "original", name: "Original", description: "Unmodified source image" },
    { key: "thumbnail", name: "Thumbnail", description: "150 × 150 px" },
    { key: "small", name: "Small", description: "400 px width" },
    { key: "medium", name: "Medium", description: "800 px width" },
    { key: "large", name: "Large", description: "1200 px width" },
    { key: "compressed", name: "Compressed", description: "Optimized JPEG" },
    { key: "webp", name: "WebP", description: "WebP format" },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ProcessImage({ images, setImages }) {

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [processedImage, setProcessedImage] = useState(null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const handleFile = (selectedFile) => {
        if (!selectedFile || !selectedFile.type.startsWith("image/")) {
            setError("Please select a valid image.");
            return;
        }

        if (preview) URL.revokeObjectURL(preview);

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setProcessedImage(null);
        setError("");
    };


    // Wait until backend finishes processing the image
    const waitForProcessing = async (imageId) => {

        const maxAttempts = 60;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {

            await delay(2000);

            const image = await getImageById(imageId);

            if (image.status === "COMPLETED") {
                return image;
            }

            if (image.status === "FAILED") {
                throw new Error(image.error || "Image processing failed");
            }
        }

        throw new Error("Processing is taking too long. Please check My Images later.");
    };


    const handleProcess = async () => {

        if (!file || isProcessing) return;

        try {
            setIsProcessing(true);
            setError("");
            setProcessedImage(null);

            // STEP 1: Ask backend for a presigned S3 upload URL
            const uploadData = await createUploadUrl(file);

            const { imageId, uploadUrl } = uploadData;


            // STEP 2: Upload original image directly to S3
            await uploadImageToS3(uploadUrl, file);


            // STEP 3: Tell backend that upload is complete
            await completeUpload(imageId);


            // STEP 4: Ask backend to start image processing
            await startProcessing(imageId);


            // STEP 5: Poll backend until processing is completed
            const result = await waitForProcessing(imageId);


            // STEP 6: Display result
            setProcessedImage(result);

            // Add completed image to My Images
            setImages((previous) => [
                {
                    ...result,
                    id: result.imageId,
                    name: result.originalName,
                },
                ...previous.filter((item) => item.imageId !== imageId),
            ]);

        } catch (err) {
            console.error("Image processing error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong while processing the image."
            );

        } finally {
            setIsProcessing(false);
        }
    };


    const clearSelection = () => {
        if (preview) URL.revokeObjectURL(preview);

        setFile(null);
        setPreview("");
        setProcessedImage(null);
        setError("");
    };


    return (
        <div className="p-8">

            <div className="mb-8">
                <p className="mb-2 text-sm text-blue-400">
                    WORKSPACE / PROCESS
                </p>

                <h1 className="text-3xl font-bold">
                    Process Image
                </h1>

                <p className="mt-2 text-slate-400">
                    Upload one image and generate six optimized variations.
                </p>
            </div>


            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[350px_minmax(0,1fr)]">

                {/* Upload Section */}

                <section className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 font-semibold">
                        Upload your image
                    </h2>

                    <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 p-5 text-center transition hover:border-blue-500">

                        {preview ? (
                            <img
                                src={preview}
                                alt="Selected preview"
                                className="max-h-48 max-w-full rounded-lg object-contain"
                            />
                        ) : (
                            <>
                                <Upload size={32} className="mb-4 text-blue-400" />

                                <p className="font-medium">
                                    Click to upload an image
                                </p>

                                <p className="mt-2 text-xs text-slate-500">
                                    PNG, JPG, JPEG or WebP
                                </p>
                            </>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isProcessing}
                            onChange={(event) =>
                                handleFile(event.target.files?.[0])
                            }
                        />

                    </label>


                    {file && (
                        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-800 p-3">

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                    {file.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>

                            <button
                                onClick={clearSelection}
                                disabled={isProcessing}
                                className="text-slate-400 hover:text-white disabled:opacity-40"
                            >
                                <X size={18} />
                            </button>

                        </div>
                    )}


                    <button
                        onClick={handleProcess}
                        disabled={!file || isProcessing || !!processedImage}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >

                        {isProcessing ? (
                            <>
                                <LoaderCircle size={18} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <WandSparkles size={18} />
                                {processedImage ? "Processed" : "Process Image"}
                            </>
                        )}

                    </button>


                    {isProcessing && (
                        <p className="mt-3 text-center text-sm text-blue-400">
                            Uploading and generating image variations...
                        </p>
                    )}


                    {error && (
                        <p className="mt-3 text-center text-sm text-red-400">
                            {error}
                        </p>
                    )}


                    {processedImage && (
                        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-green-400">
                            <CheckCircle2 size={16} />
                            Results added to My Images
                        </p>
                    )}

                </section>


                {/* Generated Images Section */}

                <section>

                    <div className="mb-5 flex items-center justify-between">

                        <div>
                            <h2 className="text-xl font-semibold">
                                Generated Images
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Original image and its six variations
                            </p>
                        </div>

                        <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                            {processedImage ? "7 images" : "Waiting"}
                        </span>

                    </div>


                    {!processedImage ? (

                        <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 text-center">

                            <ImageIcon size={42} className="mb-4 text-slate-600" />

                            <p className="font-medium text-slate-300">
                                No processed images yet
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Upload an image and click Process Image.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4">

                            {variants.map((variant, index) => {

                                const imageUrl =
                                    variant.key === "original"
                                        ? processedImage.originalUrl
                                        : processedImage.variants?.[variant.key]?.url;

                                return (
                                    <div
                                        key={variant.key}
                                        className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
                                    >

                                        <div className="flex h-40 items-center justify-center bg-slate-950 p-3">

                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={variant.name}
                                                    className="max-h-full max-w-full rounded object-contain"
                                                />
                                            ) : (
                                                <p className="text-xs text-slate-500">
                                                    Image unavailable
                                                </p>
                                            )}

                                        </div>

                                        <div className="p-4">

                                            <div className="flex items-center justify-between gap-2">

                                                <p className="font-medium">
                                                    {variant.name}
                                                </p>

                                                <span className="text-xs text-slate-500">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>

                                            </div>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {variant.description}
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    )}

                </section>

            </div>
        </div>
    );
}
