import { Router } from "express";
import { lpgTankerController } from "../controllers/lpg-tanker.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { lpgTankerSchema } from "../validators/lpg-tanker.validator";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res, next) => lpgTankerController.findAll(req, res, next));
router.get("/:id", (req, res, next) => lpgTankerController.findById(req, res, next));
router.post("/", validate(lpgTankerSchema), (req, res, next) => lpgTankerController.create(req, res, next));
router.put("/:id", (req, res, next) => lpgTankerController.update(req, res, next));
router.patch("/:id/approve", roleMiddleware("MANAGER", "OWNER"), (req, res, next) => lpgTankerController.approve(req, res, next));
router.delete("/:id", (req, res, next) => lpgTankerController.delete(req, res, next));

export default router;
