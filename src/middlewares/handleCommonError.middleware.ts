import { type NextFunction } from "express";
import { HttpError } from "http-errors";
import { type ErrorResponse } from "../schemas/error.schema";

export function handleCommonError(err: Error, req: Req, res: Res<ErrorResponse>, next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(500).json({
    message: err.message,
    timestamp: new Date().toISOString(),
  });
}
