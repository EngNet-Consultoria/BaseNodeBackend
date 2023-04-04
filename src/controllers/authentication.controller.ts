import { prisma } from "../prisma";
import createHttpError from "http-errors";
import {
  LoginRequestSchema,
  LoginResponse,
  RegisterRequestSchema,
  RegisterResponse,
  ResetPasswordRequestSchema,
  SendPasswordRecoveryEmailRequestSchema,
} from "../schemas/authentication.schema";
import { createAccessToken } from "../services/jwt.service";
import bcrypt from "bcrypt";
import { createPasswordResetToken, verifyPasswordResetToken } from "../services/reset-token.service";
import { sendEmail } from "../services/email.service";

export async function login(req: Req, res: Res<LoginResponse>) {
  const { email, password } = LoginRequestSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new createHttpError.Unauthorized("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new createHttpError.Unauthorized("Invalid email or password");
  }

  const accessToken = createAccessToken(user.id);

  return res.status(200).json({
    accessToken,
  });
}

export async function register(req: Req, res: Res<RegisterResponse>) {
  const { email, password, name } = RegisterRequestSchema.parse(req.body);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  const accessToken = createAccessToken(user.id);

  return res.status(200).json({
    accessToken,
  });
}

export async function sendPasswordRecoveryEmail(req: Req, res: Res<never>) {
  const { email } = SendPasswordRecoveryEmailRequestSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    return res.sendStatus(204);
  }

  const token = await createPasswordResetToken(user.id);

  sendEmail({
    to: [{ name: user.name, address: user.email }],
    subject: "Recuperação de senha",
    template: "reset-password-email",
    text:
      `Olá ${user.name}, você solicitou a recuperação de senha.\n` +
      "Para continuar, copie o link abaixo e cole no seu navegador:\n" +
      `http://localhost:3000/reset-password?token=${token}`,
    context: {
      name: user.name,
      link: `http://localhost:3000/reset-password?token=${token}`,
    },
  });

  return res.sendStatus(204);
}

export async function ResetPassword(req: Req, res: Res<never>) {
  const { password, token } = ResetPasswordRequestSchema.parse(req.body);

  const tokenInfo = await verifyPasswordResetToken(token);

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: tokenInfo.userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return res.sendStatus(204);
}
