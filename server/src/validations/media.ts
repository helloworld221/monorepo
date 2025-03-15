import { body } from "express-validator";

export const mediaUploadFileSchema = [
  body("media").custom((_value, { req }) => {
    if (!req.file) {
      throw new Error("No file uploaded");
    }
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("Invalid file type");
    }
    if (req.file.size > 10 * 1024 * 1024) {
      throw new Error("File size too large");
    }
    return true;
  }),
];
