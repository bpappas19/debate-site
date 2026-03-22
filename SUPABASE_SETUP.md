# Supabase setup checklist

Follow these steps in order to connect this app to a real Supabase project.

---

## 1. Create a Supabase project (if you don’t have one)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Click **New project**.
3. Choose organization, name, database password, and region. Click **Create new project** and wait for it to finish.

---

## 2. Add environment variables to `.env.local`

Create (or edit) **`.env.local`** in the **project root** (same level as `package.json`) with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to get each value:**

| Variable | Where to find it in Supabase |
|----------|------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Dashboard → **Project Settings** (gear) → **API** → **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard → **Project Settings** → **API** → **Project API keys** → **anon** **public** (copy the long JWT) |

- Do **not** use the `service_role` key in the app; use only the **anon** key.
- Do **not** commit `.env.local` (it’s already in `.gitignore`).

---

## 3. Run the SQL migration in Supabase

1. In the Supabase Dashboard, open your project.
2. Go to **SQL Editor** (left sidebar).
3. Click **New query**.
4. Paste the **entire** contents of `supabase/migrations/0001_debate_schema.sql` (see below).
5. Click **Run** (or press Cmd/Ctrl+Enter).
6. Confirm you see “Success. No rows returned.”

**Full migration SQL** (copy from `supabase/migrations/0001_debate_schema.sql` or paste this):

```sql
-- Enums
CREATE TYPE category_type AS ENUM (
  'stocks', 'crypto', 'sports', 'politics', 'products', 'culture'
);
CREATE TYPE argument_side AS ENUM ('PRO', 'CON');

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Debates
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
ALTER TABLE debates ADD COLUMN total_votes INT GENERATED ALWAYS AS (pro_votes + con_votes) STORED;

-- Arguments
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

-- Votes (for later)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  side argument_side NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_votes_debate_user UNIQUE (debate_id, user_id)
);

-- Debate follows (for later)
CREATE TABLE debate_follows (
  debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (debate_id, user_id)
);

-- Indexes
CREATE INDEX idx_debates_category_slug ON debates (category_type, symbol_or_slug);
CREATE INDEX idx_debates_created_at ON debates (created_at DESC);
CREATE INDEX idx_arguments_debate_created ON arguments (debate_id, created_at DESC);
CREATE INDEX idx_votes_debate ON votes (debate_id);
CREATE INDEX idx_debate_follows_user ON debate_follows (user_id);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "debates_select" ON debates FOR SELECT USING (true);
CREATE POLICY "debates_insert" ON debates FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND (author_id IS NULL OR author_id = auth.uid()));
CREATE POLICY "debates_update" ON debates FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "arguments_select" ON arguments FOR SELECT USING (true);
CREATE POLICY "arguments_insert" ON arguments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND (author_id IS NULL OR author_id = auth.uid()));

CREATE POLICY "votes_select" ON votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "votes_insert" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "votes_delete" ON votes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "debate_follows_select" ON debate_follows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "debate_follows_insert" ON debate_follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "debate_follows_delete" ON debate_follows FOR DELETE USING (auth.uid() = user_id);

-- Trigger: create profile on signup
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
```

---

## 4. Enable Email auth (if you want email/password sign-in)

1. Dashboard → **Authentication** → **Providers**.
2. Ensure **Email** is enabled.
3. (Optional) Under **Email**, turn off **Confirm email** if you want to skip confirmation for local testing. For production, leave confirmation on.

---

## 5. Package installs

Supabase is already in the repo. If you’re on a fresh clone or something is missing, run:

```bash
npm install
```

No extra packages are required beyond what’s in `package.json` (`@supabase/supabase-js`, `@supabase/ssr`).

---

## 6. Verify auth

1. Start the app: `npm run dev`.
2. Open [http://localhost:3000](http://localhost:3000).
3. Click **Sign in** (or go to `/login`).
4. Click **Sign up** and create an account (email + password; username optional).
5. After signup you should be redirected to the homepage and the navbar should show your username/avatar and **Sign out** (not “Sign in”).
6. Sign out, then sign in again at `/login` with the same email/password. Navbar should again show you as signed in.
7. In Supabase: **Authentication** → **Users**. You should see the new user and a row in **Table Editor** → **profiles** with the same `id` and your username.

---

## 7. Verify creating debates and arguments

1. Stay signed in. Go to **Create** (or `/create`).
2. Pick **Stocks**, fill company name and ticker (e.g. “Acme Inc”, “ACME”), add a debate question and optional first argument. Submit.
3. You should be redirected to the new debate page and see your debate and (if you added one) your argument.
4. In Supabase: **Table Editor** → **debates**. You should see one row (e.g. `category_type = stocks`, `symbol_or_slug = acme`, your question, `author_id` = your user’s UUID).
5. Open a debate (e.g. the one you created or any existing). Click **Post Your Take**, choose Bull or Bear, write an argument, submit.
6. The new argument should appear on the debate page.
7. In Supabase: **Table Editor** → **arguments**. You should see the new row with the correct `debate_id` and `author_id`.

---

## Troubleshooting

- **“Supabase not configured” or blank home:** Check that `.env.local` has both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` and restart `npm run dev`.
- **Auth errors:** In Dashboard → **Authentication** → **Providers**, ensure Email is enabled. If you use “Confirm email”, check the inbox (or Supabase **Authentication** → **Users** for confirmation link in logs).
- **RLS / permission errors:** Ensure you ran the full migration (all policies and the trigger). Signed-in users can insert into `debates` and `arguments`; anonymous users can only read.
