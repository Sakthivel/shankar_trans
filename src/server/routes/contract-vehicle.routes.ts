import { Router } from "express";
import { contractVehicleController } from "../controllers/contract-vehicle.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { contractVehicleSchema } from "../validators/contract-vehicle.validator";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res, next) => contractVehicleController.findAll(req, res, next));
router.get("/:id", (req, res, next) => contractVehicleController.findById(req, res, next));
router.post("/", validate(contractVehicleSchema), (req, res, next) => contractVehicleController.create(req, res, next));
router.put("/:id", (req, res, next) => contractVehicleController.update(req, res, next));
router.patch("/:id/approve", roleMiddleware("MANAGER", "OWNER"), (req, res, next) => contractVehicleController.approve(req, res, next));
router.delete("/:id", (req, res, next) => contractVehicleController.delete(req, res, next));

export default router;
