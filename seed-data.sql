-- Seed data for Trello-like application
-- This file contains sample data for testing and development

-- Seed users
INSERT INTO users (id, email) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com'),
  ('550e8400-e29b-41d4-a716-446655440003', 'mike.johnson@example.com'),
  ('550e8400-e29b-41d4-a716-446655440004', 'sarah.wilson@example.com'),
  ('550e8400-e29b-41d4-a716-446655440005', 'alex.brown@example.com')
ON CONFLICT (email) DO NOTHING;

-- Seed boards
INSERT INTO boards (id, user_id, title, created_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Project Alpha', '2025-08-01 09:00:00'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Marketing Campaign', '2025-08-02 10:30:00'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Product Development', '2025-08-03 14:15:00'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Team Building', '2025-08-04 11:45:00'),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'Customer Support', '2025-08-05 16:20:00')
ON CONFLICT (id) DO NOTHING;

-- Seed lists for Project Alpha
INSERT INTO lists (id, board_id, title, position, created_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'To Do', 1, '2025-08-01 09:15:00'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'In Progress', 2, '2025-08-01 09:16:00'),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Review', 3, '2025-08-01 09:17:00'),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'Done', 4, '2025-08-01 09:18:00')
ON CONFLICT (id) DO NOTHING;

-- Seed lists for Marketing Campaign
INSERT INTO lists (id, board_id, title, position, created_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Ideas', 1, '2025-08-02 10:35:00'),
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Planning', 2, '2025-08-02 10:36:00'),
  ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', 'Execution', 3, '2025-08-02 10:37:00'),
  ('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440002', 'Results', 4, '2025-08-02 10:38:00')
ON CONFLICT (id) DO NOTHING;

-- Seed lists for Product Development
INSERT INTO lists (id, board_id, title, position, created_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440003', 'Backlog', 1, '2025-08-03 14:20:00'),
  ('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440003', 'Sprint Planning', 2, '2025-08-03 14:21:00'),
  ('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440003', 'Development', 3, '2025-08-03 14:22:00'),
  ('770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440003', 'Testing', 4, '2025-08-03 14:23:00'),
  ('770e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440003', 'Deployment', 5, '2025-08-03 14:24:00')
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Project Alpha - To Do list
INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Setup project repository', 'Initialize Git repo and configure CI/CD pipeline', 1, '2025-08-01 09:20:00'),
  ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'Create project structure', 'Set up folder structure and basic configuration files', 2, '2025-08-01 09:21:00'),
  ('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'Design database schema', 'Plan and design the database structure', 3, '2025-08-01 09:22:00')
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Project Alpha - In Progress list
INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', 'Implement authentication', 'Build user authentication system with JWT', 1, '2025-08-01 09:25:00'),
  ('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'Create API endpoints', 'Develop RESTful API for boards and tasks', 2, '2025-08-01 09:26:00')
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Project Alpha - Review list
INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440003', 'Code review setup', 'Set up code review process and guidelines', 1, '2025-08-01 09:30:00')
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Project Alpha - Done list
INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440004', 'Project kickoff meeting', 'Initial team meeting and project overview', 1, '2025-08-01 09:35:00')
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Marketing Campaign - Ideas list
INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440005', 'Social media campaign', 'Plan social media marketing strategy', 1, '2025-08-02 10:40:00'),
  ('880e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440005', 'Email newsletter', 'Design email marketing campaign', 2, '2025-08-02 10:41:00'),
  ('880e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440005', 'Influencer partnerships', 'Identify and approach potential influencers', 3, '2025-08-02 10:42:00')
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Marketing Campaign - Planning list
INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440006', 'Budget allocation', 'Plan and allocate marketing budget', 1, '2025-08-02 10:45:00'),
  ('880e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440006', 'Timeline creation', 'Create detailed campaign timeline', 2, '2025-08-02 10:46:00')
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Product Development - Backlog list
INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440009', 'User research', 'Conduct user interviews and surveys', 1, '2025-08-03 14:30:00'),
  ('880e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440009', 'Feature prioritization', 'Prioritize features based on user feedback', 2, '2025-08-03 14:31:00'),
  ('880e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440009', 'Technical architecture', 'Design system architecture and tech stack', 3, '2025-08-03 14:32:00')
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Product Development - Sprint Planning list
INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440010', 'Sprint 1 planning', 'Plan first sprint tasks and goals', 1, '2025-08-03 14:35:00'),
  ('880e8400-e29b-41d4-a716-446655440017', '770e8400-e29b-41d4-a716-446655440010', 'Team capacity planning', 'Assess team availability and skills', 2, '2025-08-03 14:36:00')
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Team Building - Ideas list
INSERT INTO lists (id, board_id, title, position, created_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440004', 'Team Activities', 1, '2025-08-04 11:50:00'),
  ('770e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440004', 'Skill Development', 2, '2025-08-04 11:51:00'),
  ('770e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440004', 'Social Events', 3, '2025-08-04 11:52:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440018', '770e8400-e29b-41d4-a716-446655440014', 'Team lunch', 'Organize weekly team lunch meetings', 1, '2025-08-04 11:55:00'),
  ('880e8400-e29b-41d4-a716-446655440019', '770e8400-e29b-41d4-a716-446655440014', 'Hackathon planning', 'Plan quarterly hackathon event', 2, '2025-08-04 11:56:00'),
  ('880e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440015', 'Training sessions', 'Schedule skill development workshops', 1, '2025-08-04 11:57:00'),
  ('880e8400-e29b-41d4-a716-446655440021', '770e8400-e29b-41d4-a716-446655440016', 'Holiday party', 'Plan end-of-year celebration', 1, '2025-08-04 11:58:00')
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Customer Support - Ideas list
INSERT INTO lists (id, board_id, title, position, created_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440017', '660e8400-e29b-41d4-a716-446655440005', 'Support Tickets', 1, '2025-08-05 16:25:00'),
  ('770e8400-e29b-41d4-a716-446655440018', '660e8400-e29b-41d4-a716-446655440005', 'Documentation', 2, '2025-08-05 16:26:00'),
  ('770e8400-e29b-41d4-a716-446655440019', '660e8400-e29b-41d4-a716-446655440005', 'Training', 3, '2025-08-05 16:27:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, list_id, title, description, position, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440022', '770e8400-e29b-41d4-a716-446655440017', 'Ticket prioritization', 'Implement ticket priority system', 1, '2025-08-05 16:30:00'),
  ('880e8400-e29b-41d4-a716-446655440023', '770e8400-e29b-41d4-a716-446655440017', 'Response time tracking', 'Track and improve response times', 2, '2025-08-05 16:31:00'),
  ('880e8400-e29b-41d4-a716-446655440024', '770e8400-e29b-41d4-a716-446655440018', 'FAQ creation', 'Create comprehensive FAQ section', 1, '2025-08-05 16:32:00'),
  ('880e8400-e29b-41d4-a716-446655440025', '770e8400-e29b-41d4-a716-446655440019', 'Support team training', 'Train team on new tools and processes', 1, '2025-08-05 16:33:00')
ON CONFLICT (id) DO NOTHING;

-- Display summary of seeded data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Boards' as table_name, COUNT(*) as count FROM boards
UNION ALL
SELECT 'Lists' as table_name, COUNT(*) as count FROM lists
UNION ALL
SELECT 'Tasks' as table_name, COUNT(*) as count FROM tasks;
