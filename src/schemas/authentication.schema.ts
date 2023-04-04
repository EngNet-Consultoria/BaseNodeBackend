import { z } from "zod";

export interface LoginResponse {
  accessToken: string;
}

export const LoginRequestSchema = z.object({
  email: z.string().max(100).email(),
  password: z.string().max(100),
});

export interface RegisterResponse {
  accessToken: string;
}

export const RegisterRequestSchema = z.object({
  email: z.string().max(100).email(),
  password: z.string().max(100),
  name: z.string().max(50),
});

export const SendPasswordRecoveryEmailRequestSchema = z.object({
  email: z.string().max(100).email(),
});

export const ResetPasswordRequestSchema = z.object({
  password: z.string().max(100),
  token: z.string().uuid(),
});
