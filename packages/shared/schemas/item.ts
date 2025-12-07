import { z } from 'zod';

export const RarityEnum = z.enum(['Common', 'Uncommon', 'Rare', 'Legendary', 'Artifact']);
export const SlotEnum = z.enum(['Head', 'Chest', 'MainHand', 'OffHand', 'Consumable']);

export const ItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Item name is required").max(64),
  description: z.string().max(256).describe("Flavor text for the player"),
  iconUrl: z.string().url().optional(),
  rarity: RarityEnum,
  slot: SlotEnum,
  stats: z.object({
    attack: z.number().int().default(0),
    defense: z.number().int().default(0),
    speed: z.number().int().default(0),
    weight: z.number().int().nonnegative().default(0),
  }),
  isTradable: z.boolean().default(true),
  goldValue: z.number().int().nonnegative(),
  tags: z.array(z.string()).default([]),
});

export type Item = z.infer<typeof ItemSchema>;
