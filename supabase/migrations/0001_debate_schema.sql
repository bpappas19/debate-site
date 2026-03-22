-- =============================================================================
-- Debate platform schema: enums, tables, indexes, RLS
-- Run with: supabase db push (or apply via Dashboard SQL editor)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enums (match app CategoryType and ArgumentSide)
-- -----------------------------------------------------------------------------
CREATE TYPE category_type AS ENUM (
  'stocks',
  'crypto',
  'sports',
  'politics',
  'products',
  'culture'
);

CREATE TYPE argument_side AS ENUM ('PRO', 'CON');

-- -----------------------------------------------------------------------------
-- Profiles (extends auth.users; created on signup via trigger or app)
-- -----------------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- Debates (unique per category_type + symbol_or_slug)
-- -----------------------------------------------------------------------------
CREATE TABLE debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_type category_type NOT NULL,
  symbol_or_slug TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  debate_question TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  pro_votes INT NOT NULL DEFAULT 0,
  con_votes INT NOT NULL DEFAULT 0,
  image TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_side argument_side,
  resolved_at TIMESTAMPTZ,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_debates_category_slug UNIQUE (category_type, symbol_or_slug)
);

-- Computed total for convenience (optional; could also compute in app)
ALTER TABLE debates
  ADD COLUMN total_votes INT GENERATED ALWAYS AS (pro_votes + con_votes) STORED;

-- -----------------------------------------------------------------------------
-- Arguments (per debate, with side and author)
-- -----------------------------------------------------------------------------
CREATE TABLE arguments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  side argument_side NOT NULL,
  content TEXT NOT NULL,
  upvotes INT NOT NULL DEFAULT 0,
  downvotes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- Votes (one vote per user per debate; TODO: wire in app later)
-- -----------------------------------------------------------------------------
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  side argument_side NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_votes_debate_user UNIQUE (debate_id, user_id)
);

-- -----------------------------------------------------------------------------
-- Debate follows (TODO: wire in app later)
-- -----------------------------------------------------------------------------
CREATE TABLE debate_follows (
  debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (debate_id, user_id)
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX idx_debates_category_slug ON debates (category_type, symbol_or_slug);
CREATE INDEX idx_debates_created_at ON debates (created_at DESC);
CREATE INDEX idx_arguments_debate_created ON arguments (debate_id, created_at DESC);
CREATE INDEX idx_votes_debate ON votes (debate_id);
CREATE INDEX idx_debate_follows_user ON debate_follows (user_id);

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate_follows ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read; only own row can be inserted/updated
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Debates: public read; only authenticated can insert; author can update
CREATE POLICY "debates_select" ON debates FOR SELECT USING (true);
CREATE POLICY "debates_insert" ON debates FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND (author_id IS NULL OR author_id = auth.uid()));
CREATE POLICY "debates_update" ON debates FOR UPDATE
  USING (author_id = auth.uid());

-- Arguments: public read; only authenticated can insert
CREATE POLICY "arguments_select" ON arguments FOR SELECT USING (true);
CREATE POLICY "arguments_insert" ON arguments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND (author_id IS NULL OR author_id = auth.uid()));

-- Votes: users can read own votes; authenticated can insert/delete own
CREATE POLICY "votes_select" ON votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "votes_insert" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "votes_delete" ON votes FOR DELETE USING (auth.uid() = user_id);

-- Debate follows: users can read own follows; authenticated can insert/delete own
CREATE POLICY "debate_follows_select" ON debate_follows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "debate_follows_insert" ON debate_follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "debate_follows_delete" ON debate_follows FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Trigger: create profile on signup (optional; or create in app)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'user_' || substr(NEW.id::text, 1, 8)),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
