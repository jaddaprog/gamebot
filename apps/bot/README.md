# Gateway Sentinel (Bot) - Quickstart

This is a minimal TypeScript Discord bot scaffold for Project Nexus Core.

Requirements:
- `DISCORD_TOKEN` in environment
- `pnpm` and workspace dependencies installed

Run locally:

```bash
cp apps/bot/.env.example .env
# set DISCORD_TOKEN in .env
pnpm --filter @nexus/bot dev
```

Command usage (example):
Send a message in a server channel the bot can see:

```
!createitem {"name":"Short Sword","description":"A basic blade","rarity":"Common","slot":"MainHand","goldValue":10}
```

The bot validates the JSON payload against `@nexus/shared` `ItemSchema` and echoes success or validation errors.
Gateway Sentinel (Node.js) - Discord bot. Implement the Discord gateway client here.

This is a placeholder README for the bot app.
