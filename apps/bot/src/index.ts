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

    // If SUPABASE_FUNCTION_URL is set, forward the validated item to the Edge Function
    const fnUrl = process.env.SUPABASE_FUNCTION_URL;
    if (fnUrl) {
      try {
        const resp = await fetch(fnUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        });
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          await message.reply('Failed to create item: ' + (json.error || resp.statusText));
          console.error('Function error:', resp.status, json);
        } else {
          await message.reply('Item created via Supabase function.');
          console.log('Create function response:', json);
        }
      } catch (err) {
        await message.reply('Error calling Supabase function: ' + String(err));
        console.error('Error calling function:', err);
      }
    } else {
      await message.reply('Item validated successfully (local).');
      console.log('Validated item:', parsed.data);
    }
  } catch (err) {
    await message.reply('Invalid JSON payload: ' + String(err));
  }
});

client.login(token).catch((err) => {
  console.error('Failed to login:', err);
  process.exit(1);
});
