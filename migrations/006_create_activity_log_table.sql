-- Migration: 006_create_activity_log_table.sql
-- Description: Create activity log table for tracking user actions on boards

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_title TEXT,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_activity_log_board_id ON activity_log(board_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_action_type ON activity_log(action_type);
CREATE INDEX idx_activity_log_entity_type ON activity_log(entity_type);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- Add comments to table and columns
COMMENT ON TABLE activity_log IS 'Stores activity log entries for tracking user actions on boards';
COMMENT ON COLUMN activity_log.id IS 'Unique identifier for the activity log entry';
COMMENT ON COLUMN activity_log.board_id IS 'Reference to the board where the action occurred';
COMMENT ON COLUMN activity_log.user_id IS 'Reference to the user who performed the action';
COMMENT ON COLUMN activity_log.action_type IS 'Type of action performed (create, update, delete, move)';
COMMENT ON COLUMN activity_log.entity_type IS 'Type of entity affected (board, list, task)';
COMMENT ON COLUMN activity_log.entity_id IS 'ID of the entity affected by the action';
COMMENT ON COLUMN activity_log.entity_title IS 'Title/name of the entity for display purposes';
COMMENT ON COLUMN activity_log.old_values IS 'Previous values before the action (for updates)';
COMMENT ON COLUMN activity_log.new_values IS 'New values after the action (for updates)';
COMMENT ON COLUMN activity_log.metadata IS 'Additional metadata about the action';
COMMENT ON COLUMN activity_log.created_at IS 'Timestamp when the action occurred';
