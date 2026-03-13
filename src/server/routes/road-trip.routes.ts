import { Router } from "express";
import { roadTripController } from "../controllers/road-trip.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { roadTripSchema } from "../validators/road-trip.validator";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res, next) => roadTripController.findAll(req, res, next));
router.get("/:id", (req, res, next) => roadTripController.findById(req, res, next));
router.post("/", validate(roadTripSchema), (req, res, next) => roadTripController.create(req, res, next));
router.put("/:id", (req, res, next) => roadTripController.update(req, res, next));
router.patch("/:id/approve", roleMiddleware("MANAGER", "OWNER"), (req, res, next) => roadTripController.approve(req, res, next));
router.post("/:id/upload-doc", (req, res, next) => roadTripController.uploadDoc(req, res, next));
router.delete("/:id", (req, res, next) => roadTripController.delete(req, res, next));

export default router;
