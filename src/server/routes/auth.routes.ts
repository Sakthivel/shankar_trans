import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema } from "../validators/auth.validator";

const router = Router();

router.post("/login", validate(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post("/logout", (req, res) => authController.logout(req, res));
router.get("/me", authMiddleware, (req, res, next) => authController.me(req, res, next));

export default router;
