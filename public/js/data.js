/* ============================================================
   LIFE SYSTEM 2026 — DATA LAYER
   Datos precargados del usuario
   ============================================================ */

const LS_KEY = 'lifesystem2026_v1';

// ── FINANCIAL DATA ──────────────────────────────────────────
const INCOME = 1850000;

const EXPENSES_1_15 = [
  { name: 'RappiPay (Computador/Celular)', amount: 206400, endsMonth: 'Julio' },
  { name: 'Casa',                           amount: 250000, endsMonth: null },
  { name: 'Peluquería',                     amount: 20000,  endsMonth: null },
  { name: 'Boletos',                        amount: 70000,  endsMonth: 'Abril' },
  { name: 'Casco (1ra cuota)',              amount: 53000,  endsMonth: 'Junio' },
  { name: 'Salidas',                        amount: 100000, endsMonth: null },
  { name: 'Gasolina',                       amount: 45000,  endsMonth: null },
  { name: 'Papeles moto',                   amount: 175000, endsMonth: null },
];

const EXPENSES_15_30 = [
  { name: 'Alkomprar',   amount: 172000, endsMonth: 'Julio' },
  { name: 'Mundo Mujer', amount: 221000, endsMonth: 'Julio' },
  { name: 'Postpago',    amount: 45000,  endsMonth: null },
  { name: 'iCloud',      amount: 7000,   endsMonth: null },
  { name: 'Pase',        amount: 60000,  endsMonth: 'Julio' },
  { name: 'Casco (2da)', amount: 53000,  endsMonth: 'Junio' },
  { name: 'Salidas',     amount: 117000, endsMonth: null },
  { name: 'Gasolina',    amount: 45000,  endsMonth: null },
  { name: 'Cuota moto',  amount: 200000, endsMonth: null },
];

const DEBTS = [
  { name: 'Boletos',     amount: 70000,  endsMonth: 'Abril',  endsDate: new Date(2026, 3, 1) },
  { name: 'Casco',       amount: 106000, endsMonth: 'Junio',  endsDate: new Date(2026, 5, 1) },
  { name: 'RappiPay',    amount: 206400, endsMonth: 'Julio',  endsDate: new Date(2026, 6, 1) },
  { name: 'Alkomprar',   amount: 172000, endsMonth: 'Julio',  endsDate: new Date(2026, 6, 1) },
  { name: 'Mundo Mujer', amount: 221000, endsMonth: 'Julio',  endsDate: new Date(2026, 6, 1) },
  { name: 'Pase',        amount: 60000,  endsMonth: 'Julio',  endsDate: new Date(2026, 6, 1) },
];

// ── FINANCIAL PLAN ───────────────────────────────────────────
const FINANCIAL_PLAN = {
  'Marzo':    { mode: 'estabilidad', fundTarget: 0,       fundDeposit: 0,      invest: 0,      personal: 0      },
  'Abril':    { mode: 'estabilidad', fundTarget: 0,       fundDeposit: 0,      invest: 0,      personal: 0      },
  'Mayo':     { mode: 'estabilidad', fundTarget: 0,       fundDeposit: 0,      invest: 0,      personal: 0      },
  'Junio':    { mode: 'estabilidad', fundTarget: 0,       fundDeposit: 0,      invest: 0,      personal: 0      },
  'Julio':    { mode: 'liberación',  fundTarget: 500000,  fundDeposit: 500000, invest: 0,      personal: 200000 },
  'Agosto':   { mode: 'ahorro',      fundTarget: 1000000, fundDeposit: 500000, invest: 0,      personal: 200000 },
  'Septiembre':{ mode: 'meta',       fundTarget: 1500000, fundDeposit: 500000, invest: 0,      personal: 200000 },
  'Octubre':  { mode: 'crecimiento', fundTarget: 1800000, fundDeposit: 300000, invest: 200000, personal: 200000 },
  'Noviembre':{ mode: 'crecimiento', fundTarget: 2100000, fundDeposit: 300000, invest: 200000, personal: 200000 },
  'Diciembre':{ mode: 'cierre',      fundTarget: 2500000, fundDeposit: 300000, invest: 200000, personal: 200000 },
};

// ── PHYSICAL DATA ────────────────────────────────────────────
const PHYSICAL_BASE = {
  weight: 72,
  height: 181,
  proteinGoal: 100,
  gymDaysPerWeek: 4,
  absPerWeek: 3,
};

