-- 1. UUID Support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerations (Matching Zod)
CREATE TYPE item_rarity AS ENUM ('Common', 'Uncommon', 'Rare', 'Legendary', 'Artifact');
CREATE TYPE item_slot AS ENUM ('Head', 'Chest', 'MainHand', 'OffHand', 'Consumable');

-- 3. Items Table (JSONB for flexibility with the Logic Engine)
CREATE TABLE public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (char_length(name) >= 1),
    description TEXT,
    icon_url TEXT,
    rarity item_rarity NOT NULL DEFAULT 'Common',
    slot item_slot NOT NULL,
    stats JSONB NOT NULL DEFAULT '{"attack": 0, "defense": 0, "speed": 0, "weight": 0}'::jsonb,
    abilities JSONB DEFAULT '[]'::jsonb,
    is_tradable BOOLEAN DEFAULT true,
    gold_value INTEGER NOT NULL DEFAULT 0 CHECK (gold_value >= 0),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Quests Table
CREATE TABLE public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL CHECK (char_length(title) >= 5),
    intro_text TEXT NOT NULL,
    completion_text TEXT NOT NULL,
    level_requirement INTEGER DEFAULT 1 CHECK (level_requirement > 0),
    min_party_size INTEGER DEFAULT 1 CHECK (min_party_size > 0),
    objectives JSONB NOT NULL,
    rewards JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Performance Indexes
CREATE INDEX idx_items_updated_at ON public.items(updated_at);
CREATE INDEX idx_items_rarity ON public.items(rarity);

-- 6. Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

-- Public Read Access (Game Logic needs to read)
CREATE POLICY "Public items are viewable by everyone" 
ON public.items FOR SELECT USING (true);

-- Admin Write Access (Only 'The Forge' GUI can write)
CREATE POLICY "Admins can insert items" 
ON public.items FOR INSERT 
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Admins can update items" 
ON public.items FOR UPDATE
USING (auth.jwt() ->> 'role' = 'service_role');
