// Supabase Edge Function example (Deno)
// Deploy with: `supabase functions deploy create_item`

export default async function (req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const response = { ok: true, message: 'Received payload', payload: body };
    return new Response(JSON.stringify(response), {
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
