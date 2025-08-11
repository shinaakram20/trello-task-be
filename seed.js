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

// Read and execute seed data
const runSeed = async () => {
  const client = new pg.Client(dbConfig);

  try {
    await client.connect();

    // Read the seed data file
    const seedFilePath = path.join(__dirname, 'seed-data.sql');
    const seedData = fs.readFileSync(seedFilePath, 'utf8');

    // Split the SQL file into individual statements and filter properly
    const statements = seedData
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        const cleanStmt = stmt.replace(/\s+/g, ' ').trim();
        return cleanStmt.length > 0 &&
          !cleanStmt.startsWith('--') &&
          !cleanStmt.startsWith('SELECT') &&
          !cleanStmt.startsWith('UNION');
      });

    let executedCount = 0;
    let skippedCount = 0;

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          executedCount++;
        } catch (error) {
          if (error.code === '23505') { // Unique constraint violation
            skippedCount++;
          } else {
            console.error(`❌ Error executing statement:`, error.message);
            throw error;
          }
        }
      }
    }

    // Show final counts
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const boardCount = await client.query('SELECT COUNT(*) FROM boards');
    const listCount = await client.query('SELECT COUNT(*) FROM lists');
    const taskCount = await client.query('SELECT COUNT(*) FROM tasks');

  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

// Run seed if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed();
}

export { runSeed };
