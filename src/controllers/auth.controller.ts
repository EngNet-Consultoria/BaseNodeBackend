import { type Request, type Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { LoginSchema, type LoginResponse, RefreshSchema, RegisterSchema } from "../schemas/auth.schema";
import { prisma } from "../prisma";
import { createAccessToken, createRefreshToken, decodeRefreshToken } from "../services/jwt.service";

export async function login(req: Request, res: Response<LoginResponse>) {
  const { username, password } = LoginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (user === null) {
    throw new createHttpError.Unauthorized("Nome de usuário ou senha incorretos");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new createHttpError.Unauthorized("Nome de usuário ou senha incorretos");
  }

  const accessToken = createAccessToken({ userId: user.id });
  const refreshToken = createRefreshToken({ userId: user.id });

  return res.status(200).json({
    accessToken,
    refreshToken,
    userId: user.id,
  });
}

export async function register(req: Request, res: Response<LoginResponse>) {
  const { password, username } = RegisterSchema.parse(req.body);
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hash,
    },
    select: {
      id: true,
    },
  });

  const accessToken = createAccessToken({ userId: user.id });
  const refreshToken = createRefreshToken({ userId: user.id });

  return res.status(201).json({
    accessToken,
    refreshToken,
    userId: user.id,
  });
}

export async function refresh(req: Request, res: Response<LoginResponse>) {
  const { refreshToken } = RefreshSchema.parse(req.body);
  const { userId } = decodeRefreshToken(refreshToken);

  const accessToken = createAccessToken({ userId });
  const newRefreshToken = createRefreshToken({ userId });

  return res.status(200).json({
    accessToken,
    refreshToken: newRefreshToken,
    userId,
  });
}
