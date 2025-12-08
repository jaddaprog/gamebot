-- 1. Update the 'stats' column default to include staminaRegen
-- We use jsonb_set to safely append the new field to existing rows if needed, 
-- but here we primarily update the default for NEW items.
ALTER TABLE public.items 
ALTER COLUMN stats 
SET DEFAULT '{"attack": 0, "defense": 0, "speed": 0, "weight": 0, "staminaRegen": 5}'::jsonb;

-- 2. Add a constraint to ensure 'staminaRegen' exists in the JSONB blob
-- This acts as a database-level "Type Check"
ALTER TABLE public.items 
ADD CONSTRAINT check_stats_schema 
CHECK (
    (stats ? 'attack') AND 
    (stats ? 'defense') AND 
    (stats ? 'staminaRegen')
);

-- 3. Create a Type for Status Effects (Optional but recommended for consistency)
-- Even though we store abilities in JSONB, having the Enum in Postgres helps documentation
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_effect') THEN
        CREATE TYPE status_effect AS ENUM ('Wet', 'Oiled', 'Frozen', 'Staggered', 'Exposed');
    END IF;
END$$;

-- 4. Comment on the 'abilities' column to document the expected schema for future developers
COMMENT ON COLUMN public.items.abilities IS 
'Array of objects conforming to AbilitySchema: { name, staminaCost, applies: [], synergy: {} }';

-- 5. (Optional) Create a specific index for Items with Synergies
-- This speeds up queries like "Find all items that consume the Oiled status"
CREATE INDEX IF NOT EXISTS idx_items_abilities_synergy 
ON public.items 
USING gin (abilities);
