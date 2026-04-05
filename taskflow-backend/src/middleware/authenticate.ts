import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { verifyAccessToken } from "../utils/jwt";
import { sendError } from "../utils/response";

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, "Access token required", 401);
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      sendError(res, "Access token required", 401);
      return;
    }

    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        sendError(res, "Access token expired", 401, "TOKEN_EXPIRED");
        return;
      }
      if (error.name === "JsonWebTokenError") {
        sendError(res, "Invalid access token", 401, "INVALID_TOKEN");
        return;
      }
    }
    sendError(res, "Authentication failed", 401);
  }
}
