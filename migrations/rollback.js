import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Supabase requires SSL
};

// Get the last executed migration
const getLastMigration = async (client) => {
  const query = 'SELECT name FROM migrations ORDER BY id DESC LIMIT 1';
  const result = await client.query(query);
  return result.rows.length > 0 ? result.rows[0].name : null;
};

// Remove migration record
const removeMigrationRecord = async (client, migrationName) => {
  const query = 'DELETE FROM migrations WHERE name = $1';
  await client.query(query, [migrationName]);
};

// Rollback functions for each migration
const rollbackMigrations = {
  '004_create_tasks_table.sql': async (client) => {
    await client.query('DROP TABLE IF EXISTS tasks CASCADE');
  },

  '003_create_lists_table.sql': async (client) => {
    await client.query('DROP TABLE IF EXISTS lists CASCADE');
  },

  '002_create_boards_table.sql': async (client) => {
    await client.query('DROP TABLE IF EXISTS boards CASCADE');
  },

  '001_create_users_table.sql': async (client) => {
    await client.query('DROP TABLE IF EXISTS users CASCADE');
  }
};

// Main rollback function
const rollbackLastMigration = async () => {
  const client = new pg.Client(dbConfig);

  try {
    await client.connect();

    const lastMigration = await getLastMigration(client);

    if (!lastMigration) {
      return;
    }

    const rollbackFunction = rollbackMigrations[lastMigration];
    if (!rollbackFunction) {
      console.error(`No rollback function found for ${lastMigration}`);
      return;
    }

    await client.query('BEGIN');
    await rollbackFunction(client);
    await removeMigrationRecord(client, lastMigration);
    await client.query('COMMIT');

  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

// Rollback all migrations
const rollbackAllMigrations = async () => {
  const client = new pg.Client(dbConfig);

  try {
    await client.connect();

    await client.query('BEGIN');

    // Drop tables in reverse order (respecting foreign key constraints)
    await client.query('DROP TABLE IF EXISTS tasks CASCADE');

    await client.query('DROP TABLE IF EXISTS lists CASCADE');

    await client.query('DROP TABLE IF EXISTS boards CASCADE');

    await client.query('DROP TABLE IF EXISTS users CASCADE');

    // Clear migrations table
    await client.query('DELETE FROM migrations');

    await client.query('COMMIT');

  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

// Run rollback if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];

  if (command === '--all') {
    rollbackAllMigrations();
  } else {
    rollbackLastMigration();
  }
}

export { rollbackLastMigration, rollbackAllMigrations };
