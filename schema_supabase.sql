-- ============================================================
-- LIFE SYSTEM 2026 — SQL para Supabase
-- Ejecutar completo en: Supabase Dashboard → SQL Editor → New query
-- ============================================================


-- ── TABLAS ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS fund (
  id         INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  amount     INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS protein_log (
  id         BIGSERIAL PRIMARY KEY,
  date       DATE NOT NULL,
  name       TEXT NOT NULL,
  grams      INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_log (
  id         BIGSERIAL PRIMARY KEY,
  date       DATE NOT NULL,
  day_key    TEXT NOT NULL,
  type       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weight_log (
  id         BIGSERIAL PRIMARY KEY,
  date       DATE NOT NULL,
  weight     NUMERIC(5,1) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goals (
  id         BIGSERIAL PRIMARY KEY,
  text       TEXT NOT NULL,
  done       BOOLEAN NOT NULL DEFAULT FALSE,
  position   INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS identity_text (
  id         INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  content    TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS impulse_items (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  amount     INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weekly_reviews (
  id         BIGSERIAL PRIMARY KEY,
  week_key   TEXT NOT NULL UNIQUE,
  data       JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monthly_tracking (
  id         BIGSERIAL PRIMARY KEY,
  month      TEXT NOT NULL UNIQUE,
  data       JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ── ÍNDICES ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_protein_date  ON protein_log(date);
CREATE INDEX IF NOT EXISTS idx_workout_date  ON workout_log(date);
CREATE INDEX IF NOT EXISTS idx_weight_date   ON weight_log(date);
CREATE INDEX IF NOT EXISTS idx_goals_pos     ON goals(position);


-- ── DESHABILITAR RLS (app personal, acceso solo vía service key) ──

ALTER TABLE fund              DISABLE ROW LEVEL SECURITY;
ALTER TABLE protein_log       DISABLE ROW LEVEL SECURITY;
ALTER TABLE workout_log       DISABLE ROW LEVEL SECURITY;
ALTER TABLE weight_log        DISABLE ROW LEVEL SECURITY;
ALTER TABLE goals             DISABLE ROW LEVEL SECURITY;
ALTER TABLE identity_text     DISABLE ROW LEVEL SECURITY;
ALTER TABLE impulse_items     DISABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews    DISABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_tracking  DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings          DISABLE ROW LEVEL SECURITY;


-- ── SEED: Datos iniciales ────────────────────────────────────

-- Fondo de emergencia (fila única)
INSERT INTO fund (id, amount) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

-- Metas por defecto 2026
INSERT INTO goals (text, position) VALUES
  ('Acumular $3.000.000 en fondo de emergencia antes de diciembre',                              0),
  ('Cerrar el año sin deudas de consumo (Boletos, Casco, RappiPay, Alkomprar, Mundo Mujer, Pase)', 1),
  ('Ganar masa magra sin bajar de 72kg — marcar sin verme flaco',                                2),
  ('Mantener rutina de gym 4-5 días/semana durante todo el año',                                 3),
  ('Completar abdominales 3 veces/semana de forma consistente',                                  4),
  ('Mantener proteína diaria promedio ≥ 100g',                                                   5),
  ('Fortalecer la relación con intencionalidad y tiempo de calidad',                              6),
  ('Avanzar en POS al menos 2h/semana de forma consistente',                                     7)
ON CONFLICT DO NOTHING;

-- Configuración inicial del radar de vida
INSERT INTO settings (key, value) VALUES
  ('radarScores',       '{"rel": 5, "spirit": 5, "physical": 5, "work": 5, "pos": 5, "leisure": 5}'),
  ('disciplineHistory', '[]')
ON CONFLICT (key) DO NOTHING;
