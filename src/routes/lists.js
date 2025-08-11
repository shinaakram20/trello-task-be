import express from 'express';
import { getLists, getList, createList, updateList, updateListPositions, deleteList, getListsByBoard } from '../controllers/listController.js';
import { getTasksByList } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all list routes
// router.use(authMiddleware);

// GET /api/lists - Get all lists
router.get('/', getLists);

// GET /api/lists/board/:boardId - Get lists by board
router.get('/boards/:boardId', getListsByBoard);

// GET /api/lists/:id - Get a specific list
router.get('/:id', getList);

// GET /api/lists/:id/tasks - Get tasks by list
router.get('/:id/tasks', getTasksByList);

// POST /api/lists - Create a new list  
router.post('/', createList);

// PUT /api/lists/:id - Update a list
router.put('/:id', updateList);

// PATCH /api/lists/positions - Update multiple list positions
router.patch('/positions', updateListPositions);

// DELETE /api/lists/:id - Delete a list
router.delete('/:id', deleteList);

export default router;
