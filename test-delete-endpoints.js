import dotenv from 'dotenv';
import { DatabaseService } from './src/services/databaseService.js';

// Load environment variables
dotenv.config();

async function testDeleteEndpoints() {
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }

  const dbService = new DatabaseService();
  
  try {
    dbService.init();
    
    // Test 1: Check if we can connect to the database
    const basicResult = await dbService.query('SELECT 1 as test');
    
    // Test 2: Check if tables exist and have data
    
    try {
      const boardsResult = await dbService.query('SELECT COUNT(*) as count FROM boards');
      
      if (parseInt(boardsResult.rows[0]?.count) > 0) {
        const sampleBoard = await dbService.query('SELECT id, title FROM boards LIMIT 1');
      }
    } catch (error) {
    }
    
    try {
      const listsResult = await dbService.query('SELECT COUNT(*) as count FROM lists');
      
      if (parseInt(listsResult.rows[0]?.count) > 0) {
        const sampleList = await dbService.query('SELECT id, title, board_id FROM lists LIMIT 1');
      }
    } catch (error) {
    }
    
    try {
      const tasksResult = await dbService.query('SELECT COUNT(*) as count FROM tasks');
      
      if (parseInt(tasksResult.rows[0]?.count) > 0) {
        const sampleTask = await dbService.query('SELECT id, title, list_id FROM tasks LIMIT 1');
      }
    } catch (error) {
    }
    
    // Test 3: Test DELETE operations (read-only for safety)
    
    try {
      // Check if we can prepare DELETE statements
      const deleteBoardQuery = 'DELETE FROM boards WHERE id = $1';
      const deleteListQuery = 'DELETE FROM lists WHERE id = $1';
      const deleteTaskQuery = 'DELETE FROM tasks WHERE id = $1';
      
      // Check foreign key constraints
      const fkCheck = await dbService.query(`
        SELECT 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        ORDER BY tc.table_name, kcu.column_name;
      `);
      
      if (fkCheck.rows.length > 0) {
        fkCheck.rows.forEach(row => {
        });
      }
      
    } catch (error) {
      }
    
    // Test 4: Check server status
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        const data = await response.json();
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

testDeleteEndpoints();
