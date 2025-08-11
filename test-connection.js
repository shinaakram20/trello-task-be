import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables
dotenv.config();

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
};

const client = new pg.Client(dbConfig);

try {
  await client.connect();

  // Test a simple query
  const result = await client.query('SELECT NOW()');

  await client.end();
} catch (error) {
  console.error('Connection failed:', error.message);
  process.exit(1);
}
