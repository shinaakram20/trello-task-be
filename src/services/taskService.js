import { DatabaseService } from './databaseService.js';
import { ActivityService } from './activityService.js';

export class TaskService {
  constructor() {
    this.db = new DatabaseService();
    this.activityService = new ActivityService();
  }

  async getAllTasks() {
    try {
      const query = `
        SELECT t.*, l.title as list_title, b.title as board_title
        FROM tasks t
        JOIN lists l ON t.list_id = l.id
        JOIN boards b ON l.board_id = b.id
        ORDER BY l.board_id, l.position, t.position
      `;
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in getAllTasks:', error);
      throw error;
    }
  }

  async getTasksByList(listId) {
    try {
      const query = `
        SELECT t.*, l.title as list_title, b.title as board_title
        FROM tasks t
        JOIN lists l ON t.list_id = l.id
        JOIN boards b ON l.board_id = b.id
        WHERE t.list_id = $1
        ORDER BY t.position
      `;
      const result = await this.db.query(query, [listId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getTasksByList:', error);
      throw error;
    }
  }

  async getTasksByBoard(boardId) {
    try {
      const query = `
        SELECT t.*, l.title as list_title, b.title as board_title
        FROM tasks t
        JOIN lists l ON t.list_id = l.id
        JOIN boards b ON l.board_id = b.id
        WHERE l.board_id = $1
        ORDER BY l.position, t.position
      `;
      const result = await this.db.query(query, [boardId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getTasksByBoard:', error);
      throw error;
    }
  }

  async getTaskById(id) {
    try {
      const query = `
        SELECT t.*, l.title as list_title, b.title as board_title
        FROM tasks t
        JOIN lists l ON t.list_id = l.id
        JOIN boards b ON l.board_id = b.id
        WHERE t.id = $1
      `;
      const result = await this.db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in getTaskById:', error);
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      const { title, description, listId, position, dueDate, priority, status } = taskData;
      
      // Verify list exists
      const listQuery = 'SELECT id FROM lists WHERE id = $1';
      const listResult = await this.db.query(listQuery, [listId]);
      
      if (listResult.rows.length === 0) {
        throw new Error('List not found');
      }
      
      // If no position specified, add to end of list
      let finalPosition = position;
      if (!finalPosition) {
        const maxPositionQuery = 'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM tasks WHERE list_id = $1';
        const maxResult = await this.db.query(maxPositionQuery, [listId]);
        finalPosition = maxResult.rows[0].next_position;
      }

      // Determine status - use provided status or derive from list name
      let finalStatus = status;
      if (!finalStatus) {
        const listQuery = 'SELECT title FROM lists WHERE id = $1';
        const listResult = await this.db.query(listQuery, [listId]);
        if (listResult.rows[0]) {
          finalStatus = this.getStatusFromListName(listResult.rows[0].title);
        } else {
          finalStatus = 'todo';
        }
      }

      const query = `
        INSERT INTO tasks (title, description, list_id, position, due_date, priority, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *
      `;
      const result = await this.db.query(query, [title, description, listId, finalPosition, dueDate, priority || 'medium', finalStatus]);
      
      // Log activity - temporarily disabled for debugging
      /*
      if (result.rows[0]) {
        try {
          // Get board_id from list
          const boardQuery = 'SELECT board_id FROM lists WHERE id = $1';
          const boardResult = await this.db.query(boardQuery, [listId]);
          if (boardResult.rows[0]) {
            this.activityService.logTaskCreated(
              boardResult.rows[0].board_id,
              '550e8400-e29b-41d4-a716-446655440001', // Default user ID for now
              result.rows[0]
            );
          }
        } catch (error) {
          console.error('Error logging activity for task creation:', error);
          // Don't fail task creation if activity logging fails
        }
      }
      */
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  }

  async updateTask(id, updateData) {
    try {
      const { title, description, position, dueDate, priority, status } = updateData;
      
      // Build dynamic query based on provided fields
      let query = 'UPDATE tasks SET updated_at = NOW()';
      const params = [];
      let paramIndex = 1;
      
      if (title !== undefined) {
        query += `, title = $${paramIndex}`;
        params.push(title);
        paramIndex++;
      }
      
      if (description !== undefined) {
        query += `, description = $${paramIndex}`;
        params.push(description);
        paramIndex++;
      }
      
      if (position !== undefined) {
        query += `, position = $${paramIndex}`;
        params.push(position);
        paramIndex++;
      }
      
      if (dueDate !== undefined) {
        query += `, due_date = $${paramIndex}`;
        params.push(dueDate);
        paramIndex++;
      }
      
      if (priority !== undefined) {
        query += `, priority = $${paramIndex}`;
        params.push(priority);
        paramIndex++;
      }
      
      if (status !== undefined) {
        query += `, status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }
      
      query += ` WHERE id = $${paramIndex} RETURNING *`;
      params.push(id);
      
      const result = await this.db.query(query, params);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error;
    }
  }

  async moveTask(id, newListId, newPosition) {
    try {
      // Verify list exists and get its title
      const listQuery = 'SELECT id, title FROM lists WHERE id = $1';
      const listResult = await this.db.query(listQuery, [newListId]);
      
      if (listResult.rows.length === 0) {
        throw new Error('List not found');
      }

      // Determine new status based on list title
      const listTitle = listResult.rows[0].title;
      const newStatus = this.getStatusFromListName(listTitle);

      // If no new position specified, add to end of new list
      let finalPosition = newPosition;
      if (!finalPosition) {
        const maxPositionQuery = 'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM tasks WHERE list_id = $1';
        const maxResult = await this.db.query(maxPositionQuery, [newListId]);
        finalPosition = maxResult.rows[0].next_position;
      }

      const query = `
        UPDATE tasks 
        SET list_id = $1, position = $2, status = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `;
      const result = await this.db.query(query, [newListId, finalPosition, newStatus, id]);
      
      // Log activity for task movement
      if (result.rows[0]) {
        try {
          // Get the old list_id and board_id for logging
          const oldTaskQuery = 'SELECT list_id FROM tasks WHERE id = $1';
          const oldTaskResult = await this.db.query(oldTaskQuery, [id]);
          const oldListId = oldTaskResult.rows[0]?.list_id;
          
          // Get board_id from new list
          const boardQuery = 'SELECT board_id FROM lists WHERE id = $1';
          const boardResult = await this.db.query(boardQuery, [newListId]);
          const boardId = boardResult.rows[0]?.board_id;
          
          if (boardId && oldListId) {
            this.activityService.logTaskMoved(
              boardId,
              '550e8400-e29b-41d4-a716-446655440001', // Default user ID for now
              result.rows[0],
              oldListId,
              newListId
            );
          }
        } catch (error) {
          console.error('Error logging activity for task movement:', error);
          // Don't fail task movement if activity logging fails
        }
      }
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in moveTask:', error);
      throw error;
    }
  }

  async updateTaskPosition(id, newPosition) {
    try {
      const query = `
        UPDATE tasks 
        SET position = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;
      const result = await this.db.query(query, [newPosition, id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in updateTaskPosition:', error);
      throw error;
    }
  }

  async updateTaskPositions(updates) {
    try {
      // updates should be an array of { id, position } objects
      if (!Array.isArray(updates) || updates.length === 0) {
        throw new Error('Updates array is required and must not be empty');
      }

      // Get the list_id from the first task to ensure all tasks are from the same list
      const firstTaskQuery = 'SELECT list_id FROM tasks WHERE id = $1';
      const firstTaskResult = await this.db.query(firstTaskQuery, [updates[0].id]);
      
      if (firstTaskResult.rows.length === 0) {
        throw new Error('Task not found');
      }
      
      const listId = firstTaskResult.rows[0].list_id;

      // First, temporarily set all positions to negative values to avoid conflicts
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const tempPosition = -(i + 1);
        
        await this.db.query(
          'UPDATE tasks SET position = $1, updated_at = NOW() WHERE id = $2',
          [tempPosition, update.id]
        );
      }

      // Now set the actual positions
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const newPosition = i + 1; // Start from 1 and increment
        
        await this.db.query(
          'UPDATE tasks SET position = $1, updated_at = NOW() WHERE id = $2',
          [newPosition, update.id]
        );
      }
      
      // Return the updated tasks
      const updatedTasks = await this.getTasksByList(listId);
      return updatedTasks;
      
    } catch (error) {
      console.error('Error in updateTaskPositions:', error);
      throw error;
    }
  }

  getStatusFromListName(listName) {
    const name = listName.toLowerCase();
    if (name.includes('done') || name.includes('complete') || name.includes('finished')) {
      return 'done';
    } else if (name.includes('progress') || name.includes('doing') || name.includes('working')) {
      return 'in_progress';
    } else {
      return 'todo';
    }
  }

  async deleteTask(id) {
    try {
      const deleteQuery = 'DELETE FROM tasks WHERE id = $1';
      const result = await this.db.query(deleteQuery, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  }
}
