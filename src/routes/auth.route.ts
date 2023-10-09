import { Router } from "express";
import { login, register, refresh } from "../business/auth.business";
import { LoginSchema, RefreshSchema, RegisterSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/login", async (req, res) => {
  // Validate input
  const input = LoginSchema.parse(req.body);

  // Execute business logic
  const response = await login(input);

  // Send response
  return res.status(200).json(response);
});

router.post("/register", async (req, res) => {
  // Validate input
  const input = RegisterSchema.parse(req.body);

  // Execute business logic
  const response = await register(input);

  // Send response
  return res.status(201).json(response);
});

router.post("/refresh", async (req, res) => {
  // Validate input
  const input = RefreshSchema.parse(req.body);

  // Execute business logic
  const response = await refresh(input);

  // Send response
  return res.status(200).json(response);
});

export default router;
