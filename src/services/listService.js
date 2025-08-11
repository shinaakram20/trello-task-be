import { DatabaseService } from './databaseService.js';
import { ActivityService } from './activityService.js';

export class ListService {
  constructor() {
    this.db = new DatabaseService();
    this.activityService = new ActivityService();
  }

  async getAllLists() {
    try {
      const query = `
        SELECT l.*, b.title as board_title
        FROM lists l
        JOIN boards b ON l.board_id = b.id
        ORDER BY l.board_id, l.position
      `;
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in getAllLists:', error);
      throw error;
    }
  }

  async getListsByBoard(boardId) {
    try {
      const query = `
        SELECT l.*, b.title as board_title
        FROM lists l
        JOIN boards b ON l.board_id = b.id
        WHERE l.board_id = $1
        ORDER BY l.position
        `;
      const result = await this.db.query(query, [boardId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getListsByBoard:', error);
      throw error;
    }
  }

  async getListById(id) {
    try {
      const query = `
        SELECT l.*, b.title as board_title
        FROM lists l
        JOIN boards b ON l.board_id = b.id
        WHERE l.id = $1
      `;
      const result = await this.db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in getListById:', error);
      throw error;
    }
  }

  async createList(listData) {
    try {
      const { title, boardId, position } = listData;
      
      // Verify board exists
      const boardQuery = 'SELECT id FROM boards WHERE id = $1';
      const boardResult = await this.db.query(boardQuery, [boardId]);
      
      if (boardResult.rows.length === 0) {
        throw new Error('Board not found');
      }
      
      // If no position specified, add to end of board
      let finalPosition = position;
      if (!finalPosition) {
        const maxPositionQuery = 'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM lists WHERE board_id = $1';
        const maxResult = await this.db.query(maxPositionQuery, [boardId]);
        finalPosition = maxResult.rows[0].next_position;
      }

      const query = `
        INSERT INTO lists (title, board_id, position, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *
      `;
      const result = await this.db.query(query, [title, boardId, finalPosition]);
      
      // Log activity
      if (result.rows[0]) {
        try {
          this.activityService.logListCreated(
            boardId,
            '550e8400-e29b-41d4-a716-446655440001', // Default user ID for now
            result.rows[0]
          );
        } catch (error) {
          console.error('Error logging activity for list creation:', error);
          // Don't fail list creation if activity logging fails
        }
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in createList:', error);
      throw error;
    }
  }

  async updateList(id, updateData) {
    try {
      const { title, position } = updateData;
      
      // Build dynamic query based on provided fields
      let query = 'UPDATE lists SET updated_at = NOW()';
      const params = [];
      let paramIndex = 1;
      
      if (title !== undefined) {
        query += `, title = $${paramIndex}`;
        params.push(title);
        paramIndex++;
      }
      
      if (position !== undefined) {
        query += `, position = $${paramIndex}`;
        params.push(position);
        paramIndex++;
      }
      
      query += ` WHERE id = $${paramIndex} RETURNING *`;
      params.push(id);
      
      const result = await this.db.query(query, params);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in updateList:', error);
      throw error;
    }
  }

  async updateListPositions(updates) {
    try {
      // updates should be an array of { id, position } objects
      if (!Array.isArray(updates) || updates.length === 0) {
        throw new Error('Updates array is required and must not be empty');
      }

      // Get the board_id from the first list to ensure all lists are from the same board
      const firstListQuery = 'SELECT board_id FROM lists WHERE id = $1';
      const firstListResult = await this.db.query(firstListQuery, [updates[0].id]);
      
      if (firstListResult.rows.length === 0) {
        throw new Error('List not found');
      }
      
      const boardId = firstListResult.rows[0].board_id;

      // First, temporarily set all positions to negative values to avoid conflicts
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const tempPosition = -(i + 1);
        
        await this.db.query(
          'UPDATE lists SET position = $1, updated_at = NOW() WHERE id = $2',
          [tempPosition, update.id]
        );
      }

      // Now set the actual positions
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const newPosition = i + 1; // Start from 1 and increment
        
        await this.db.query(
          'UPDATE lists SET position = $1, updated_at = NOW() WHERE id = $2',
          [newPosition, update.id]
        );
      }
      
      // Return the updated lists
      const updatedLists = await this.getListsByBoard(boardId);
      return updatedLists;
      
    } catch (error) {
      console.error('Error in updateListPositions:', error);
      throw error;
    }
  }

  async deleteList(id) {
    try {
      // First verify list exists and get its details
      const listQuery = 'SELECT id, board_id, position FROM lists WHERE id = $1';
      const listResult = await this.db.query(listQuery, [id]);
      
      if (listResult.rows.length === 0) {
        console.log(`List ${id} not found for deletion`);
        return false;
      }
      
      const list = listResult.rows[0];
      
      // Delete all tasks in the list first (due to foreign key constraints)
      const deleteTasksQuery = 'DELETE FROM tasks WHERE list_id = $1';
      const tasksResult = await this.db.query(deleteTasksQuery, [id]);
      console.log(`Deleted ${tasksResult.rowCount} tasks from list ${id}`);
      
      // Delete the list
      const deleteQuery = 'DELETE FROM lists WHERE id = $1';
      const result = await this.db.query(deleteQuery, [id]);
      
      if (result.rowCount > 0) {
        console.log(`List ${id} deleted successfully from database`);
        
        // Reorder remaining lists in the same board to maintain position consistency
        try {
          const reorderQuery = `
            UPDATE lists 
            SET position = position - 1 
            WHERE board_id = $1 AND position > $2
          `;
          await this.db.query(reorderQuery, [list.board_id, list.position]);
        } catch (reorderError) {
          console.error('Error reordering lists after deletion:', reorderError);
          // Don't fail the deletion if reordering fails
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in deleteList:', error);
      throw error;
    }
  }
}
