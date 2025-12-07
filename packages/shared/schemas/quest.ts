import { z } from 'zod';

export const QuestObjectiveType = z.enum(['KillMob', 'CollectItem', 'VisitLocation', 'SocialInvite']);

export const QuestSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(5),
  introText: z.string(),
  completionText: z.string(),
  levelRequirement: z.number().int().min(1).default(1),
  minPartySize: z.number().int().min(1).default(1).describe("Forces social interaction for high-tier quests"),
  objectives: z.array(z.object({
    id: z.string().uuid().optional(),
    type: QuestObjectiveType,
    targetId: z.string().describe("ID of Mob, Item, or Location"),
    count: z.number().int().min(1),
    description: z.string().describe("User-facing objective text"),
  })).min(1),
  rewards: z.object({
    xp: z.number().int(),
    softCurrency: z.number().int().describe("Gold earned"),
    hardCurrency: z.number().int().describe("Gems (Premium)"),
    items: z.array(z.string().uuid()).optional(),
  }),
});

export type Quest = z.infer<typeof QuestSchema>;
