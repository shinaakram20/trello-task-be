import express from 'express';
import { 
  getCommentsByTask, 
  getComment, 
  createComment, 
  updateComment, 
  deleteComment, 
  getCommentCount 
} from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all comment routes
// router.use(authMiddleware);

// GET /api/comments/task/:taskId - Get comments by task
router.get('/task/:taskId', getCommentsByTask);

// GET /api/comments/:id - Get a specific comment
router.get('/:id', getComment);

// POST /api/comments - Create a new comment
router.post('/', createComment);

// PUT /api/comments/:id - Update a comment
router.put('/:id', updateComment);

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', deleteComment);

// GET /api/comments/count/:taskId - Get comment count by task
router.get('/count/:taskId', getCommentCount);

export default router;
