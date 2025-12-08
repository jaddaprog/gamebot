// Supabase Edge Function: validate payload with shared Zod schema and persist to Postgres via REST
// Deploy with: `supabase functions deploy create_item`

import { ItemSchema } from '../../../packages/shared/index.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export default async function (req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // Validate using the shared Zod schema
    const parsed = ItemSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ ok: false, error: 'validation', details: parsed.error.format() }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return new Response(JSON.stringify({ ok: false, error: 'missing_env', message: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Map fields to DB columns
    const item = parsed.data;
    const payload = {
      name: item.name,
      description: item.description || null,
      icon_url: item.iconUrl || null,
      rarity: item.rarity,
      slot: item.slot,
      stats: item.stats,
      abilities: [],
      is_tradable: item.isTradable ?? true,
      gold_value: item.goldValue ?? 0,
      tags: item.tags ?? [],
    };

    // Insert via PostgREST
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    const result = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return new Response(JSON.stringify({ ok: false, error: 'db_insert', details: result }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
