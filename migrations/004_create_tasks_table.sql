-- Migration: 004_create_tasks_table.sql
-- Description: Create tasks table for individual task items within lists

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_list_id ON tasks(list_id);
CREATE INDEX idx_tasks_position ON tasks(list_id, position);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Add unique constraint to ensure no duplicate positions within the same list
ALTER TABLE tasks ADD CONSTRAINT unique_task_position_per_list UNIQUE (list_id, position);

-- Add comments to table and columns
COMMENT ON TABLE tasks IS 'Stores individual tasks within lists';
COMMENT ON COLUMN tasks.id IS 'Unique identifier for the task';
COMMENT ON COLUMN tasks.list_id IS 'Reference to the list this task belongs to';
COMMENT ON COLUMN tasks.title IS 'Title/name of the task';
COMMENT ON COLUMN tasks.description IS 'Optional detailed description of the task';
COMMENT ON COLUMN tasks.position IS 'Position/order of the task within the list';
COMMENT ON COLUMN tasks.created_at IS 'Timestamp when the task was created';
