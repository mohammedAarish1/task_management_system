import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain, body, param, query } from "express-validator";
import { sendError } from "../utils/response";

export function validate(chains: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    for (const chain of chains) {
      await chain.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      sendError(res, firstError.msg, 400, "VALIDATION_ERROR");
      return;
    }

    next();
  };
}

// Auth validations
export const registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
];

// Task validations
export const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Task title is required")
    .isLength({ min: 1, max: 255 }).withMessage("Title must be between 1 and 255 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
  body("status")
    .optional()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"]).withMessage("Status must be PENDING, IN_PROGRESS, or COMPLETED"),
  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"]).withMessage("Priority must be LOW, MEDIUM, or HIGH"),
  body("dueDate")
    .optional()
    .isISO8601().withMessage("Due date must be a valid ISO 8601 date"),
];

export const updateTaskValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage("Title must be between 1 and 255 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
  body("status")
    .optional()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"]).withMessage("Status must be PENDING, IN_PROGRESS, or COMPLETED"),
  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"]).withMessage("Priority must be LOW, MEDIUM, or HIGH"),
  body("dueDate")
    .optional()
    .isISO8601().withMessage("Due date must be a valid ISO 8601 date"),
];

export const taskIdValidation = [
  param("id")
    .notEmpty().withMessage("Task ID is required")
    .isString().withMessage("Task ID must be a string"),
];

export const taskQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"]).withMessage("Invalid status filter"),
  query("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"]).withMessage("Invalid priority filter"),
];
