// Supabase Edge Function: validate payload with shared Zod schema and persist to Postgres via REST
// Deploy with: `supabase functions deploy create_item`

import { ItemSchema } from '../../../packages/shared/index.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.35.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Simple in-memory metrics for this function instance (reset on deploy)
const metrics = {
  processed: 0,
  successes: 0,
  validation_errors: 0,
  db_errors: 0,
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});

function logInfo(msg: string, meta?: any) {
  console.info('[create_item] ' + msg, meta ?? '');
}

function logError(msg: string, meta?: any) {
  console.error('[create_item] ' + msg, meta ?? '');
}

export default async function (req: Request) {
  metrics.processed += 1;
  logInfo('Request received');

  try {
    const body = await req.json().catch(() => ({}));

    // Validate using the shared Zod schema
    const parsed = ItemSchema.safeParse(body);
    if (!parsed.success) {
      metrics.validation_errors += 1;
      logInfo('Validation failed', parsed.error.format());
      return new Response(JSON.stringify({ ok: false, error: 'validation', details: parsed.error.format(), metrics }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      logError('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return new Response(JSON.stringify({ ok: false, error: 'missing_env', message: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set', metrics }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const item = parsed.data;
    const payload = {
      name: item.name,
      description: item.description ?? null,
      icon_url: item.iconUrl ?? null,
      rarity: item.rarity,
      slot: item.slot,
      stats: item.stats,
      abilities: [],
      is_tradable: item.isTradable ?? true,
      gold_value: item.goldValue ?? 0,
      tags: item.tags ?? [],
    };

    // Insert using supabase-js client
    const { data, error } = await supabase.from('items').insert([payload]).select();
    if (error) {
      metrics.db_errors += 1;
      // Unique constraint handling
      const isUniqueViolation = String(error.message || '').toLowerCase().includes('duplicate') || error.code === '23505';
      logError('DB insert error', { error });
      return new Response(JSON.stringify({ ok: false, error: 'db_insert', details: error, unique_violation: isUniqueViolation, metrics }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    metrics.successes += 1;
    logInfo('Item inserted', { result: data });
    return new Response(JSON.stringify({ ok: true, result: data, metrics }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    metrics.db_errors += 1;
    logError('Unhandled error', err);
    return new Response(JSON.stringify({ ok: false, error: String(err), metrics }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
