import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  logger.warn({ message: "Authentication failed", url: req.url });
  res.status(401).json({ message: "Unauthorized: Please log in" });
};
