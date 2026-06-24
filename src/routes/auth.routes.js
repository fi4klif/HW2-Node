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

router.get("/", getAnnouncementsValidator, getAnnouncements);
router.get("/:id", getAnnouncementByIdValidator, getAnnouncementById);
router.post("/", authenticate, createAnnouncementValidator, createAnnouncement);
router.patch(
  "/:id",
  authenticate,
  updateAnnouncementValidator,
  updateAnnouncement,
);
router.delete(
  "/:id",
  authenticate,
  deleteAnnouncementValidator,
  deleteAnnouncement,
);

export default router;
