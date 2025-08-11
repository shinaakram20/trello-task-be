import { DatabaseService } from './databaseService.js';
import { ActivityService } from './activityService.js';

// In-memory fallback storage for when database is not available
const inMemoryStorage = {
  tasks: [
    {
      id: '880e8400-e29b-41d4-a716-446655440001',
      list_id: '770e8400-e29b-41d4-a716-446655440001',
      title: 'Setup project repository',
      description: 'Initialize Git repo and configure CI/CD pipeline',
      position: 1,
      created_at: '2025-08-01T09:20:00.000Z',
      due_date: null,
      priority: 'medium',
      status: 'todo',
      updated_at: '2025-08-01T09:20:00.000Z',
      list_title: 'To Do',
      board_title: 'Project Alpha'
    },
    {
      id: '880e8400-e29b-41d4-a716-446655440002',
      list_id: '770e8400-e29b-41d4-a716-446655440001',
      title: 'Create project structure',
      description: 'Set up folder structure and basic configuration files',
      position: 2,
      created_at: '2025-08-01T09:21:00.000Z',
      due_date: null,
      priority: 'medium',
      status: 'todo',
      updated_at: '2025-08-01T09:21:00.000Z',
      list_title: 'To Do',
      board_title: 'Project Alpha'
    },
    {
      id: '880e8400-e29b-41d4-a716-446655440003',
      list_id: '770e8400-e29b-41d4-a716-446655440001',
      title: 'Design database schema',
      description: 'Plan and design the database structure',
      position: 3,
      created_at: '2025-08-01T09:22:00.000Z',
      due_date: null,
      priority: 'medium',
      status: 'todo',
      updated_at: '2025-08-01T09:22:00.000Z',
      list_title: 'To Do',
      board_title: 'Project Alpha'
    }
  ],
  lists: [
    { id: '770e8400-e29b-41d4-a716-446655440001', title: 'To Do' },
    { id: '770e8400-e29b-41d4-a716-446655440002', title: 'In Progress' },
    { id: '770e8400-e29b-41d4-a716-446655440003', title: 'Review' },
    { id: '770e8400-e29b-41d4-a716-446655440004', title: 'Done' }
  ]
};

export class TaskService {
  constructor() {
    this.db = new DatabaseService();
    this.activityService = new ActivityService();
    this.useInMemory = false;
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
      console.error('Error in getAllTasks, falling back to in-memory storage:', error);
      this.useInMemory = true;
      return inMemoryStorage.tasks;
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
      console.error('Error in getTasksByList, falling back to in-memory storage:', error);
      this.useInMemory = true;
      return inMemoryStorage.tasks.filter(task => task.list_id === listId);
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
      console.error('Error in getTasksByBoard, falling back to in-memory storage:', error);
      this.useInMemory = true;
      // For simplicity, return all tasks in in-memory mode
      return inMemoryStorage.tasks;
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
      console.error('Error in getTaskById, falling back to in-memory storage:', error);
      this.useInMemory = true;
      return inMemoryStorage.tasks.find(task => task.id === id) || null;
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



      return result.rows[0];
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  }

  async updateTask(id, updateData) {
    try {
      if (this.useInMemory) {
        // Use in-memory storage
        const taskIndex = inMemoryStorage.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
          return null;
        }

        const task = inMemoryStorage.tasks[taskIndex];
        const updatedTask = { ...task, ...updateData, updated_at: new Date().toISOString() };
        inMemoryStorage.tasks[taskIndex] = updatedTask;

        console.log(`Task ${id} updated in in-memory storage`);
        return updatedTask;
      }

      // Use database
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
      /*   if (this.useInMemory) {
          // Use in-memory storage
          const taskIndex = inMemoryStorage.tasks.findIndex(task => task.id === id);
          if (taskIndex !== -1) {
            inMemoryStorage.tasks.splice(taskIndex, 1);
            console.log(`Task ${id} deleted from in-memory storage`);
            return true;
          }
          return false;
        } */

      // Use database - first verify task exists
      const taskQuery = 'SELECT id, list_id FROM tasks WHERE id = $1';
      const taskResult = await this.db.query(taskQuery, [id]);

      if (taskResult.rows.length === 0) {
        console.log(`Task ${id} not found for deletion`);
        return false;
      }

      const task = taskResult.rows[0];

      // Delete the task
      const deleteQuery = 'DELETE FROM tasks WHERE id = $1';
      const result = await this.db.query(deleteQuery, [id]);

      if (result.rowCount > 0) {
        console.log(`Task ${id} deleted successfully from database`);

        // Reorder remaining tasks in the same list to maintain position consistency
        try {
          const reorderQuery = `
            UPDATE tasks 
            SET position = position - 1 
            WHERE list_id = $1 AND position > (
              SELECT position FROM (
                SELECT position FROM tasks WHERE id = $2
              ) AS deleted_task
            )
          `;
          await this.db.query(reorderQuery, [task.list_id, id]);
        } catch (reorderError) {
          console.error('Error reordering tasks after deletion:', reorderError);
        }

        return true;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  }

  // Helper method to get lists for in-memory mode
  async getLists() {
    if (this.useInMemory) {
      return inMemoryStorage.lists;
    }
    // This would need to be implemented for database mode
    return [];
  }
}
