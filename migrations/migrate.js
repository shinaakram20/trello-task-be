import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Supabase requires SSL
};

// Create migrations table if it doesn't exist
const createMigrationsTable = async (client) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT NOW()
    );
  `;
  
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error('Error creating migrations table:', error);
    throw error;
  }
};

// Check if migration has been executed
const isMigrationExecuted = async (client, migrationName) => {
  const query = 'SELECT id FROM migrations WHERE name = $1';
  const result = await client.query(query, [migrationName]);
  return result.rows.length > 0;
};

// Mark migration as executed
const markMigrationExecuted = async (client, migrationName) => {
  const query = 'INSERT INTO migrations (name) VALUES ($1)';
  await client.query(query, [migrationName]);
};

// Execute a single migration
const executeMigration = async (client, migrationFile) => {
  const migrationPath = path.join(__dirname, migrationFile);
  const migrationContent = fs.readFileSync(migrationPath, 'utf8');
  
  try {
    await client.query('BEGIN');
    await client.query(migrationContent);
    await markMigrationExecuted(client, migrationFile);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Failed to execute migration ${migrationFile}:`, error);
    throw error;
  }
};

// Main migration function
const runMigrations = async () => {
  const client = new pg.Client(dbConfig);
  
  try {
    await client.connect();
    
    // Create migrations table
    await createMigrationsTable(client);
    
    // Get all migration files in order
    const migrationFiles = [
      '001_create_users_table.sql',
      '002_create_boards_table.sql',
      '003_create_lists_table.sql',
      '004_create_tasks_table.sql',
      '005_add_missing_columns.sql',
      '006_create_activity_log_table.sql',
      '007_create_comments_table.sql'
    ];
    
    for (const migrationFile of migrationFiles) {
      const isExecuted = await isMigrationExecuted(client, migrationFile);
      
      if (isExecuted) {
      } else {
        await executeMigration(client, migrationFile);
      }
    }
      
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

// Run migrations if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations();
}

export { runMigrations };
