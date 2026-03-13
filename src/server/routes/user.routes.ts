import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createUserSchema, updateUserSchema } from "../validators/auth.validator";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware("OWNER"));

router.get("/", (req, res, next) => userController.findAll(req, res, next));
router.post("/", validate(createUserSchema), (req, res, next) => userController.create(req, res, next));
router.put("/:id", validate(updateUserSchema), (req, res, next) => userController.update(req, res, next));
router.delete("/:id", (req, res, next) => userController.delete(req, res, next));

export default router;
