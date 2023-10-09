import { z } from "zod";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

export const LoginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshDTO = z.infer<typeof RefreshSchema>;

export const RegisterSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
