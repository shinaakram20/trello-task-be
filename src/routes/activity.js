import express from 'express';
import { getBoardActivity, getUserActivity } from '../controllers/activityController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all activity routes
// router.use(authMiddleware);

// GET /api/activity/board/:boardId - Get board activity
router.get('/board/:boardId', getBoardActivity);

// GET /api/activity/user/:userId - Get user activity
router.get('/user/:userId', getUserActivity);

export default router;
