-- One upvote per user per argument. Count stored on arguments.upvotes; this table tracks who voted.
CREATE TABLE argument_votes (
  argument_id UUID NOT NULL REFERENCES arguments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (argument_id, user_id)
);

CREATE INDEX idx_argument_votes_argument_id ON argument_votes (argument_id);

ALTER TABLE argument_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "argument_votes_select" ON argument_votes FOR SELECT USING (true);
CREATE POLICY "argument_votes_insert" ON argument_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "argument_votes_delete" ON argument_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Keep arguments.upvotes in sync when users vote/unvote
CREATE OR REPLACE FUNCTION public.sync_argument_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE arguments SET upvotes = upvotes + 1 WHERE id = NEW.argument_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE arguments SET upvotes = GREATEST(0, upvotes - 1) WHERE id = OLD.argument_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER argument_votes_sync_upvotes
  AFTER INSERT OR DELETE ON argument_votes
  FOR EACH ROW EXECUTE FUNCTION public.sync_argument_upvotes();
