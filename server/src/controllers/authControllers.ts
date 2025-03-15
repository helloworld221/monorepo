import { Request, Response } from "express";
import { getCurrentUser, logout } from "../services/authService";

export const getCurrentUserHandler = (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  res.status(200).json(user);
};

export const logoutHandler = (req: Request, res: Response) => {
  logout(req, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error logging out: " + err.message });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};
