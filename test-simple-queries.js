import dotenv from 'dotenv';
import { DatabaseService } from './src/services/databaseService.js';

// Load environment variables
dotenv.config();

async function testSimpleQueries() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }

  const dbService = new DatabaseService();

  try {
    dbService.init();

    // Test 1: Basic query
    const basicResult = await dbService.query('SELECT 1 as test');

    // Test 2: Check if boards table exists
    try {
      const boardsResult = await dbService.query('SELECT COUNT(*) as count FROM boards');
    } catch (error) {
    }

    // Test 3: Check if lists table exists
    try {
      const listsResult = await dbService.query('SELECT COUNT(*) as count FROM lists');
    } catch (error) {
    }

    // Test 4: Check if tasks table exists
    try {
      const tasksResult = await dbService.query('SELECT COUNT(*) as count FROM tasks');
    } catch (error) {
    }

    // Test 5: Try to get lists by board (if boards exist)
    try {
      const boards = await dbService.query('SELECT id FROM boards LIMIT 1');
      if (boards.rows.length > 0) {
        const boardId = boards.rows[0].id;

        const listsQuery = `
          SELECT l.*, b.title as board_title
          FROM lists l
          JOIN boards b ON l.board_id = b.id
          WHERE l.board_id = $1
          ORDER BY l.position
        `;
        const listsResult = await dbService.query(listsQuery, [boardId]);
      } else {
      }
    } catch (error) {
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await dbService.close();
    process.exit(0);
  }
}

testSimpleQueries();
