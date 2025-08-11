import dotenv from 'dotenv';
import { DatabaseService } from './src/services/databaseService.js';

// Load environment variables
dotenv.config();

async function testConnection() {


  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }

  const dbService = new DatabaseService();

  try {
    dbService.init();

    const result = await dbService.query('SELECT NOW() as current_time');

    const boardsResult = await dbService.query('SELECT COUNT(*) as count FROM boards');
    const listsResult = await dbService.query('SELECT COUNT(*) as count FROM lists');

  } catch (error) {
    console.error('❌ Connection test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  } finally {
    await dbService.close();
    process.exit(0);
  }
}

testConnection();
