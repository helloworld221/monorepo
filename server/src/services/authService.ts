import { Request } from "express";
import logger from "../utils/logger";

export const getCurrentUser = (req: Request) => {
  if (req.isAuthenticated()) {
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
  req.logout((err) => {
    if (err) {
      logger.error({ message: "Logout error", error: err });
      callback(err);
    } else {
      callback(null);
    }
  });
};
