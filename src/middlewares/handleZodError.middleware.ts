import { type NextFunction } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { type ErrorResponse } from "../schemas/error.schema";

export function handleZodError(err: Error, req: Req, res: Res<ErrorResponse>, next: NextFunction) {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: fromZodError(err).toString(),
      timestamp: new Date().toISOString(),
    });
  }

  return next(err);
}
