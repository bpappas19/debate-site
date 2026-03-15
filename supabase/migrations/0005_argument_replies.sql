-- Replies: arguments can reference a parent argument (null = top-level comment).
ALTER TABLE arguments
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES arguments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_arguments_parent_id ON arguments (parent_id);
