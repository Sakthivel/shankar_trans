import { Router } from "express";
import { reportController } from "../controllers/report.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res, next) => reportController.generate(req, res, next));

export default router;
