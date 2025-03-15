import express, { Request, Response } from "express";
import passport from "passport";
import { env } from "../config/env";
import {
  getCurrentUserHandler,
  logoutHandler,
} from "../controllers/authControllers";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to client URL
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: env.CLIENT_URL + "/login?error=authfailed",
    session: true,
  }),
  (req: Request, res: Response) => {
    console.log("Auth callback - Session data:", req?.session);
    console.log("Auth callback - Passport in session:", req?.session?.passport);
    console.log("Auth callback - User in request:", req?.user);

    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
      }
      console.log(
        "Session saved, contains passport:",
        req.session.passport ? "yes" : "no"
      );
      res.redirect(env.CLIENT_URL || "http://localhost:3000");
    });
  }
);

/**
 * @swagger
 * /api/auth/current-user:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Current user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthenticated:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   nullable: true
 */

router.get("/current-user", (req: Request, res: Response) => {
  console.log("Raw session data in current-user:", JSON.stringify(req?.session));
  console.log("Session ID:", req?.sessionID);
  console.log("Passport in session:", req?.session?.passport);
  console.log(
    "Is authenticated method exists:",
    typeof req.isAuthenticated === "function"
  );
  console.log(
    "Is authenticated result:",
    req.isAuthenticated ? req.isAuthenticated() : "N/A"
  );
  getCurrentUserHandler(req, res);
});

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Logout error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/logout", logoutHandler);

export default router;