const PROTEIN_FOODS = [
  { id: '4-eggs',       name: '4 Huevos',       grams: 28 },
  { id: '200g-chicken', name: '200g Pollo',      grams: 44 },
  { id: '200g-tuna',    name: '200g Atún',       grams: 40 },
  { id: '1-glass-milk', name: '1 Vaso Leche',    grams: 8  },
  { id: '100g-lentils', name: '100g Lentejas',   grams: 9  },
];

// ── PRIORITIES ───────────────────────────────────────────────
const PRIORITIES = [
  { rank: 1, icon: '❤️',  name: 'Relación + Espiritualidad', desc: 'Lo que más importa — no se negocia' },
  { rank: 2, icon: '💪',  name: 'Salud Física',               desc: 'Cuerpo fuerte = mente fuerte' },
  { rank: 3, icon: '💼',  name: 'Trabajo',                    desc: 'Fuente de ingresos — estabilidad' },
  { rank: 4, icon: '💻',  name: 'POS (Proyectos Secundarios)', desc: 'Futuro y crecimiento adicional' },
  { rank: 5, icon: '🎮',  name: 'Ocio',                       desc: 'Descanso controlado y merecido' },
];

// ── PRINCIPLES ───────────────────────────────────────────────
const PRINCIPLES = [
  'Disciplina es elegir lo que más importa sobre lo que más apetece.',
  'No adquiero deudas que no puedo pagar en 30 días.',
  'Mi cuerpo refleja mi mente — si uno falla, el otro siente.',
  'El tiempo con mi pareja es sagrado e intencional.',
  'El fondo de emergencia es intocable — no es ahorro, es escudo.',
  'Constancia sobre intensidad: un 1% mejor cada día.',
  'Sin espiritualidad no hay dirección — dedico tiempo a ello a diario.',
  'Mido lo que importa — lo que no se mide no mejora.',
];

// ── DEFAULT GOALS ────────────────────────────────────────────
const DEFAULT_GOALS = [
  { text: 'Acumular $3.000.000 en fondo de emergencia antes de diciembre', done: false },
  { text: 'Cerrar el año sin deudas de consumo (Boletos, Casco, RappiPay, Alkomprar, Mundo Mujer, Pase)', done: false },
  { text: 'Ganar masa magra sin bajar de 72kg — marcar sin verme flaco', done: false },
  { text: 'Mantener rutina de gym 4-5 días/semana durante todo el año', done: false },
  { text: 'Completar abdominales 3 veces/semana de forma consistente', done: false },
  { text: 'Mantener proteína diaria promedio ≥ 100g', done: false },
  { text: 'Fortalecer la relación con intencionalidad y tiempo de calidad', done: false },
  { text: 'Avanzar en POS al menos 2h/semana de forma consistente', done: false },
];

// ── RULES ────────────────────────────────────────────────────
const RULES = {
  finance: {
    title: '💰 Finanzas',
    items: [
      'No adquirir ninguna deuda nueva hasta 2027.',
      'Regla 30 días: toda compra mayor a $200.000 espera.',
      'El fondo de emergencia es INTOCABLE.',
      'Cuenta separada exclusivamente para el fondo.',
      'Revisión financiera semanal — todos los domingos.',
    ]
  },
  body: {
    title: '💪 Cuerpo',
    items: [
      'Gym mínimo 4 sesiones por semana.',
      'Abdominales 3 veces por semana (L-M-V mañana).',
      'Proteína diaria mínima: 100g.',
      'No entrenar si hay lesión o agotamiento extremo.',
      'Registrar peso semanalmente.',
    ]
  },
  time: {
    title: '⏰ Tiempo',
    items: [
      'Dormir antes de las 10:30pm todos los días.',
      'Mínimo 7 horas de sueño.',
      'Sin pantallas 30 minutos antes de dormir.',
      '1 espacio intencional de relación diario.',
      'Planificación dominical — sin saltársela.',
    ]
  },
  social: {
    title: '🤝 Social',
    items: [
      'Ocio dentro del presupuesto asignado.',
      'Salidas sociales con límite claro ($100-117k/quincena).',
      'Priorizar relación sobre eventos sociales.',
      'POS: mínimo 2h/semana dedicadas.',
    ]
  }
};

