import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
};

// Seed data
const seedData = {
  users: [
    { id: '550e8400-e29b-41d4-a716-446655440001', email: 'john.doe@example.com' },
    { id: '550e8400-e29b-41d4-a716-446655440002', email: 'jane.smith@example.com' },
    { id: '550e8400-e29b-41d4-a716-446655440003', email: 'mike.johnson@example.com' },
    { id: '550e8400-e29b-41d4-a716-446655440004', email: 'sarah.wilson@example.com' },
    { id: '550e8400-e29b-41d4-a716-446655440005', email: 'alex.brown@example.com' }
  ],
  
  boards: [
    { id: '660e8400-e29b-41d4-a716-446655440001', user_id: '550e8400-e29b-41d4-a716-446655440001', title: 'Project Alpha', created_at: '2025-08-01 09:00:00' },
    { id: '660e8400-e29b-41d4-a716-446655440002', user_id: '550e8400-e29b-41d4-a716-446655440001', title: 'Marketing Campaign', created_at: '2025-08-02 10:30:00' },
    { id: '660e8400-e29b-41d4-a716-446655440003', user_id: '550e8400-e29b-41d4-a716-446655440002', title: 'Product Development', created_at: '2025-08-03 14:15:00' },
    { id: '660e8400-e29b-41d4-a716-446655440004', user_id: '550e8400-e29b-41d4-a716-446655440003', title: 'Team Building', created_at: '2025-08-04 11:45:00' },
    { id: '660e8400-e29b-41d4-a716-446655440005', user_id: '550e8400-e29b-41d4-a716-446655440004', title: 'Customer Support', created_at: '2025-08-05 16:20:00' }
  ],
  
  lists: [
    // Project Alpha lists
    { id: '770e8400-e29b-41d4-a716-446655440001', board_id: '660e8400-e29b-41d4-a716-446655440001', title: 'To Do', position: 1, created_at: '2025-08-01 09:15:00' },
    { id: '770e8400-e29b-41d4-a716-446655440002', board_id: '660e8400-e29b-41d4-a716-446655440001', title: 'In Progress', position: 2, created_at: '2025-08-01 09:16:00' },
    { id: '770e8400-e29b-41d4-a716-446655440003', board_id: '660e8400-e29b-41d4-a716-446655440001', title: 'Review', position: 3, created_at: '2025-08-01 09:17:00' },
    { id: '770e8400-e29b-41d4-a716-446655440004', board_id: '660e8400-e29b-41d4-a716-446655440001', title: 'Done', position: 4, created_at: '2025-08-01 09:18:00' },
    
    // Marketing Campaign lists
    { id: '770e8400-e29b-41d4-a716-446655440005', board_id: '660e8400-e29b-41d4-a716-446655440002', title: 'Ideas', position: 1, created_at: '2025-08-02 10:35:00' },
    { id: '770e8400-e29b-41d4-a716-446655440006', board_id: '660e8400-e29b-41d4-a716-446655440002', title: 'Planning', position: 2, created_at: '2025-08-02 10:36:00' },
    { id: '770e8400-e29b-41d4-a716-446655440007', board_id: '660e8400-e29b-41d4-a716-446655440002', title: 'Execution', position: 3, created_at: '2025-08-02 10:37:00' },
    { id: '770e8400-e29b-41d4-a716-446655440008', board_id: '660e8400-e29b-41d4-a716-446655440002', title: 'Results', position: 4, created_at: '2025-08-02 10:38:00' },
    
    // Product Development lists
    { id: '770e8400-e29b-41d4-a716-446655440009', board_id: '660e8400-e29b-41d4-a716-446655440003', title: 'Backlog', position: 1, created_at: '2025-08-03 14:20:00' },
    { id: '770e8400-e29b-41d4-a716-446655440010', board_id: '660e8400-e29b-41d4-a716-446655440003', title: 'Sprint Planning', position: 2, created_at: '2025-08-03 14:21:00' },
    { id: '770e8400-e29b-41d4-a716-446655440011', board_id: '660e8400-e29b-41d4-a716-446655440003', title: 'Development', position: 3, created_at: '2025-08-03 14:22:00' },
    { id: '770e8400-e29b-41d4-a716-446655440012', board_id: '660e8400-e29b-41d4-a716-446655440003', title: 'Testing', position: 4, created_at: '2025-08-03 14:23:00' },
    { id: '770e8400-e29b-41d4-a716-446655440013', board_id: '660e8400-e29b-41d4-a716-446655440003', title: 'Deployment', position: 5, created_at: '2025-08-03 14:24:00' },
    
    // Team Building lists
    { id: '770e8400-e29b-41d4-a716-446655440014', board_id: '660e8400-e29b-41d4-a716-446655440004', title: 'Team Activities', position: 1, created_at: '2025-08-04 11:50:00' },
    { id: '770e8400-e29b-41d4-a716-446655440015', board_id: '660e8400-e29b-41d4-a716-446655440004', title: 'Skill Development', position: 2, created_at: '2025-08-04 11:51:00' },
    { id: '770e8400-e29b-41d4-a716-446655440016', board_id: '660e8400-e29b-41d4-a716-446655440004', title: 'Social Events', position: 3, created_at: '2025-08-04 11:52:00' },
    
    // Customer Support lists
    { id: '770e8400-e29b-41d4-a716-446655440017', board_id: '660e8400-e29b-41d4-a716-446655440005', title: 'Support Tickets', position: 1, created_at: '2025-08-05 16:25:00' },
    { id: '770e8400-e29b-41d4-a716-446655440018', board_id: '660e8400-e29b-41d4-a716-446655440005', title: 'Documentation', position: 2, created_at: '2025-08-05 16:26:00' },
    { id: '770e8400-e29b-41d4-a716-446655440019', board_id: '660e8400-e29b-41d4-a716-446655440005', title: 'Training', position: 3, created_at: '2025-08-05 16:27:00' }
  ],
  
  tasks: [
    // Project Alpha - To Do tasks
    { id: '880e8400-e29b-41d4-a716-446655440001', list_id: '770e8400-e29b-41d4-a716-446655440001', title: 'Setup project repository', description: 'Initialize Git repo and configure CI/CD pipeline', position: 1, created_at: '2025-08-01 09:20:00' },
    { id: '880e8400-e29b-41d4-a716-446655440002', list_id: '770e8400-e29b-41d4-a716-446655440001', title: 'Create project structure', description: 'Set up folder structure and basic configuration files', position: 2, created_at: '2025-08-01 09:21:00' },
    { id: '880e8400-e29b-41d4-a716-446655440003', list_id: '770e8400-e29b-41d4-a716-446655440001', title: 'Design database schema', description: 'Plan and design the database structure', position: 3, created_at: '2025-08-01 09:22:00' },
    
    // Project Alpha - In Progress tasks
    { id: '880e8400-e29b-41d4-a716-446655440004', list_id: '770e8400-e29b-41d4-a716-446655440002', title: 'Implement authentication', description: 'Build user authentication system with JWT', position: 1, created_at: '2025-08-01 09:25:00' },
    { id: '880e8400-e29b-41d4-a716-446655440005', list_id: '770e8400-e29b-41d4-a716-446655440002', title: 'Create API endpoints', description: 'Develop RESTful API for boards and tasks', position: 2, created_at: '2025-08-01 09:26:00' },
    
    // Project Alpha - Review tasks
    { id: '880e8400-e29b-41d4-a716-446655440006', list_id: '770e8400-e29b-41d4-a716-446655440003', title: 'Code review setup', description: 'Set up code review process and guidelines', position: 1, created_at: '2025-08-01 09:30:00' },
    
    // Project Alpha - Done tasks
    { id: '880e8400-e29b-41d4-a716-446655440007', list_id: '770e8400-e29b-41d4-a716-446655440004', title: 'Project kickoff meeting', description: 'Initial team meeting and project overview', position: 1, created_at: '2025-08-01 09:35:00' },
    
    // Marketing Campaign - Ideas tasks
    { id: '880e8400-e29b-41d4-a716-446655440008', list_id: '770e8400-e29b-41d4-a716-446655440005', title: 'Social media campaign', description: 'Plan social media marketing strategy', position: 1, created_at: '2025-08-02 10:40:00' },
    { id: '880e8400-e29b-41d4-a716-446655440009', list_id: '770e8400-e29b-41d4-a716-446655440005', title: 'Email newsletter', description: 'Design email marketing campaign', position: 2, created_at: '2025-08-02 10:41:00' },
    { id: '880e8400-e29b-41d4-a716-446655440010', list_id: '770e8400-e29b-41d4-a716-446655440005', title: 'Influencer partnerships', description: 'Identify and approach potential influencers', position: 3, created_at: '2025-08-02 10:42:00' },
    
    // Marketing Campaign - Planning tasks
    { id: '880e8400-e29b-41d4-a716-446655440011', list_id: '770e8400-e29b-41d4-a716-446655440006', title: 'Budget allocation', description: 'Plan and allocate marketing budget', position: 1, created_at: '2025-08-02 10:45:00' },
    { id: '880e8400-e29b-41d4-a716-446655440012', list_id: '770e8400-e29b-41d4-a716-446655440006', title: 'Timeline creation', description: 'Create detailed campaign timeline', position: 2, created_at: '2025-08-02 10:46:00' },
    
    // Product Development - Backlog tasks
    { id: '880e8400-e29b-41d4-a716-446655440013', list_id: '770e8400-e29b-41d4-a716-446655440009', title: 'User research', description: 'Conduct user interviews and surveys', position: 1, created_at: '2025-08-03 14:30:00' },
    { id: '880e8400-e29b-41d4-a716-446655440014', list_id: '770e8400-e29b-41d4-a716-446655440009', title: 'Feature prioritization', description: 'Prioritize features based on user feedback', position: 2, created_at: '2025-08-03 14:31:00' },
    { id: '880e8400-e29b-41d4-a716-446655440015', list_id: '770e8400-e29b-41d4-a716-446655440009', title: 'Technical architecture', description: 'Design system architecture and tech stack', position: 3, created_at: '2025-08-03 14:32:00' },
    
    // Product Development - Sprint Planning tasks
    { id: '880e8400-e29b-41d4-a716-446655440016', list_id: '770e8400-e29b-41d4-a716-446655440010', title: 'Sprint 1 planning', description: 'Plan first sprint tasks and goals', position: 1, created_at: '2025-08-03 14:35:00' },
    { id: '880e8400-e29b-41d4-a716-446655440017', list_id: '770e8400-e29b-41d4-a716-446655440010', title: 'Team capacity planning', description: 'Assess team availability and skills', position: 2, created_at: '2025-08-03 14:36:00' },
    
    // Team Building tasks
    { id: '880e8400-e29b-41d4-a716-446655440018', list_id: '770e8400-e29b-41d4-a716-446655440014', title: 'Team lunch', description: 'Organize weekly team lunch meetings', position: 1, created_at: '2025-08-04 11:55:00' },
    { id: '880e8400-e29b-41d4-a716-446655440019', list_id: '770e8400-e29b-41d4-a716-446655440014', title: 'Hackathon planning', description: 'Plan quarterly hackathon event', position: 2, created_at: '2025-08-04 11:56:00' },
    { id: '880e8400-e29b-41d4-a716-446655440020', list_id: '770e8400-e29b-41d4-a716-446655440015', title: 'Training sessions', description: 'Schedule skill development workshops', position: 1, created_at: '2025-08-04 11:57:00' },
    { id: '880e8400-e29b-41d4-a716-446655440021', list_id: '770e8400-e29b-41d4-a716-446655440016', title: 'Holiday party', description: 'Plan end-of-year celebration', position: 1, created_at: '2025-08-04 11:58:00' },
    
    // Customer Support tasks
    { id: '880e8400-e29b-41d4-a716-446655440022', list_id: '770e8400-e29b-41d4-a716-446655440017', title: 'Ticket prioritization', description: 'Implement ticket priority system', position: 1, created_at: '2025-08-05 16:30:00' },
    { id: '880e8400-e29b-41d4-a716-446655440023', list_id: '770e8400-e29b-41d4-a716-446655440017', title: 'Response time tracking', description: 'Track and improve response times', position: 2, created_at: '2025-08-05 16:31:00' },
    { id: '880e8400-e29b-41d4-a716-446655440024', list_id: '770e8400-e29b-41d4-a716-446655440018', title: 'FAQ creation', description: 'Create comprehensive FAQ section', position: 1, created_at: '2025-08-05 16:32:00' },
    { id: '880e8400-e29b-41d4-a716-446655440025', list_id: '770e8400-e29b-41d4-a716-446655440019', title: 'Support team training', description: 'Train team on new tools and processes', position: 1, created_at: '2025-08-05 16:33:00' }
  ]
};

// Seed functions
const seedTable = async (client, tableName, data, insertQuery) => {
  let inserted = 0;
  let skipped = 0;
  
  for (const row of data) {
    try {
      await client.query(insertQuery, Object.values(row));
      inserted++;
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        skipped++;
      } else {
        throw error;
      }
    }
  }
  
  return { inserted, skipped };
};

// Main seeding function
const runSeed = async () => {
  const client = new pg.Client(dbConfig);
  
  try {
    await client.connect();
    
    // Seed users
    await seedTable(
      client, 
      'users', 
      seedData.users, 
      'INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING'
    );
    
    // Seed boards
    await seedTable(
      client, 
      'boards', 
      seedData.boards, 
      'INSERT INTO boards (id, user_id, title, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING'
    );
    
    // Seed lists
    await seedTable(
      client, 
      'lists', 
      seedData.lists, 
      'INSERT INTO lists (id, board_id, title, position, created_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING'
    );
    
    // Seed tasks
    await seedTable(
      client, 
      'tasks', 
      seedData.tasks, 
      'INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING'
    );
    
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
