-- Allow argument authors to update (content only) and delete their own arguments
CREATE POLICY "arguments_update" ON arguments FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "arguments_delete" ON arguments FOR DELETE
  USING (author_id = auth.uid());
