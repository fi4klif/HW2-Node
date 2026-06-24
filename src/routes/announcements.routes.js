import { Router } from "express";
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcements.controller.js";
import {
  getAnnouncementsValidator,
  getAnnouncementByIdValidator,
  createAnnouncementValidator,
  updateAnnouncementValidator,
  deleteAnnouncementValidator,
} from "../validators/announcements.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Get all announcements
 *     description: Retrieve a list of announcements with optional search, sort, and pagination
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by announcement title (case-insensitive)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *         description: Sort order - newest (default) or oldest
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-based)
 *     responses:
 *       200:
 *         description: Successfully retrieved announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Announcement'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     perPage:
 *                       type: integer
 */
router.get("/", getAnnouncementsValidator, getAnnouncements);

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Get an announcement by ID
 *     description: Retrieve a single announcement by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Successfully retrieved announcement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Announcement'
 *       404:
 *         description: Announcement not found
 */
router.get("/:id", getAnnouncementByIdValidator, getAnnouncementById);

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Create a new announcement
 *     description: Create a new announcement with validation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - category
 *               - contactInfo
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *               category:
 *                 type: string
 *                 enum: [sale, service, job, other]
 *               contactInfo:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       201:
 *         description: Announcement successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Announcement'
 *       400:
 *         description: Validation error
 */
router.post("/", authenticate, createAnnouncementValidator, createAnnouncement);

/**
 * @swagger
 * /announcements/{id}:
 *   patch:
 *     summary: Partially update an announcement
 *     description: Update one or more fields of an announcement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Announcement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *               category:
 *                 type: string
 *                 enum: [sale, service, job, other]
 *               contactInfo:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       200:
 *         description: Announcement successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Announcement'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Announcement not found
 */
router.patch(
  "/:id",
  authenticate,
  updateAnnouncementValidator,
  updateAnnouncement,
);

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Delete an announcement
 *     description: Delete an announcement by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Announcement ID
 *     responses:
 *       204:
 *         description: Announcement successfully deleted
 *       404:
 *         description: Announcement not found
 */
router.delete(
  "/:id",
  authenticate,
  deleteAnnouncementValidator,
  deleteAnnouncement,
);

export default router;
