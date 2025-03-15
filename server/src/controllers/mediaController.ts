import { Request, Response } from "express";
import {
  getUserMedia,
  uploadMedia,
  deleteMedia,
} from "../services/mediaService";
import logger from "../utils/logger";

export const uploadMediaHandler = async (req: Request, res: Response) => {
  try {
    console.log("req.file", req.file);
    const media = await uploadMedia(req);
    res.status(201).json({
      message: "Created: Media uploaded successfully",
      media,
    });
  } catch (error: any) {
    logger.error({ message: "Error uploading media", error });
    if (
      error.message === "Bad Request: No file uploaded" ||
      error.message === "Unauthorized: User not authenticated"
    ) {
      res
        .status(error.message === "Bad Request: No file uploaded" ? 400 : 401)
        .json({ message: error.message });
      return;
    }
    res
      .status(500)
      .json({ message: "Internal Server Error: Failed to upload media" });
  }
};

export const getUserMediaHandler = async (req: Request, res: Response) => {
  try {
    const media = await getUserMedia(req);
    res.status(200).json({ media });
  } catch (error: any) {
    logger.error({ message: "Error fetching user media", error });
    if (error.message === "Unauthorized: User not authenticated") {
      res.status(401).json({ message: error.message });
      return;
    }
    res
      .status(500)
      .json({ message: "Internal Server Error: Failed to fetch media" });
  }
};

export const deleteMediaHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteMedia(id, req.user);
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (error: any) {
    logger.error({ message: "Error deleting media", error });
    if (error.message === "Unauthorized: User not authenticated") {
      res.status(401).json({ message: error.message });
      return;
    } else if (error.message === "Not Found: Media not found") {
      res.status(404).json({ message: error.message });
      return;
    }
    res
      .status(500)
      .json({ message: "Internal Server Error: Failed to delete media" });
  }
};
