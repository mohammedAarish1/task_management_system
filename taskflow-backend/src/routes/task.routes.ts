import { Router } from "express";
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
  getTaskStats,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/authenticate";
import {
  validate,
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  taskQueryValidation,
} from "../middleware/validation";

const router = Router();

// All task routes are protected
router.use(authenticate);

router.get("/stats", getTaskStats);
router.get("/", validate(taskQueryValidation), getTasks);
router.post("/", validate(createTaskValidation), createTask);

router.get("/:id", validate(taskIdValidation), getTask);
router.patch("/:id", validate([...taskIdValidation, ...updateTaskValidation]), updateTask);
router.delete("/:id", validate(taskIdValidation), deleteTask);
router.patch("/:id/toggle", validate(taskIdValidation), toggleTask);

export default router;
