import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload file buffer to Cloudinary
export const uploadFileToCloudinary = (file) => {
  const options = {
    resource_type: file.mimetype.startsWith("video") ? "video" : "image",
  };

  return new Promise((resolve, reject) => {
    const uploader = file.mimetype.startsWith("video")
      ? cloudinary.uploader.upload_large
      : cloudinary.uploader.upload;

    // Upload file from buffer (in memory)
    uploader(
      file.buffer, // Use file.buffer instead of file.path
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
};

// Configure Multer to use MemoryStorage
export const multerMiddleware = multer({
  storage: multer.memoryStorage(), // Store files in memory instead of disk
}).single("media");