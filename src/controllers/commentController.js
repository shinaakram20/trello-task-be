import { CommentService } from '../services/commentService.js';

const commentService = new CommentService();

// Get comments by task
export const getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await commentService.getCommentsByTask(taskId);
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments by task:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
};

// Get a specific comment
export const getComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await commentService.getCommentById(id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    res.json(comment);
  } catch (error) {
    console.error('Error getting comment:', error);
    res.status(500).json({ error: 'Failed to get comment' });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { taskId, content } = req.body;
    const userId = req.body.userId || '550e8400-e29b-41d4-a716-446655440001'; // Default user ID for now
    
    if (!taskId || !content) {
      return res.status(400).json({ error: 'Task ID and content are required' });
    }
    
    const comment = await commentService.createComment({
      taskId,
      userId,
      content
    });
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const comment = await commentService.updateComment(id, { content });
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await commentService.deleteComment(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

// Get comment count by task
export const getCommentCount = async (req, res) => {
  try {
    const { taskId } = req.params;
    const count = await commentService.getCommentCountByTask(taskId);
    res.json({ count });
  } catch (error) {
    console.error('Error getting comment count:', error);
    res.status(500).json({ error: 'Failed to get comment count' });
  }
};
