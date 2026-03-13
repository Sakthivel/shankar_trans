import { Router } from "express";
import { deliveryLocationController } from "../controllers/delivery-location.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { deliveryLocationSchema } from "../validators/master.validator";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res, next) => deliveryLocationController.findAll(req, res, next));
router.post("/", validate(deliveryLocationSchema), (req, res, next) => deliveryLocationController.create(req, res, next));
router.put("/:id", validate(deliveryLocationSchema), (req, res, next) => deliveryLocationController.update(req, res, next));
router.delete("/:id", (req, res, next) => deliveryLocationController.delete(req, res, next));

export default router;
