import { DatabaseService } from './databaseService.js';

export class ActivityService {
  constructor() {
    this.db = new DatabaseService();
  }

  async logActivity(activityData) {
    try {
      const {
        boardId,
        userId,
        actionType,
        entityType,
        entityId,
        entityTitle,
        oldValues,
        newValues,
        metadata
      } = activityData;

      const query = `
        INSERT INTO activity_log (
          board_id, user_id, action_type, entity_type, entity_id, 
          entity_title, old_values, new_values, metadata, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING *
      `;

      const result = await this.db.query(query, [
        boardId,
        userId,
        actionType,
        entityType,
        entityId,
        entityTitle,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        metadata ? JSON.stringify(metadata) : null
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Error logging activity:', error);
      return null;
    }
  }

  async getBoardActivity(boardId, limit = 50) {
    try {
      const query = `
        SELECT 
          al.*,
          'System User' as user_name,
          'system@example.com' as user_email
        FROM activity_log al
        WHERE al.board_id = $1
        ORDER BY al.created_at DESC
        LIMIT $2
      `;

      const result = await this.db.query(query, [boardId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting board activity:', error);
      throw error;
    }
  }

  async logTaskCreated(boardId, userId, task) {
    return this.logActivity({
      boardId,
      userId,
      actionType: 'create',
      entityType: 'task',
      entityId: task.id,
      entityTitle: task.title,
      newValues: task,
      metadata: { listId: task.list_id }
    });
  }

  async logTaskMoved(boardId, userId, task, oldListId, newListId) {
    return this.logActivity({
      boardId,
      userId,
      actionType: 'move',
      entityType: 'task',
      entityId: task.id,
      entityTitle: task.title,
      oldValues: { listId: oldListId },
      newValues: { listId: newListId },
      metadata: { 
        oldListId, 
        newListId,
        taskTitle: task.title 
      }
    });
  }

  async logListCreated(boardId, userId, list) {
    return this.logActivity({
      boardId,
      userId,
      actionType: 'create',
      entityType: 'list',
      entityId: list.id,
      entityTitle: list.title,
      newValues: list
    });
  }
}
