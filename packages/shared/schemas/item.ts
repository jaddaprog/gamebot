import { z } from 'zod';

export const RarityEnum = z.enum(['Common', 'Uncommon', 'Rare', 'Legendary', 'Artifact']);
export const SlotEnum = z.enum(['Head', 'Chest', 'MainHand', 'OffHand', 'Consumable']);

// Ability Schema for items: name, staminaCost, applies (status effects), and optional synergy metadata
export const AbilitySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(64),
  description: z.string().max(256).optional(),
  staminaCost: z.number().int().nonnegative().default(0),
  // status effects applied by this ability (uses the status_effect enum in PG for reference)
  applies: z.array(z.string()).default([]),
  // synergy object allows designers to express triggers/multipliers
  synergy: z.object({
    trigger: z.string().optional(),
    multiplier: z.number().optional(),
    meta: z.record(z.any()).optional(),
  }).optional(),
});

export const ItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Item name is required').max(64),
  description: z.string().max(256).describe('Flavor text for the player').optional(),
  iconUrl: z.string().url().optional(),
  rarity: RarityEnum,
  slot: SlotEnum,
  // Stats now include staminaRegen for the Dual-Action Synergy System
  stats: z.object({
    attack: z.number().int().default(0),
    defense: z.number().int().default(0),
    speed: z.number().int().default(0),
    weight: z.number().int().nonnegative().default(0),
    staminaRegen: z.number().int().default(5),
  }),

  // Abilities: now a strict array of AbilitySchema objects
  abilities: z.array(AbilitySchema).default([]),

  isTradable: z.boolean().default(true),
  goldValue: z.number().int().nonnegative().default(0),
  tags: z.array(z.string()).default([]),
});

export type Ability = z.infer<typeof AbilitySchema>;
export type Item = z.infer<typeof ItemSchema>;
