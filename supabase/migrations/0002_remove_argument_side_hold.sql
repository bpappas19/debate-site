-- Remove legacy HOLD from argument_side (PRO/CON only). Idempotent: no-op if HOLD was never in the enum.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'argument_side'
      AND e.enumlabel = 'HOLD'
  ) THEN
    UPDATE arguments SET side = 'CON' WHERE side::text = 'HOLD';
    UPDATE votes SET side = 'CON' WHERE side::text = 'HOLD';
    UPDATE debates SET resolved_side = NULL WHERE resolved_side::text = 'HOLD';
    ALTER TYPE argument_side DROP VALUE 'HOLD';
  END IF;
END $$;
