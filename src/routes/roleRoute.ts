import { Router } from "express";
import {
  createRole,
  getRole,
  getRoles,
  removeRole,
  updateRole,
} from "../controllers/roleController";
import validateBody from "../middleware/validate";
import { createRoleSchema, updateRoleSchema } from "../validation/role";

const router = Router();

router.get("/", getRoles);
router.post("/", validateBody(createRoleSchema), createRole);
router.get("/:id", getRole);
router.put("/:id", validateBody(updateRoleSchema), updateRole);
router.delete("/:id", removeRole);

export default router;
