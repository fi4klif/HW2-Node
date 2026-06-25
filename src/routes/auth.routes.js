import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *      201:
 *   description: User created
 */
router.post("/register", registerValidator, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     responses:
 *       200:
 *   description: Login successful
 */
router.post("/login", loginValidator, login);

router.post("/refresh", refresh);
router.post("/logout", logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *   security:
 *     - bearerAuth: []
 */
router.get("/me", authenticate, getMe);

export default router; // ЦЕЙ РЯДОК ВИПРАВЛЯЄ ВАШУ ПОМИЛКУ