// ── WEEKLY SCHEDULE ───────────────────────────────────────────
const WEEKLY_SCHEDULE = {
  lunes: {
    name: 'Lunes', abbr: 'LUN',
    blocks: [
      { time: '6:05–6:20',   desc: '🔥 Abdominales (15 min)', type: 'gym' },
      { time: '6:30–6:50',   desc: '🚿 Ducha y alistarse',    type: 'sleep' },
      { time: '6:55–7:15',   desc: '🍳 Desayuno proteico (4 huevos)', type: 'sleep' },
      { time: '8:00–12:00',  desc: '💼 Trabajo profundo',     type: 'work' },
      { time: '12:30–1:30',  desc: '🍗 Almuerzo (200g pollo)', type: 'sleep' },
      { time: '1:00–5:30',   desc: '💼 Trabajo estructurado', type: 'work' },
      { time: '6:00–7:45',   desc: '🏋️ Gym — Pecho + Tríceps', type: 'gym' },
      { time: '8:15–9:15',   desc: '🎮 Juego',                type: 'game' },
      { time: '9:15–9:45',   desc: '📖 Estudio bíblico',      type: 'spirit' },
      { time: '9:45–10:30',  desc: '❤️ Tiempo con pareja',    type: 'rel' },
      { time: '10:45',       desc: '😴 Dormir',               type: 'sleep' },
    ]
  },
  martes: {
    name: 'Martes', abbr: 'MAR',
    blocks: [
      { time: '6:05–6:20',   desc: '🧘 Movilidad / Descanso activo', type: 'gym' },
      { time: '6:30–7:15',   desc: '🚿 Ducha · Desayuno proteico',   type: 'sleep' },
      { time: '8:00–12:00',  desc: '💼 Trabajo profundo',            type: 'work' },
      { time: '12:30–1:30',  desc: '🍗 Almuerzo (200g pollo)',       type: 'sleep' },
      { time: '1:00–5:30',   desc: '💼 Trabajo estructurado',        type: 'work' },
      { time: '6:00–7:45',   desc: '🏋️ Gym — Espalda + Bíceps',     type: 'gym' },
      { time: '8:15–9:15',   desc: '💻 POS',                         type: 'pos' },
      { time: '9:15–9:45',   desc: '❤️ Llamada pareja',             type: 'rel' },
      { time: '9:45–10:45',  desc: '🎮 Juego',                       type: 'game' },
      { time: '11:00',       desc: '😴 Dormir',                      type: 'sleep' },
    ]
  },
  miercoles: {
    name: 'Miércoles', abbr: 'MIÉ',
    blocks: [
      { time: '6:05–6:20',   desc: '🔥 Abdominales (15 min)',  type: 'gym' },
      { time: '6:30–7:15',   desc: '🚿 Ducha · Desayuno proteico', type: 'sleep' },
      { time: '8:00–12:00',  desc: '💼 Trabajo profundo',      type: 'work' },
      { time: '12:30–1:30',  desc: '🍗 Almuerzo (200g pollo)', type: 'sleep' },
      { time: '1:00–5:30',   desc: '💼 Trabajo estructurado',  type: 'work' },
      { time: '6:00–7:45',   desc: '🏋️ Gym — Pierna',         type: 'gym' },
      { time: '8:15–9:15',   desc: '🎮 Juego',                 type: 'game' },
      { time: '9:15–9:45',   desc: '📖 Estudio bíblico',       type: 'spirit' },
      { time: '9:45–10:30',  desc: '❤️ Tiempo con pareja',     type: 'rel' },
      { time: '10:45',       desc: '😴 Dormir',                type: 'sleep' },
    ]
  },
  jueves: {
    name: 'Jueves', abbr: 'JUE',
    blocks: [
      { time: '6:05–6:20',   desc: '🧘 Movilidad / Descanso activo', type: 'gym' },
      { time: '6:30–7:15',   desc: '🚿 Ducha · Desayuno proteico',   type: 'sleep' },
      { time: '8:00–12:00',  desc: '💼 Trabajo profundo',            type: 'work' },
      { time: '12:30–1:30',  desc: '🍗 Almuerzo (200g pollo)',       type: 'sleep' },
      { time: '1:00–5:30',   desc: '💼 Trabajo estructurado',        type: 'work' },
      { time: '6:30–8:30',   desc: '📖 Reunión',                     type: 'spirit' },
      { time: '8:45–9:45',   desc: '💻 POS',                         type: 'pos' },
      { time: '9:45–10:15',  desc: '❤️ Llamada pareja',             type: 'rel' },
      { time: '10:30',       desc: '😴 Dormir',                      type: 'sleep' },
    ]
  },
  viernes: {
    name: 'Viernes', abbr: 'VIE',
    blocks: [
      { time: '6:05–6:20',   desc: '🔥 Abdominales (15 min)',  type: 'gym' },
      { time: '6:30–7:15',   desc: '🚿 Ducha · Desayuno proteico', type: 'sleep' },
      { time: '8:00–12:00',  desc: '💼 Trabajo profundo',      type: 'work' },
      { time: '12:30–1:30',  desc: '🍗 Almuerzo (200g pollo)', type: 'sleep' },
      { time: '1:00–5:30',   desc: '💼 Trabajo estructurado',  type: 'work' },
      { time: '6:00–7:45',   desc: '🏋️ Gym — Hombros + Complementos', type: 'gym' },
      { time: '8:15–9:15',   desc: '🎮 Juego',                 type: 'game' },
      { time: '9:15–9:45',   desc: '📖 Estudio bíblico',       type: 'spirit' },
      { time: '9:45–10:30',  desc: '❤️ Tiempo con pareja',     type: 'rel' },
      { time: '10:45',       desc: '😴 Dormir',                type: 'sleep' },
    ]
  },
  sabado: {
    name: 'Sábado', abbr: 'SÁB',
    blocks: [
      { time: '8:00',       desc: '🌅 Despertar flexible',       type: 'sleep' },
      { time: '8:30–9:00',  desc: '📖 Espiritualidad profunda',  type: 'spirit' },
      { time: '9:00–11:00', desc: '🏠 Pendientes / Org. financiera', type: 'work' },
      { time: '10:00–12:00',desc: '💻 POS profundo',             type: 'pos' },
      { time: 'Tarde',      desc: '❤️ Relación / Ocio moderado', type: 'rel' },
      { time: 'Noche',      desc: '🎮 Social controlado (presupuesto)', type: 'game' },
    ]
  },
  domingo: {
    name: 'Domingo', abbr: 'DOM',
    blocks: [
      { time: '9:00–11:00', desc: '📖 Reunión',                  type: 'spirit' },
      { time: 'Tarde',      desc: '❤️ Novia o familia',          type: 'rel' },
      { time: '8:00–9:00',  desc: '💻 Planificación semanal',    type: 'pos' },
      { time: '9:00–9:30',  desc: '◑ Revisión dominical',        type: 'spirit' },
      { time: '10:00',      desc: '😴 Dormir',                   type: 'sleep' },
    ]
  }
};

