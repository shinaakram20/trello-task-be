-- Migration: 008_fix_delete_constraints.sql
-- Description: Fix foreign key constraints to ensure proper cascade deletion

-- Drop existing foreign key constraints
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_list_id_fkey;
ALTER TABLE lists DROP CONSTRAINT IF EXISTS lists_board_id_fkey;

-- Recreate foreign key constraints with proper cascade behavior
ALTER TABLE tasks 
ADD CONSTRAINT tasks_list_id_fkey 
FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE;

ALTER TABLE lists 
ADD CONSTRAINT lists_board_id_fkey 
FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

-- Add indexes for better delete performance
CREATE INDEX IF NOT EXISTS idx_tasks_list_id_delete ON tasks(list_id);
CREATE INDEX IF NOT EXISTS idx_lists_board_id_delete ON lists(board_id);

-- Add comments
COMMENT ON INDEX idx_tasks_list_id_delete IS 'Index for efficient task deletion by list_id';
COMMENT ON INDEX idx_lists_board_id_delete IS 'Index for efficient list deletion by board_id';
