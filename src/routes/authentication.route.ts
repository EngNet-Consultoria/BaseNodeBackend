import { Router } from "express";
import {
  login,
  register,
  ResetPassword,
  sendPasswordRecoveryEmail,
} from "../controllers/authentication.controller";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/reset-password", ResetPassword);
router.post("/send-password-recovery-email", sendPasswordRecoveryEmail);

export default router;
