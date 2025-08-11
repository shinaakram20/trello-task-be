import express from 'express';
import { getTasks, getTask, createTask, updateTask, deleteTask, getTasksByList, getTasksByBoard, moveTask, updateTaskPosition, updateTaskPositions } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all task routes
// router.use(authMiddleware);

// GET /api/tasks - Get all tasks
router.get('/', getTasks);

// GET /api/tasks/list/:listId - Get tasks by list
router.get('/list/:listId', getTasksByList);

// GET /api/tasks/board/:boardId - Get tasks by board
router.get('/board/:boardId', getTasksByBoard);

// GET /api/tasks/:id - Get a specific task
router.get('/:id', getTask);

// POST /api/tasks - Create a new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', updateTask);

// PATCH /api/tasks/:id/move - Move a task to another list
router.patch('/:id/move', moveTask);

// PATCH /api/tasks/:id/position - Update task position within the same list
router.patch('/:id/position', updateTaskPosition);

// PATCH /api/tasks/positions - Update multiple task positions
router.patch('/positions', updateTaskPositions);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

export default router;
