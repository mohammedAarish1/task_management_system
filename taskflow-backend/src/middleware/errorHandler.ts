import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err.name === "PrismaClientKnownRequestError") {
    sendError(res, "Database operation failed", 400);
    return;
  }

  if (err.name === "PrismaClientValidationError") {
    sendError(res, "Invalid data provided", 400);
    return;
  }

  sendError(res, "Internal server error", 500);
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.path} not found`, 404);
}