const GYM_SPLIT = [
  { day: 'Lunes',    icon: '🏋️', type: 'Pecho + Tríceps' },
  { day: 'Martes',   icon: '🔙', type: 'Espalda + Bíceps' },
  { day: 'Miércoles',icon: '🦵', type: 'Pierna' },
  { day: 'Jueves',   icon: '🏋️', type: 'Hombros + Complementos (Reunión)' },
  { day: 'Viernes',  icon: '💪', type: 'Hombros + Full Upper ligero' },
  { day: 'Sábado',   icon: '🟡', type: 'Descanso / Opcional' },
  { day: 'Domingo',  icon: '🔵', type: 'Descanso total' },
];

const SCHEDULE_RULES = [
  'Dormir antes de las 10:30pm todos los días.',
  '3 sesiones de abdominales mínimo (L-M-V mañana).',
  '4 sesiones de gym mínimo por semana.',
  '1 revisión financiera semanal (domingo).',
  '1 espacio intencional de relación diario.',
  'Sin pantallas 30 minutos antes de dormir.',
  'No entrenar si hay lesión o agotamiento extremo.',
  'Proteína ≥ 100g diarios.',
];

// ── MONTHS ───────────────────────────────────────────────────
const MONTHS = ['Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// ── DEFAULT STATE ─────────────────────────────────────────────
function getDefaultState() {
  return {
    fund: 0,
    protein: { today: [], history: {} },
    workouts: { log: [], weeklyHistory: {} },
    weight: { current: 72, history: [] },
    goals: JSON.parse(JSON.stringify(DEFAULT_GOALS)),
    identity: null,
    reviews: {},
    impulseItems: [],
    radarScores: { rel: 5, spirit: 5, physical: 5, work: 5, pos: 5, leisure: 5 },
    tracking: {},
    disciplineHistory: [],
    currentWeekOffset: 0,
  };
}

// ── PERSISTENCE ───────────────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return getDefaultState();
    const saved = JSON.parse(raw);
    // Merge defaults for new keys
    return Object.assign(getDefaultState(), saved);
  } catch(e) {
    return getDefaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch(e) {
    console.warn('Could not save state', e);
  }
}
