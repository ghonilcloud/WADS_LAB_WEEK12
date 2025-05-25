import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.use(protect); // All task routes require authentication

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

export default router;