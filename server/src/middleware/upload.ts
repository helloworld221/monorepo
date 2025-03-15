import multer from "multer";
import logger from "../utils/logger";

const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: any, cb: any) => {
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
