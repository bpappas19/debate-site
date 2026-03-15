-- Add anonymous posting support to arguments: display name snapshot + flag
ALTER TABLE arguments
  ADD COLUMN IF NOT EXISTS author_username TEXT,
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT false;
