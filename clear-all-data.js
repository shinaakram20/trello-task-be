import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Supabase requires SSL
};

// Clear all data from all tables
const clearAllData = async () => {
  const client = new pg.Client(dbConfig);

  try {
    await client.connect();

    await client.query('BEGIN');

    // Clear data from all tables in the correct order (respecting foreign key constraints)
    // Start with tables that have foreign key references

    // Clear comments table first (references tasks)
    await client.query('DELETE FROM comments');

    // Clear activity log table (references boards and users)
    await client.query('DELETE FROM activity_log');

    // Clear tasks table (references lists)
    await client.query('DELETE FROM tasks');

    // Clear lists table (references boards)
    await client.query('DELETE FROM lists');

    // Clear boards table (references users)
    await client.query('DELETE FROM boards');

    // Clear users table last (no foreign key references)
    await client.query('DELETE FROM users');

    // Reset auto-increment sequences if any
    await client.query('ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE IF EXISTS boards_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE IF EXISTS lists_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE IF EXISTS tasks_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE IF EXISTS activity_log_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE IF EXISTS comments_id_seq RESTART WITH 1');

    await client.query('COMMIT');

  } catch (error) {
    console.error('Failed to clear data:', error);
    await client.query('ROLLBACK');
    process.exit(1);
  } finally {
    await client.end();
  }
};

// Run the script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  clearAllData();
}

export { clearAllData };
