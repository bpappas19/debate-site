-- Ensure argument authors can update and delete their own arguments (idempotent).
-- Run this if delete/update still fails: RLS was on but no policy allowed DELETE.
DROP POLICY IF EXISTS "arguments_update" ON arguments;
DROP POLICY IF EXISTS "arguments_delete" ON arguments;

CREATE POLICY "arguments_update" ON arguments FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "arguments_delete" ON arguments FOR DELETE
  USING (author_id = auth.uid());
