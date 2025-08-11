-- Migration: 003_create_lists_table.sql
-- Description: Create lists table for organizing tasks within boards

CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_lists_board_id ON lists(board_id);
CREATE INDEX idx_lists_position ON lists(board_id, position);
CREATE INDEX idx_lists_created_at ON lists(created_at);

-- Add unique constraint to ensure no duplicate positions within the same board
ALTER TABLE lists ADD CONSTRAINT unique_list_position_per_board UNIQUE (board_id, position);

-- Add comments to table and columns
COMMENT ON TABLE lists IS 'Stores lists that organize tasks within boards';
COMMENT ON COLUMN lists.id IS 'Unique identifier for the list';
COMMENT ON COLUMN lists.board_id IS 'Reference to the board this list belongs to';
COMMENT ON COLUMN lists.title IS 'Title/name of the list';
COMMENT ON COLUMN lists.position IS 'Position/order of the list within the board';
COMMENT ON COLUMN lists.created_at IS 'Timestamp when the list was created';
