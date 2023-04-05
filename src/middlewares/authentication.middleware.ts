import { NextFunction } from "express";
import createHttpError from "http-errors";
import { decodeAccessToken } from "../services/jwt.service";

export function isAuthenticated(req: Req, res: Res<never>, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new createHttpError.Unauthorized();
  }

  const accessToken = authorizationHeader.substring("Bearer ".length);

  try {
    const payload = decodeAccessToken(accessToken);

    res.locals.userId = payload.userId;

    next();
  } catch (err) {
    throw new createHttpError.Unauthorized();
  }
}
