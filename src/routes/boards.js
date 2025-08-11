import express from 'express';
import { getBoards, getBoard, createBoard, updateBoard, deleteBoard } from '../controllers/boardController.js';
import { getListsByBoard } from '../controllers/listController.js';
// import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Temporarily disable auth middleware for testing
// router.use(authMiddleware);

// GET /api/boards - Get all boards
router.get('/', getBoards);

// GET /api/boards/:id - Get a specific board
router.get('/:id', getBoard);

// GET /api/boards/:id/lists - Get lists by board
router.get('/:id/lists', getListsByBoard);

// POST /api/boards - Create a new board
router.post('/', createBoard);

// PUT /api/boards/:id - Update a board
router.put('/:id', updateBoard);

// DELETE /api/boards/:id - Delete a board
router.delete('/:id', deleteBoard);

export default router;
