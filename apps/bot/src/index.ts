import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { ItemSchema } from '@nexus/shared';

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('Missing DISCORD_TOKEN in environment');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = '!createitem ';
  if (!message.content.startsWith(prefix)) return;

  const payload = message.content.slice(prefix.length).trim();
  try {
    const json = JSON.parse(payload);
    const parsed = ItemSchema.safeParse(json);
    if (!parsed.success) {
      await message.reply('Validation failed: ' + JSON.stringify(parsed.error.format()));
      return;
    }

    // TODO: send to Supabase function or DB. For now, echo confirmation.
    await message.reply('Item validated successfully (local).');
    console.log('Validated item:', parsed.data);
  } catch (err) {
    await message.reply('Invalid JSON payload: ' + String(err));
  }
});

client.login(token).catch((err) => {
  console.error('Failed to login:', err);
  process.exit(1);
});
