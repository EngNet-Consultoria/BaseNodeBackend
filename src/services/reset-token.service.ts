import createHttpError from "http-errors";
import { prisma } from "../prisma";
import { add } from "date-fns";

export async function createPasswordResetToken(userId: number): Promise<string> {
  const token = await prisma.resetToken.findUnique({
    where: {
      userId,
    },
    select: {
      userId: true,
      expiresAt: true,
      token: true,
    },
  });

  if (token) {
    if (token.expiresAt > new Date()) {
      return token.token;
    }

    await prisma.resetToken.update({
      where: {
        userId: token.userId,
      },
      data: {
        expiresAt: add(new Date(), { hours: 1 }),
      },
    });

    return token.token;
  } else {
    const newToken = await prisma.resetToken.create({
      data: {
        expiresAt: add(new Date(), { hours: 1 }),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return newToken.token;
  }
}

export async function verifyPasswordResetToken(token: string) {
  const tokenInfo = await prisma.resetToken.findUnique({
    where: {
      token,
    },
    select: {
      userId: true,
      expiresAt: true,
    },
  });

  if (!tokenInfo) {
    throw new createHttpError.Unauthorized("Invalid token");
  }

  if (tokenInfo.expiresAt < new Date()) {
    await prisma.resetToken.delete({
      where: {
        userId: tokenInfo.userId,
      },
    });

    throw new createHttpError.Unauthorized("Token expired");
  }

  await prisma.resetToken.delete({
    where: {
      userId: tokenInfo.userId,
    },
  });

  return tokenInfo;
}
