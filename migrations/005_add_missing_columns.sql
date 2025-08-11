-- Migration: 005_add_missing_columns.sql
-- Description: Add missing columns that the service methods expect

-- Add missing columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMP;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'todo';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add missing columns to lists table
ALTER TABLE lists ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add missing columns to boards table
ALTER TABLE boards ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE boards ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#0079bf';
ALTER TABLE boards ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at);
CREATE INDEX IF NOT EXISTS idx_lists_updated_at ON lists(updated_at);
CREATE INDEX IF NOT EXISTS idx_boards_updated_at ON boards(updated_at);

-- Add comments for new columns
COMMENT ON COLUMN tasks.due_date IS 'Due date for the task';
COMMENT ON COLUMN tasks.priority IS 'Priority level of the task (low, medium, high)';
COMMENT ON COLUMN tasks.status IS 'Current status of the task (todo, in_progress, done)';
COMMENT ON COLUMN tasks.updated_at IS 'Timestamp when the task was last updated';
COMMENT ON COLUMN lists.updated_at IS 'Timestamp when the list was last updated';
COMMENT ON COLUMN boards.description IS 'Optional description of the board';
COMMENT ON COLUMN boards.color IS 'Color theme for the board';
COMMENT ON COLUMN boards.updated_at IS 'Timestamp when the board was last updated';
