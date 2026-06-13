import { Router } from "express";
const router = Router();
import { getUser, getProfile, updateProfile, removeUser } from "../controllers/userController";
import { protect } from "../middleware/auth";

router.get("/", getUser);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.delete("/:id", protect, removeUser);

export default router;
