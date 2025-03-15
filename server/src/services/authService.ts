import { Request } from "express";
import logger from "../utils/logger";

export const getCurrentUser = (req: Request) => {
  console.log("getCurrentUser", req?.user, req?.session);
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

export const logout = (req: any, callback: (err: any) => void) => {
  if (req.logout) {
    req.logout((err) => {
      if (err) {
        logger.error({ message: "Logout error", error: err });
        callback(err);
      } else {
        // Destroy the session after successful logout
        if (req.session) {
          req.session.destroy((sessionErr) => {
            if (sessionErr) {
              logger.error({
                message: "Session destroy error",
                error: sessionErr,
              });
              callback(sessionErr);
            } else {
              logger.info({ message: "User logged out and session destroyed" });
              callback(null);
            }
          });
        } else {
          logger.info({ message: "User logged out" });
          callback(null);
        }
      }
    });
  } else {
    logger.warn({ message: "Logout method not available" });
    callback(new Error("Logout method not available"));
  }
};
