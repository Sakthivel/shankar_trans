import { Router } from "express";
import { driverController } from "../controllers/driver.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { driverSchema } from "../validators/master.validator";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res, next) => driverController.findAll(req, res, next));
router.post("/", validate(driverSchema), (req, res, next) => driverController.create(req, res, next));
router.put("/:id", validate(driverSchema), (req, res, next) => driverController.update(req, res, next));
router.delete("/:id", (req, res, next) => driverController.delete(req, res, next));

export default router;
