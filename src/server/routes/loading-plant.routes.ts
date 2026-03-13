import { Router } from "express";
import { loadingPlantController } from "../controllers/loading-plant.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { loadingPlantSchema } from "../validators/master.validator";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res, next) => loadingPlantController.findAll(req, res, next));
router.post("/", validate(loadingPlantSchema), (req, res, next) => loadingPlantController.create(req, res, next));
router.put("/:id", validate(loadingPlantSchema), (req, res, next) => loadingPlantController.update(req, res, next));
router.delete("/:id", (req, res, next) => loadingPlantController.delete(req, res, next));

export default router;
