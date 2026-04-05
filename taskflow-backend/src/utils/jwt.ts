import jwt from "jsonwebtoken";
import { JwtAccessPayload, JwtRefreshPayload } from "../types";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export function signAccessToken(payload: JwtAccessPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: JwtRefreshPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtAccessPayload;
}

export function verifyRefreshToken(token: string): JwtRefreshPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtRefreshPayload;
}

export function getRefreshTokenExpiry(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 7); // 7 days
  return date;
}
