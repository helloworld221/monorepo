import { Request } from "express";
import logger from "../utils/logger";

export const getCurrentUser = (req: Request) => {
  console.log('getCurrentUser', req);
  if (req.isAuthenticated && req.isAuthenticated()) {
    return {
      isAuthenticated: true,
      user: req.user,
    };
  } else {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
};

export const logout = (req: Request, callback: (err: any) => void) => {
  if (req.logout) {
    req.logout((err) => {
      if (err) {
        logger.error({ message: "Logout error", error: err });
        callback(err);
      } else {
        callback(null);
      }
    });
  } else {
    logger.warn({ message: "Logout method not available" });
    callback(new Error("Logout method not available"));
  }
};
