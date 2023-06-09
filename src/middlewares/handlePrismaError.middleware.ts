import { Prisma } from "@prisma/client";
import { type NextFunction } from "express";
import { type ErrorResponse } from "../schemas/error.schema";

// * Middleware for handling all the prisma known errors and validation errors
// * as a BadRequest
export function handlePrismaError(error: Error, req: Req, res: Res<ErrorResponse>, next: NextFunction) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    return res.status(400).json({
      message: error.message.replace(/(\r\n|\n|\r)/gm, ""),
      timestamp: new Date().toISOString(),
    });
  }

  return next(error);
}
