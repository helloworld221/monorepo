import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  logger.info({
    message: "Incoming Request",
    method: req.method,
    url: req.url,
    headers: req.headers,
  });

  res.on("finish", () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    logger.info({
      message: "Outgoing Response",
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
