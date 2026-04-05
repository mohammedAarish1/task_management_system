import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken, getRefreshTokenExpiry } from "../utils/jwt";
import { sendSuccess, sendCreated, sendError } from "../utils/response";
import { AuthenticatedRequest } from "../types";

// Utility to generate a unique token ID
function generateTokenId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// POST /auth/register
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      sendError(res, "An account with this email already exists", 409);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    // Generate tokens
    const tokenId = generateTokenId();
    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, tokenId });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    sendCreated(res, { user, accessToken }, "Account created successfully");
  } catch (error) {
    console.error("Register error:", error);
    sendError(res, "Failed to create account", 500);
  }
}

// POST /auth/login
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    // Generate tokens
    const tokenId = generateTokenId();
    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, tokenId });

    // Clean up old refresh tokens (optional: keep only last 5)
    const userTokens = await prisma.refreshToken.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    if (userTokens.length >= 5) {
      const toDelete = userTokens.slice(0, userTokens.length - 4);
      await prisma.refreshToken.deleteMany({
        where: { id: { in: toDelete.map((t) => t.id) } },
      });
    }

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    // Set HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(
      res,
      { user: userWithoutPassword, accessToken },
      "Logged in successfully"
    );
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Login failed", 500);
  }
}

// POST /auth/refresh
export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    const tokenFromBody = req.body?.refreshToken;
    const refreshToken = tokenFromCookie || tokenFromBody;

    if (!refreshToken) {
      sendError(res, "Refresh token required", 401);
      return;
    }

    // Verify the JWT signature
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      sendError(res, "Invalid or expired refresh token", 401);
      return;
    }

    // Check if token exists in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      // Token reuse detected or expired - invalidate all user tokens
      if (storedToken) {
        await prisma.refreshToken.deleteMany({
          where: { userId: storedToken.userId },
        });
      }
      res.clearCookie("refreshToken");
      sendError(res, "Refresh token expired or already used", 401);
      return;
    }

    const { user } = storedToken;

    // Rotate: delete old, create new
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const newTokenId = generateTokenId();
    const newAccessToken = signAccessToken({ userId: user.id, email: user.email });
    const newRefreshToken = signRefreshToken({ userId: user.id, tokenId: newTokenId });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    sendSuccess(res, { accessToken: newAccessToken }, "Token refreshed");
  } catch (error) {
    console.error("Refresh error:", error);
    sendError(res, "Token refresh failed", 500);
  }
}

// POST /auth/logout
export async function logout(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // Delete from DB
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    res.clearCookie("refreshToken", { path: "/" });
    sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    sendError(res, "Logout failed", 500);
  }
}

// GET /auth/me
export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    sendSuccess(res, { user });
  } catch (error) {
    console.error("GetMe error:", error);
    sendError(res, "Failed to fetch user", 500);
  }
}
