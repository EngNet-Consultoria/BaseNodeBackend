import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
}

export function createAccessToken(userId: number): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return jwt.sign({ userId }, process.env.JWT_SECRET!);
}

export function decodeAccessToken(token: string): JwtPayload {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

  if (decodedToken.userId === undefined) {
    throw new createHttpError.Unauthorized("Invalid token payload");
  }

  const userId = parseInt(decodedToken.userId, 10);

  if (isNaN(userId)) {
    throw new createHttpError.Unauthorized("Invalid token payload");
  }

  return {
    userId,
  };
}
