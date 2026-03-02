/**
 * LIFE SYSTEM 2026 — API Backend
 * Cloudflare Pages Function (catch-all para /api/*)
 * Framework: Hono  |  Base de datos: Supabase (PostgreSQL)
 */

import { Hono }   from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { createClient } from '@supabase/supabase-js';

// ── App Hono ──────────────────────────────────────────────────
const app = new Hono().basePath('/api');

// ── Helpers ───────────────────────────────────────────────────
/** Crea cliente Supabase usando variables de entorno del Worker */
const sb = (env) =>
  createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });

/** Fecha de hoy en formato YYYY-MM-DD */
const today = () => new Date().toISOString().slice(0, 10);

/** Lunes de la semana actual en YYYY-MM-DD */
const weekStart = () => {
  const d   = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;   // ajuste para lunes
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

// ============================================================
// GET /api/state — Estado completo (carga inicial)
// ============================================================
app.get('/state', async (c) => {
  const supabase = sb(c.env);

  const [
    { data: fund },
    { data: proteinToday },
    { data: workoutsWeek },
    { data: workoutsAll },
    { data: weightHistory },
    { data: goals },
    { data: identity },
    { data: impulseItems },
    { data: settings },
  ] = await Promise.all([
    supabase.from('fund').select('amount').eq('id', 1).single(),
    supabase.from('protein_log').select('*').eq('date', today()).order('created_at'),
    supabase.from('workout_log').select('*').gte('date', weekStart()).order('created_at'),
    supabase.from('workout_log').select('*').order('created_at', { ascending: false }).limit(300),
    supabase.from('weight_log').select('*').order('date', { ascending: false }).limit(20),
    supabase.from('goals').select('*').order('position').order('id'),
    supabase.from('identity_text').select('content').eq('id', 1).single(),
    supabase.from('impulse_items').select('*').order('created_at', { ascending: false }),
    supabase.from('settings').select('key, value'),
  ]);

  // Convertir settings array → objeto
  const cfg = {};
  settings?.forEach(r => { cfg[r.key] = r.value; });

  return c.json({
    fund:             fund?.amount || 0,
    weight:           { current: weightHistory?.[0]?.weight || 72, history: weightHistory || [] },
    protein:          { today: proteinToday || [] },
    workouts:         { week: workoutsWeek || [], all: workoutsAll || [] },
    goals:            goals || [],
    identity:         identity?.content || null,
    impulseItems:     impulseItems || [],
    radarScores:      cfg.radarScores   || { rel:5, spirit:5, physical:5, work:5, pos:5, leisure:5 },
    disciplineHistory: cfg.disciplineHistory || [],
  });
});

// ============================================================
// POST /api/fund/deposit
// ============================================================
app.post('/fund/deposit', async (c) => {
  const { amount } = await c.req.json();
  if (!amount || isNaN(amount) || amount <= 0)
    return c.json({ error: 'Monto inválido' }, 400);

  const supabase = sb(c.env);
  const { data: current } = await supabase.from('fund').select('amount').eq('id', 1).single();
  const newAmount = (current?.amount || 0) + Math.round(amount);
  await supabase.from('fund').update({ amount: newAmount, updated_at: new Date().toISOString() }).eq('id', 1);

  return c.json({ fund: newAmount });
});

// ============================================================
// PROTEÍNA
// ============================================================
app.get('/protein/:date', async (c) => {
  const supabase = sb(c.env);
  const { data } = await supabase
    .from('protein_log').select('*')
    .eq('date', c.req.param('date'))
    .order('created_at');
  return c.json(data || []);
});

app.post('/protein', async (c) => {
  const { name, grams, date } = await c.req.json();
  if (!name || !grams || !date) return c.json({ error: 'Datos incompletos' }, 400);

  const supabase = sb(c.env);
  await supabase.from('protein_log').insert({ date, name, grams: Math.round(grams) });
  const { data } = await supabase.from('protein_log').select('*').eq('date', date).order('created_at');
  return c.json({ entries: data || [] });
});

// ============================================================
// ENTRENAMIENTOS
// ============================================================
app.get('/workouts/week', async (c) => {
  const supabase = sb(c.env);
  const { data } = await supabase
    .from('workout_log').select('*')
    .gte('date', weekStart())
    .order('created_at');
  return c.json(data || []);
});

app.post('/workouts', async (c) => {
  const { date, day_key, type } = await c.req.json();
  if (!date || !day_key || !type) return c.json({ error: 'Datos incompletos' }, 400);

  const supabase = sb(c.env);
  await supabase.from('workout_log').insert({ date, day_key, type });

  const [{ data: week }, { data: all }] = await Promise.all([
    supabase.from('workout_log').select('*').gte('date', weekStart()).order('created_at'),
    supabase.from('workout_log').select('*').order('created_at', { ascending: false }).limit(300),
  ]);
  return c.json({ week: week || [], all: all || [] });
});

// ============================================================
// PESO
// ============================================================
app.get('/weight', async (c) => {
  const supabase = sb(c.env);
  const { data } = await supabase
    .from('weight_log').select('*')
    .order('date', { ascending: false }).limit(20);
  return c.json({ current: data?.[0]?.weight || 72, history: data || [] });
});

app.post('/weight', async (c) => {
  const { weight, date } = await c.req.json();
  if (!weight || !date) return c.json({ error: 'Datos incompletos' }, 400);

  const supabase = sb(c.env);
  await supabase.from('weight_log').insert({ date, weight: parseFloat(weight) });
  const { data } = await supabase
    .from('weight_log').select('*')
    .order('date', { ascending: false }).limit(20);
  return c.json({ current: data?.[0]?.weight || 72, history: data || [] });
});

// ============================================================
// METAS
// ============================================================
app.get('/goals', async (c) => {
  const supabase = sb(c.env);
  const { data } = await supabase.from('goals').select('*').order('position').order('id');
  return c.json(data || []);
});

app.post('/goals', async (c) => {
  const { text } = await c.req.json();
  if (!text) return c.json({ error: 'Texto requerido' }, 400);

  const supabase = sb(c.env);
  const { data: maxRow } = await supabase
    .from('goals').select('position')
    .order('position', { ascending: false }).limit(1).single();
  const pos = (maxRow?.position || 0) + 1;
  const { data } = await supabase
    .from('goals').insert({ text, position: pos })
    .select().single();
  return c.json(data);
});

app.put('/goals/:id', async (c) => {
  const { done } = await c.req.json();
  const supabase = sb(c.env);
  await supabase.from('goals').update({ done }).eq('id', c.req.param('id'));
  return c.json({ ok: true });
});

app.delete('/goals/:id', async (c) => {
  const supabase = sb(c.env);
  await supabase.from('goals').delete().eq('id', c.req.param('id'));
  return c.json({ ok: true });
});

// ============================================================
// IDENTIDAD
// ============================================================
app.get('/identity', async (c) => {
  const supabase = sb(c.env);
  const { data } = await supabase
    .from('identity_text').select('content').eq('id', 1).single();
  return c.json({ content: data?.content || null });
});

app.put('/identity', async (c) => {
  const { content } = await c.req.json();
  if (!content) return c.json({ error: 'Contenido requerido' }, 400);

  const supabase = sb(c.env);
  await supabase.from('identity_text')
    .upsert({ id: 1, content, updated_at: new Date().toISOString() });
  return c.json({ ok: true });
});

// ============================================================
// SISTEMA ANTI-IMPULSO
// ============================================================
app.get('/impulse', async (c) => {
  const supabase = sb(c.env);
  const { data } = await supabase
    .from('impulse_items').select('*')
    .order('created_at', { ascending: false });
  return c.json(data || []);
});

app.post('/impulse', async (c) => {
  const { name, amount } = await c.req.json();
  if (!name || !amount) return c.json({ error: 'Datos incompletos' }, 400);
  if (parseInt(amount) < 200000)
    return c.json({ error: 'Aplica solo a compras > $200.000' }, 400);

  const supabase = sb(c.env);
  const { data } = await supabase
    .from('impulse_items').insert({ name, amount: Math.round(amount) })
    .select().single();
  return c.json(data);
});

app.delete('/impulse/:id', async (c) => {
  const supabase = sb(c.env);
  await supabase.from('impulse_items').delete().eq('id', c.req.param('id'));
  return c.json({ ok: true });
});

// ============================================================
// REVISIONES DOMINICALES
// ============================================================
app.get('/reviews/:week', async (c) => {
  const supabase = sb(c.env);
  const { data } = await supabase
    .from('weekly_reviews').select('data')
    .eq('week_key', c.req.param('week')).single();
  return c.json(data?.data || {});
});

app.post('/reviews', async (c) => {
  const body = await c.req.json();
  if (!body.week_key) return c.json({ error: 'week_key requerido' }, 400);

  const supabase = sb(c.env);
  const { week_key, ...reviewData } = body;
  await supabase.from('weekly_reviews').upsert(
    { week_key, data: reviewData, updated_at: new Date().toISOString() },
    { onConflict: 'week_key' }
  );
  return c.json({ ok: true });
});

// ============================================================
// SEGUIMIENTO MENSUAL
// ============================================================
app.get('/tracking/:month', async (c) => {
  const supabase  = sb(c.env);
  const month     = decodeURIComponent(c.req.param('month'));
  const { data }  = await supabase
    .from('monthly_tracking').select('data').eq('month', month).single();
  return c.json(data?.data || {});
});

app.post('/tracking', async (c) => {
  const { month, key, value } = await c.req.json();
  if (!month || key === undefined) return c.json({ error: 'Datos incompletos' }, 400);

  const supabase = sb(c.env);
  // Leer datos actuales → mezclar → guardar
  const { data: existing } = await supabase
    .from('monthly_tracking').select('data').eq('month', month).single();
  const merged = { ...(existing?.data || {}), [key]: value };
  await supabase.from('monthly_tracking').upsert(
    { month, data: merged, updated_at: new Date().toISOString() },
    { onConflict: 'month' }
  );
  return c.json({ ok: true });
});

// ============================================================
// CONFIGURACIONES (radar scores, historial disciplina)
// ============================================================
app.get('/settings', async (c) => {
  const supabase = sb(c.env);
  const { data } = await supabase.from('settings').select('key, value');
  const cfg = {};
  data?.forEach(r => { cfg[r.key] = r.value; });
  return c.json(cfg);
});

app.post('/settings', async (c) => {
  const { key, value } = await c.req.json();
  if (!key) return c.json({ error: 'key requerido' }, 400);

  const supabase = sb(c.env);
  await supabase.from('settings').upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  );
  return c.json({ ok: true });
});

// ── Export para Cloudflare Pages Functions ────────────────────
export const onRequest = handle(app);
