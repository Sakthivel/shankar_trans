import { Router } from "express";
import { vehicleController } from "../controllers/vehicle.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { vehicleSchema } from "../validators/master.validator";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res, next) => vehicleController.findAll(req, res, next));
router.post("/", validate(vehicleSchema), (req, res, next) => vehicleController.create(req, res, next));
router.put("/:id", validate(vehicleSchema), (req, res, next) => vehicleController.update(req, res, next));
router.delete("/:id", (req, res, next) => vehicleController.delete(req, res, next));

export default router;
