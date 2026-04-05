import { Router } from "express";
import { register, login, refresh, logout, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate";
import { validate, registerValidation, loginValidation } from "../middleware/validation";

const router = Router();

// Public routes
router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/refresh", refresh);

// Protected routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

export default router;
