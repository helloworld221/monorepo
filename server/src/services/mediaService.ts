import { Request } from "express";
import Media, { MediaDocument } from "../models/Media";
import {
  deleteFileFromS3,
  getSignedFileUrl,
  uploadFileToS3,
} from "../utils/s3";

export const uploadMedia = async (req: Request) => {
  if (!req.file) {
    throw new Error("Bad Request: No file uploaded");
  }

  if (!req.user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const userId = (req.user as any)._id;

  const s3Key = await uploadFileToS3(req.file, userId.toString());

  const media = await Media.create({
    userId,
    filename: req.file.filename
      ? req.file.filename
      : req.file.originalname,
    originalname: req.file.originalname,
    fileType: req.file.mimetype,
    size: req.file.size,
    s3Key,
  });

  const url = await getSignedFileUrl(s3Key);

  return {
    ...media.toObject(),
    url,
  };
};

export const getUserMedia = async (req: Request) => {
  if (!req.user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const userId = (req.user as any)._id;

  const mediaItems = await Media.find({ userId }).sort({ createdAt: -1 });

  const mediaWithUrls = await Promise.all(
    mediaItems.map(async (item: MediaDocument) => {
      const url = await getSignedFileUrl(item.s3Key);
      return {
        ...item.toObject(),
        url,
      };
    })
  );

  return mediaWithUrls;
};

export const deleteMedia = async (mediaId: string, user: any) => {
  try {
    const media = await Media.findById(mediaId);

    if (!media) {
      throw new Error("Not Found: Media not found");
    }

    if (media.userId.toString() !== user._id.toString()) {
      throw new Error(
        "Unauthorized: You are not authorized to delete this media"
      );
    }

    await deleteFileFromS3(user.id, media.filename);
    await Media.findByIdAndDelete(mediaId);
  } catch (error: any) {
    throw error;
  }
};
