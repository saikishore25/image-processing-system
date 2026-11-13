
import sharp from "sharp";

export const generateVariants = async (originalBuffer) => {
    const results = {};

    // Thumbnail: square crop
    const thumbnail = await sharp(originalBuffer)
        .resize(150, 150, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

    results.thumbnail = {
        buffer: thumbnail,
        extension: "jpg",
        contentType: "image/jpeg",
        ...await sharp(thumbnail).metadata()
    };


    // Small: 400px width
    const small = await sharp(originalBuffer)
        .resize({ width: 400 })
        .jpeg({ quality: 85 })
        .toBuffer();

    results.small = {
        buffer: small,
        extension: "jpg",
        contentType: "image/jpeg",
        ...await sharp(small).metadata()
    };


    // Medium: 800px width
    const medium = await sharp(originalBuffer)
        .resize({ width: 800 })
        .jpeg({ quality: 85 })
        .toBuffer();

    results.medium = {
        buffer: medium,
        extension: "jpg",
        contentType: "image/jpeg",
        ...await sharp(medium).metadata()
    };


    // Large: 1200px width
    const large = await sharp(originalBuffer)
        .resize({ width: 1200 })
        .jpeg({ quality: 90 })
        .toBuffer();

    results.large = {
        buffer: large,
        extension: "jpg",
        contentType: "image/jpeg",
        ...await sharp(large).metadata()
    };


    // Compressed: optimized JPEG
    const compressed = await sharp(originalBuffer)
        .jpeg({ quality: 60, mozjpeg: true })
        .toBuffer();

    results.compressed = {
        buffer: compressed,
        extension: "jpg",
        contentType: "image/jpeg",
        ...await sharp(compressed).metadata()
    };


    // WebP conversion
    const webp = await sharp(originalBuffer)
        .webp({ quality: 80 })
        .toBuffer();

    results.webp = {
        buffer: webp,
        extension: "webp",
        contentType: "image/webp",
        ...await sharp(webp).metadata()
    };

    return results;
};
