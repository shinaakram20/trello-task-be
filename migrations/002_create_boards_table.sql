-- Migration: 002_create_boards_table.sql
-- Description: Create boards table for organizing project boards

CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_boards_created_at ON boards(created_at);

-- Add comments to table and columns
COMMENT ON TABLE boards IS 'Stores project boards created by users';
COMMENT ON COLUMN boards.id IS 'Unique identifier for the board';
COMMENT ON COLUMN boards.user_id IS 'Reference to the user who owns this board';
COMMENT ON COLUMN boards.title IS 'Title/name of the board';
COMMENT ON COLUMN boards.created_at IS 'Timestamp when the board was created';
