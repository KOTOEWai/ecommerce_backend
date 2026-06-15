import { Router } from "express";
import { login, register } from "../controllers/authController";
import validateBody from "../middleware/validate";
import { registerSchema, loginSchema } from "../validation/auth";


const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

export default router;
