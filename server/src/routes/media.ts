import express from "express";
import {
  deleteMediaHandler,
  getUserMediaHandler,
  uploadMediaHandler,
} from "../controllers/mediaController";
import { isAuthenticated } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { validateExpressValidator } from "../middleware/validation";
import { mediaUploadFileSchema } from "../validations/media";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Media
 *     description: Media management
 */

/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     summary: Upload media file
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 media:
 *                   $ref: '#/components/schemas/Media'
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Failed to upload media
 */
router.post(
  "/upload",
  isAuthenticated,
  upload.single("media"),
  validateExpressValidator(mediaUploadFileSchema),
  uploadMediaHandler
);

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Get user's media
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User media list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 media:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Media'
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Failed to fetch media
 */
router.get("/", isAuthenticated, getUserMediaHandler);

/**
 * @swagger
 * /api/media/{id}:
 *   post:
 *     summary: Delete media file
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Media not found
 *       500:
 *         description: Failed to delete media
 */
router.post("/:id/delete", isAuthenticated, deleteMediaHandler);

export default router;
