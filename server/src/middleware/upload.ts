import multer from "multer";
import logger from "../utils/logger"; // Import Winston logger

// Configure storage as memory storage
const storage = multer.memoryStorage();

// File filter function to validate media types
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.warn({
      message: "Invalid file type",
      file: file.originalname,
      type: file.mimetype,
    });
    cb(
      new Error(
        "Invalid file type. Only images, videos, and audio are allowed."
      )
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
