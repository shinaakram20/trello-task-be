import { DatabaseService } from './databaseService.js';
import { ActivityService } from './activityService.js';

export class CommentService {
  constructor() {
    this.db = new DatabaseService();
    this.activityService = new ActivityService();
  }

  async getCommentsByTask(taskId) {
    try {
      const query = `
        SELECT 
          c.*,
          'System User' as user_name,
          'system@example.com' as user_email
        FROM comments c
        WHERE c.task_id = $1
        ORDER BY c.created_at ASC
      `;
      const result = await this.db.query(query, [taskId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting comments by task:', error);
      throw error;
    }
  }

  async getCommentById(id) {
    try {
      const query = `
        SELECT 
          c.*,
          'System User' as user_name,
          'system@example.com' as user_email
        FROM comments c
        WHERE c.id = $1
      `;
      const result = await this.db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting comment by id:', error);
      throw error;
    }
  }

  async createComment(commentData) {
    try {
      const { taskId, userId, content } = commentData;
      
      // Verify task exists
      const taskQuery = 'SELECT id, list_id FROM tasks WHERE id = $1';
      const taskResult = await this.db.query(taskQuery, [taskId]);
      
      if (taskResult.rows.length === 0) {
        throw new Error('Task not found');
      }

      const query = `
        INSERT INTO comments (task_id, user_id, content, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *
      `;
      const result = await this.db.query(query, [taskId, userId, content]);
      
      // Log activity for comment creation
      if (result.rows[0]) {
        try {
          // Get board_id from task's list
          const listQuery = 'SELECT board_id FROM lists WHERE id = $1';
          const listResult = await this.db.query(listQuery, [taskResult.rows[0].list_id]);
          if (listResult.rows[0]) {
            this.activityService.logActivity({
              boardId: listResult.rows[0].board_id,
              userId: userId || '550e8400-e29b-41d4-a716-446655440001',
              actionType: 'comment',
              entityType: 'task',
              entityId: taskId,
              entityTitle: 'Task Comment',
              newValues: { content: content.substring(0, 50) + (content.length > 50 ? '...' : '') },
              metadata: { commentId: result.rows[0].id, taskId }
            });
          }
        } catch (error) {
          console.error('Error logging comment activity:', error);
        }
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  async updateComment(id, updateData) {
    try {
      const { content } = updateData;
      
      const query = `
        UPDATE comments 
        SET content = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;
      const result = await this.db.query(query, [content, id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  async deleteComment(id) {
    try {
      const deleteQuery = 'DELETE FROM comments WHERE id = $1';
      const result = await this.db.query(deleteQuery, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  async getCommentCountByTask(taskId) {
    try {
      const query = 'SELECT COUNT(*) as count FROM comments WHERE task_id = $1';
      const result = await this.db.query(query, [taskId]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting comment count:', error);
      return 0;
    }
  }
}
