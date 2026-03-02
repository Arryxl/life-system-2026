/* ============================================================
   LIFE SYSTEM 2026 — FRONTEND (conectado al backend)
   ============================================================ */
'use strict';

// ── Estado global (cargado desde API) ─────────────────────────
let state = {};
let radarChart = null;
let financeChart = null;
let proteinRingChart = null;
let weightChart = null;
let counters = { gymSessions: 0, abSessions: 0, bibleStudy: 0 };
let radioSelections = {};

// ============================================================
// CAPA API — todas las llamadas HTTP al backend
// ============================================================
const api = {
  async _req(method, path, data) {
    const opts = { method, headers: {} };
    if (data !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(data);
    }
    const r = await fetch(path, opts);
    const json = await r.json();
    if (!r.ok) throw new Error(json.error || 'Error del servidor');
    return json;
  },
  get:    (path)       => api._req('GET',    path),
  post:   (path, data) => api._req('POST',   path, data),
  put:    (path, data) => api._req('PUT',    path, data),
  delete: (path)       => api._req('DELETE', path),
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTopbar();
  createToastContainer();
  showLoader();
  api.get('/api/state')
    .then(s => {
      state = s;
      renderAll();
    })
    .catch(() => showToast('No se pudo conectar al servidor', 'error'))
    .finally(hideLoader);
});

// ── LOADER ────────────────────────────────────────────────────
function showLoader() {
  let el = document.getElementById('app-loader');
  if (!el) {
    el = document.createElement('div');
    el.id = 'app-loader';
    el.innerHTML = `<div class="loader-inner"><div class="loader-spin"></div><div class="loader-text">Cargando sistema...</div></div>`;
    el.style.cssText = `position:fixed;inset:0;background:var(--bg-0);display:flex;align-items:center;justify-content:center;z-index:9999;`;
    el.querySelector('.loader-inner').style.cssText = `text-align:center;`;
    el.querySelector('.loader-spin').style.cssText = `width:36px;height:36px;border:2px solid var(--border);border-top-color:var(--blue);border-radius:50%;animation:spin 0.7s linear infinite;margin:0 auto 14px;`;
    el.querySelector('.loader-text').style.cssText = `font-size:12px;color:var(--txt-3);letter-spacing:0.1em;`;
    const style = document.createElement('style');
    style.textContent = `@keyframes spin{to{transform:rotate(360deg)}}`;
    document.head.appendChild(style);
    document.body.appendChild(el);
  }
  el.style.display = 'flex';
}

function hideLoader() {
  const el = document.getElementById('app-loader');
  if (el) { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }
}

// ============================================================
// NAVEGACIÓN
// ============================================================
function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => switchModule(item.dataset.module));
  });
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    const mc = document.getElementById('mainContent');
    if (window.innerWidth <= 800) { sb.classList.toggle('mobile-open'); }
    else { sb.classList.toggle('collapsed'); mc.classList.toggle('expanded'); }
  });
}

function switchModule(modName) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector(`[data-module="${modName}"]`).classList.add('active');
  document.querySelectorAll('.module').forEach(s => s.classList.remove('active'));
  document.getElementById(`mod-${modName}`).classList.add('active');
  const titles = { dashboard:'Dashboard', finances:'Finanzas', physical:'Físico',
    schedule:'Horario Semanal', vision:'Visión 2026', rules:'Reglas',
    tracking:'Seguimiento', sunday:'Revisión Dominical' };
  document.getElementById('pageTitle').textContent = titles[modName] || modName;
  if (modName === 'dashboard') renderDashboardCharts();
  if (modName === 'physical')  renderPhysicalCharts();
  if (modName === 'tracking')  renderTrackingModule();
}

// ── TOPBAR ────────────────────────────────────────────────────
function initTopbar() {
  const now = new Date();
  const days   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  document.getElementById('currentDate').textContent =
    `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  document.getElementById('dayIndicator').textContent = days[now.getDay()].toUpperCase();
}

// ============================================================
// RENDER ALL
// ============================================================
function renderAll() {
  renderDashboard();
  renderFinances();
  renderPhysical();
  renderSchedule();
  renderVision();
  renderRules();
  renderSundayPanel();
  updateDisciplineBadge();
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  renderKPIs();
  renderDebtTimeline();
  renderTodayAgenda();
  renderRulesReminder();
  renderDashboardCharts();
}

function renderKPIs() {
  const fund = state.fund || 0;
  const proteinToday = getTodayProtein();
  const streak = calcGymStreak();
  const el = id => document.getElementById(id);
  if (el('kpi-fund'))    el('kpi-fund').textContent    = formatCOP(fund);
  if (el('kpi-protein')) el('kpi-protein').textContent = proteinToday + 'g';
  if (el('kpi-streak'))  el('kpi-streak').textContent  = streak;
}

function renderDashboardCharts() {
  renderRadarChart();
  renderFinanceChart();
}

function renderRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;
  const s = state.radarScores || { rel:5, spirit:5, physical:5, work:5, pos:5, leisure:5 };
  if (radarChart) radarChart.destroy();
  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Relación','Espiritual','Físico','Trabajo','POS','Ocio'],
      datasets: [{
        data: [s.rel, s.spirit, s.physical, s.work, s.pos, s.leisure],
        backgroundColor: 'rgba(58,123,213,0.12)',
        borderColor: '#3a7bd5',
        borderWidth: 2,
        pointBackgroundColor: '#3a7bd5',
        pointBorderColor: '#070709',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        r: {
          min: 0, max: 10,
          ticks: { display: false },
          grid: { color: '#2a2a32' },
          angleLines: { color: '#2a2a32' },
          pointLabels: { color: '#a0a0b0', font: { size: 11 } }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderFinanceChart() {
  const ctx = document.getElementById('financeChart');
  if (!ctx) return;
  const labels = ['Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const target = [0,0,0,0,500000,1000000,1500000,1800000,2100000,2500000];
  const real   = labels.map((_, i) => i === 0 ? (state.fund || 0) : null);
  if (financeChart) financeChart.destroy();
  financeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label:'Meta Fondo', data: target, borderColor:'#3a9e6e', borderWidth:2,
          borderDash:[4,4], pointRadius:3, backgroundColor:'transparent', tension:0.4 },
        { label:'Real', data: real, borderColor:'#3a7bd5', borderWidth:2,
          pointRadius:4, backgroundColor:'rgba(58,123,213,0.1)', fill:true, tension:0.4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { grid:{ color:'#1a1a20' }, ticks:{ color:'#606070', font:{ size:10 } } },
        y: { grid:{ color:'#1a1a20' }, ticks:{ color:'#606070', font:{ size:10 },
          callback: v => '$'+(v/1000).toFixed(0)+'k' } }
      },
      plugins: {
        legend: { display:true, labels:{ color:'#a0a0b0', font:{ size:11 }, boxWidth:12 } },
        tooltip: { backgroundColor:'#1a1a20', borderColor:'#2a2a32', borderWidth:1,
          titleColor:'#eaeaf0', bodyColor:'#a0a0b0',
          callbacks: { label: ctx => ' '+formatCOP(ctx.raw) } }
      }
    }
  });
}

function renderDebtTimeline() {
  const el = document.getElementById('debtTimeline');
  if (!el) return;
  const now = new Date();
  el.innerHTML = DEBTS.map(d => {
    const elapsed = Math.max(0, now - new Date(2026, 2, 1));
    const total   = d.endsDate - new Date(2026, 2, 1);
    const pct     = Math.min(100, Math.round((elapsed / total) * 100));
    const done    = now >= d.endsDate;
    return `<div class="debt-row">
      <div class="debt-name">${d.name}</div>
      <div class="debt-bar-bg"><div class="debt-bar-fill ${done?'done':''}" style="width:${pct}%"></div></div>
      <div class="debt-end">${done ? '✓ Libre' : d.endsMonth}</div>
    </div>`;
  }).join('');
}

function renderTodayAgenda() {
  const el = document.getElementById('todayAgenda');
  if (!el) return;
  const keys = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
  const dayData = WEEKLY_SCHEDULE[keys[new Date().getDay()]];
  if (!dayData) return;
  el.innerHTML = dayData.blocks.slice(0,6).map(b => `
    <div class="agenda-block agenda-${b.type}">
      <span class="agenda-time">${b.time}</span>
      <span class="agenda-desc">${b.desc}</span>
    </div>`).join('');
}

function renderRulesReminder() {
  const el = document.getElementById('rulesReminder');
  if (!el) return;
  const keys = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
  const today = keys[new Date().getDay()];
  const daily = ['Proteína ≥ 100g','Sin pantallas 30min antes de dormir',
    'Tiempo intencional con pareja','Dormir antes 10:30pm'];
  if (['lunes','martes','miercoles','viernes'].includes(today)) daily.splice(1,0,'Ir al gym');
  if (['lunes','miercoles','viernes'].includes(today)) daily.splice(1,0,'Abdominales mañana');
  el.innerHTML = daily.map(r => `
    <div class="rule-check-item">
      <div class="rule-dot"></div>
      <span class="rule-check-text">${r}</span>
    </div>`).join('');
}

// ============================================================
// FINANCES
// ============================================================
function renderFinances() {
  renderFinanceBanner();
  renderExpenseLists();
  renderDebtCards();
  renderFund();
  renderProjectionGrid();
}

function renderFinanceBanner() {
  const el = document.getElementById('financeModeBanner');
  if (!el) return;
  const m = new Date().getMonth();
  el.textContent = m < 7
    ? '⚡ MODO ESTABILIDAD — Marzo a Julio: No modificar pagos. No adquirir nuevas deudas.'
    : m < 10
    ? '📈 MODO AHORRO — $700.000 liberados. $500k fondo + $200k ahorro estratégico.'
    : '🎯 MODO CRECIMIENTO — Completar fondo + inversión + mejora personal.';
}

function renderExpenseLists() {
  const render = (items, containerId) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = items.map(i => `
      <div class="expense-row">
        <span class="expense-name">${i.name}</span>
        <div>
          <span class="expense-amount">${formatCOP(i.amount)}</span>
          ${i.endsMonth ? `<span class="expense-tag ends">Termina: ${i.endsMonth}</span>` : ''}
        </div>
      </div>`).join('');
  };
  render(EXPENSES_1_15, 'expenses-1-15');
  render(EXPENSES_15_30, 'expenses-15-30');
}

function renderDebtCards() {
  const el = document.getElementById('debtCards');
  if (!el) return;
  const now = new Date();
  el.innerHTML = DEBTS.map(d => {
    const done = now >= d.endsDate;
    return `<div class="debt-card ${done?'liberated':''}">
      <div class="debt-card-name">${d.name}</div>
      <div class="debt-card-amount">${formatCOP(d.amount)}/mes</div>
      <div class="debt-card-end">${done ? '✓ Liberado' : 'Termina: '+d.endsMonth}</div>
    </div>`;
  }).join('');
}

function renderFund() {
  const fund = state.fund || 0;
  const goal = 3000000;
  const pct  = Math.min(100, (fund / goal) * 100);
  const set  = (id, v) => { const e = document.getElementById(id); if(e) e[typeof v==='string'?'textContent':'style'].width = typeof v==='string'?v:v+'%'; };
  document.getElementById('fundAmount')   && (document.getElementById('fundAmount').textContent   = formatCOP(fund));
  document.getElementById('fundProgress') && (document.getElementById('fundProgress').style.width = pct+'%');
  document.getElementById('kpi-fund')     && (document.getElementById('kpi-fund').textContent     = formatCOP(fund));
}

function renderProjectionGrid() {
  const el = document.getElementById('projectionGrid');
  if (!el) return;
  let cumFund = state.fund || 0;
  el.innerHTML = MONTHS.map(m => {
    const plan = FINANCIAL_PLAN[m];
    if (plan.fundDeposit) cumFund += plan.fundDeposit;
    const milestone = m === 'Septiembre' || m === 'Diciembre';
    return `<div class="proj-card ${milestone?'milestone':''}">
      <div class="proj-month">${m.toUpperCase()}</div>
      <div class="proj-amount">${formatCOP(cumFund)}</div>
      <div class="proj-detail">${plan.mode.charAt(0).toUpperCase()+plan.mode.slice(1)}</div>
      ${plan.invest ? `<div class="proj-detail">+Inv. ${formatCOP(plan.invest)}</div>` : ''}
    </div>`;
  }).join('');
}

async function depositFund() {
  const input  = document.getElementById('fundInput');
  const amount = parseInt(input.value);
  if (!amount || amount <= 0) { showToast('Ingresa un monto válido', 'error'); return; }
  try {
    const { fund } = await api.post('/api/fund/deposit', { amount });
    state.fund = fund;
    renderFund();
    renderProjectionGrid();
    renderFinanceChart();
    showToast(`Depositado ${formatCOP(amount)} al fondo ✓`, 'success');
    input.value = '';
  } catch(e) { showToast(e.message, 'error'); }
}

// ============================================================
// PHYSICAL
// ============================================================
function renderPhysical() {
  renderPhysicalStats();
  renderWorkoutWeek();
  renderConsistencyHeatmap();
  renderProteinSources();
}

function renderPhysicalStats() {
  const w   = parseFloat(state.weight?.current) || 72;
  const bmi = (w / (1.81 * 1.81)).toFixed(1);
  const set = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
  set('currentWeight', w + ' kg');
  set('currentBMI', bmi);
}

function renderPhysicalCharts() {
  renderProteinRing();
  renderWeightChart();
}

function renderProteinRing() {
  const ctx = document.getElementById('proteinRing');
  if (!ctx) return;
  const total = getTodayProtein();
  const goal  = PHYSICAL_BASE.proteinGoal;
  const pct   = Math.min(total, goal);
  const rem   = Math.max(0, goal - pct);
  if (proteinRingChart) proteinRingChart.destroy();
  proteinRingChart = new Chart(ctx, {
    type: 'doughnut',
    data: { datasets: [{ data: [pct, rem], backgroundColor: ['#3a9e6e','#1a1a20'], borderWidth: 0 }] },
    options: { responsive:false, cutout:'72%', plugins:{ legend:{display:false}, tooltip:{enabled:false} } }
  });
  const c = document.getElementById('proteinCenter');
  if (c) c.textContent = total + 'g';
  const kp = document.getElementById('kpi-protein');
  if (kp) kp.textContent = total + 'g';
}

function renderProteinSources() {
  const el = document.getElementById('proteinSources');
  if (!el) return;
  const entries = state.protein?.today || [];
  el.innerHTML = entries.length
    ? entries.map(e => `<div class="protein-source-row">
        <span class="protein-source-name">${e.name}</span>
        <span class="protein-source-g">+${e.grams}g</span>
      </div>`).join('')
    : '<div style="color:var(--txt-3);font-size:11px;">Sin registros hoy</div>';
}

async function addProtein() {
  const sel = document.getElementById('proteinSelect');
  const val = sel.value;
  if (!val) { showToast('Selecciona un alimento', 'error'); return; }
  if (val === 'custom') {
    document.getElementById('customProteinWrap').classList.toggle('hidden');
    return;
  }
  const food = PROTEIN_FOODS.find(f => f.id === val);
  if (!food) return;
  await logProteinEntry(food.name, food.grams);
  sel.value = '';
}

async function logProteinEntry(name, grams) {
  try {
    const { entries } = await api.post('/api/protein', { name, grams, date: getTodayKey() });
    state.protein = { today: entries };
    renderProteinSources();
    renderProteinRing();
    showToast(`+${grams}g proteína (${name}) ✓`, 'success');
  } catch(e) { showToast(e.message, 'error'); }
}

function renderWorkoutWeek() {
  const el = document.getElementById('workoutWeek');
  if (!el) return;
  const days = [
    { abbr:'LUN', key:'lunes',     type:'Pecho',   icon:'🏋️' },
    { abbr:'MAR', key:'martes',    type:'Espalda',  icon:'🔙' },
    { abbr:'MIÉ', key:'miercoles', type:'Pierna',   icon:'🦵' },
    { abbr:'JUE', key:'jueves',    type:'Hombros',  icon:'🔷' },
    { abbr:'VIE', key:'viernes',   type:'Upper',    icon:'💪' },
    { abbr:'SÁB', key:'sabado',    type:'Descanso', icon:'🟡' },
    { abbr:'DOM', key:'domingo',   type:'Descanso', icon:'🔵' },
  ];
  const weekKeys = (state.workouts?.week || []).map(w => w.day_key);
  el.innerHTML = days.map(d => {
    const done   = weekKeys.includes(d.key);
    const isRest = ['sabado','domingo'].includes(d.key);
    return `<div class="workout-day ${done?'done':''} ${isRest?'rest-day':''}">
      <div class="wd-label">${d.abbr}</div>
      <span class="wd-icon">${d.icon}</span>
      <div class="wd-type">${d.type}</div>
    </div>`;
  }).join('');
}

async function logWorkout() {
  const sel = document.getElementById('workoutType');
  if (!sel.value) { showToast('Selecciona el tipo de sesión', 'error'); return; }
  const keys = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
  const dayKey = keys[new Date().getDay()];
  try {
    const result = await api.post('/api/workouts', { date:getTodayKey(), day_key:dayKey, type:sel.value });
    state.workouts = result;
    renderWorkoutWeek();
    renderConsistencyHeatmap();
    renderKPIs();
    showToast('Entrenamiento registrado ✓', 'success');
    sel.value = '';
  } catch(e) { showToast(e.message, 'error'); }
}

function renderConsistencyHeatmap() {
  const el = document.getElementById('consistencyHeatmap');
  if (!el) return;
  const all  = state.workouts?.all || [];
  const now  = new Date();
  const cells = Array(12).fill(0).map((_, wi) => {
    const wStart = new Date(now);
    wStart.setDate(now.getDate() - 7*(11-wi) - now.getDay() + 1);
    wStart.setHours(0,0,0,0);
    const wEnd = new Date(wStart);
    wEnd.setDate(wEnd.getDate() + 7);
    return all.filter(w => { const d = new Date(w.created_at); return d >= wStart && d < wEnd; }).length;
  });
  el.innerHTML = cells.map(count => {
    const lv = count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 4 ? 3 : 4;
    return `<div class="heat-cell level-${lv}" title="${count} sesiones"></div>`;
  }).join('');
}

async function logWeight() {
  const input = document.getElementById('weightInput');
  const w = parseFloat(input.value);
  if (!w || w < 30 || w > 200) { showToast('Ingresa un peso válido', 'error'); return; }
  try {
    const result = await api.post('/api/weight', { weight: w, date: getTodayKey() });
    state.weight = result;
    renderPhysicalStats();
    renderWeightChart();
    showToast(`Peso registrado: ${w}kg ✓`, 'success');
    input.value = '';
  } catch(e) { showToast(e.message, 'error'); }
}

function renderWeightChart() {
  const ctx = document.getElementById('weightChart');
  if (!ctx) return;
  const history = (state.weight?.history || []).slice(0,12).reverse();
  if (history.length < 2) return;
  if (weightChart) weightChart.destroy();
  weightChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: history.map(h => String(h.date).slice(5)),
      datasets: [{ data: history.map(h => parseFloat(h.weight)), borderColor:'#3a7bd5',
        backgroundColor:'rgba(58,123,213,0.1)', borderWidth:2, pointRadius:3, fill:true, tension:0.4 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{display:false} },
      scales: {
        x: { grid:{color:'#1a1a20'}, ticks:{color:'#606070', font:{size:9}} },
        y: { grid:{color:'#1a1a20'}, ticks:{color:'#606070', font:{size:9}, callback: v => v+'kg'} }
      }
    }
  });
}

// ============================================================
// SCHEDULE
// ============================================================
function renderSchedule() {
  renderScheduleGrid();
  renderGymSplit();
  renderScheduleRules();
  updateWeekLabel();
}

function renderScheduleGrid() {
  const el = document.getElementById('scheduleGrid');
  if (!el) return;
  const order = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
  const keys  = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
  const todayKey = keys[new Date().getDay()];
  el.innerHTML = order.map(key => {
    const d = WEEKLY_SCHEDULE[key];
    const isToday = key === todayKey;
    return `<div class="day-col ${isToday?'today':''}">
      <div class="day-col-header">
        <div class="day-col-name">${d.abbr}</div>
        <div class="day-col-date">${d.name}</div>
      </div>
      <div class="day-blocks">
        ${d.blocks.map(b => `<div class="sched-block sched-${b.type}">
          <div class="block-time">${b.time}</div>
          <div class="block-desc">${b.desc}</div>
        </div>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function renderGymSplit() {
  const el = document.getElementById('gymSplit');
  if (!el) return;
  el.innerHTML = GYM_SPLIT.map(d => `
    <div class="gym-day-card">
      <div class="gym-day-name">${d.day.toUpperCase()}</div>
      <div class="gym-day-icon">${d.icon}</div>
      <div class="gym-day-type">${d.type}</div>
    </div>`).join('');
}

function renderScheduleRules() {
  const el = document.getElementById('scheduleRules');
  if (!el) return;
  el.innerHTML = SCHEDULE_RULES.map(r => `
    <div class="sched-rule-item">
      <div class="sched-rule-marker"></div>
      <span class="sched-rule-text">${r}</span>
    </div>`).join('');
}

function prevWeek() { updateWeekLabel(-1); }
function nextWeek() { updateWeekLabel(1); }
let weekOffset = 0;
function updateWeekLabel(delta = 0) {
  weekOffset += delta;
  const el = document.getElementById('weekLabel');
  if (!el) return;
  if (weekOffset === 0) { el.textContent = 'Semana actual'; return; }
  const now = new Date();
  now.setDate(now.getDate() + weekOffset * 7);
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  el.textContent = `Semana del ${now.getDate()} ${months[now.getMonth()]}`;
}

// ============================================================
// VISION
// ============================================================
function renderVision() {
  renderIdentity();
  renderPriorityList();
  renderGoalsList();
  renderPrinciplesList();
}

function renderIdentity() {
  const el = document.getElementById('identityText');
  if (el && state.identity) el.textContent = state.identity;
}

async function saveIdentity() {
  const el = document.getElementById('identityText');
  try {
    await api.put('/api/identity', { content: el.textContent });
    state.identity = el.textContent;
    showToast('Declaración guardada ✓', 'success');
  } catch(e) { showToast(e.message, 'error'); }
}

function renderPriorityList() {
  const el = document.getElementById('priorityList');
  if (!el) return;
  el.innerHTML = PRIORITIES.map(p => `
    <div class="priority-item p${p.rank}">
      <div class="priority-rank">${p.rank}</div>
      <div class="priority-icon">${p.icon}</div>
      <div class="priority-info">
        <div class="priority-name">${p.name}</div>
        <div class="priority-desc">${p.desc}</div>
      </div>
    </div>`).join('');
}

function renderGoalsList() {
  const el = document.getElementById('goalsList');
  if (!el) return;
  el.innerHTML = (state.goals || []).map(g => `
    <div class="goal-item">
      <div class="goal-check ${g.done?'checked':''}" onclick="toggleGoal(${g.id},${g.done})">
        ${g.done ? '✓' : ''}
      </div>
      <span class="goal-text ${g.done?'done':''}">${g.text}</span>
      <button class="goal-delete" onclick="deleteGoal(${g.id})">×</button>
    </div>`).join('');
}

async function toggleGoal(id, currentDone) {
  try {
    await api.put(`/api/goals/${id}`, { done: !currentDone });
    const goal = state.goals.find(g => g.id === id);
    if (goal) goal.done = !currentDone;
    renderGoalsList();
  } catch(e) { showToast(e.message, 'error'); }
}

async function deleteGoal(id) {
  try {
    await api.delete(`/api/goals/${id}`);
    state.goals = state.goals.filter(g => g.id !== id);
    renderGoalsList();
  } catch(e) { showToast(e.message, 'error'); }
}

async function addGoal() {
  const input = document.getElementById('goalInput');
  const text  = input.value.trim();
  if (!text) return;
  try {
    const goal = await api.post('/api/goals', { text });
    state.goals.push(goal);
    renderGoalsList();
    input.value = '';
  } catch(e) { showToast(e.message, 'error'); }
}

function renderPrinciplesList() {
  const el = document.getElementById('principlesList');
  if (!el) return;
  el.innerHTML = PRINCIPLES.map((p, i) => `
    <div class="principle-card">
      <div class="principle-num">0${i+1}</div>
      <div class="principle-text">${p}</div>
    </div>`).join('');
}

// ============================================================
// RULES
// ============================================================
function renderRules() {
  renderRulesGrid();
  renderImpulseTracker();
}

function renderRulesGrid() {
  const el = document.getElementById('rulesGrid');
  if (!el) return;
  el.innerHTML = Object.entries(RULES).map(([key, s]) => `
    <div class="rule-block rule-${key}">
      <div class="rule-block-title">${s.title}</div>
      ${s.items.map(item => `<div class="rule-item">
        <span class="rule-arrow">→</span>
        <span class="rule-text">${item}</span>
      </div>`).join('')}
    </div>`).join('');
}

function renderImpulseTracker() {
  const el = document.getElementById('impulseTracker');
  if (!el) return;
  const items = state.impulseItems || [];
  if (!items.length) {
    el.innerHTML = '<div style="color:var(--txt-3);font-size:12px;padding:8px 0;">Sin artículos registrados.</div>';
    return;
  }
  const now = Date.now();
  el.innerHTML = items.map(item => {
    const created   = new Date(item.created_at).getTime();
    const daysPassed = Math.floor((now - created) / 86400000);
    const daysLeft  = Math.max(0, 30 - daysPassed);
    const safe      = daysLeft === 0;
    return `<div class="impulse-item">
      <span class="impulse-name">${item.name}</span>
      <span class="impulse-amount">${formatCOP(item.amount)}</span>
      <span class="impulse-days ${safe?'safe':''}">
        ${safe ? '✓ Puedes comprar' : daysLeft+' días restantes'}
      </span>
      <button class="goal-delete" onclick="deleteImpulse(${item.id})">×</button>
    </div>`;
  }).join('');
}

async function addImpulseItem() {
  const nameEl   = document.getElementById('impulseItem');
  const amountEl = document.getElementById('impulseAmount');
  const name     = nameEl.value.trim();
  const amount   = parseInt(amountEl.value);
  if (!name || !amount) { showToast('Completa nombre y valor', 'error'); return; }
  try {
    const item = await api.post('/api/impulse', { name, amount });
    if (!state.impulseItems) state.impulseItems = [];
    state.impulseItems.unshift(item);
    renderImpulseTracker();
    nameEl.value   = '';
    amountEl.value = '';
    showToast('Deseo registrado. Espera 30 días ⏳', 'success');
  } catch(e) { showToast(e.message, 'error'); }
}

async function deleteImpulse(id) {
  try {
    await api.delete(`/api/impulse/${id}`);
    state.impulseItems = state.impulseItems.filter(i => i.id !== id);
    renderImpulseTracker();
  } catch(e) { showToast(e.message, 'error'); }
}

// ============================================================
// TRACKING MENSUAL
// ============================================================
function renderTrackingModule() {
  const tabsEl = document.getElementById('monthTabs');
  if (!tabsEl) return;
  const nowName = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
    'Agosto','Septiembre','Octubre','Noviembre','Diciembre'][new Date().getMonth()];
  tabsEl.innerHTML = MONTHS.map(m => {
    const cur = m === nowName;
    return `<div class="month-tab ${cur?'active current':''}" onclick="showTrackingMonth('${m}',this)">${m}</div>`;
  }).join('');
  showTrackingMonth(nowName || 'Marzo', null);
}

async function showTrackingMonth(month, tabEl) {
  if (tabEl) {
    document.querySelectorAll('.month-tab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
  }
  const el = document.getElementById('trackingContent');
  if (!el) return;
  el.innerHTML = '<div style="padding:20px;color:var(--txt-3);font-size:12px;">Cargando...</div>';
  try {
    const data = await api.get(`/api/tracking/${encodeURIComponent(month)}`);
    const plan = FINANCIAL_PLAN[month] || {};
    el.innerHTML = `
      <div class="tracking-month-panel">
        <div class="tracking-section">
          <div class="tracking-section-title">💰 Finanzas — ${month}</div>
          <div class="tracking-metric"><span class="tracking-metric-label">Modo del mes</span>
            <span class="tracking-metric-value">${plan.mode ? plan.mode.charAt(0).toUpperCase()+plan.mode.slice(1) : '—'}</span></div>
          <div class="tracking-metric"><span class="tracking-metric-label">Depósito fondo</span>
            <span class="tracking-metric-value">${plan.fundDeposit ? formatCOP(plan.fundDeposit) : 'Estabilidad'}</span></div>
          <div class="tracking-metric"><span class="tracking-metric-label">Meta fondo acumulado</span>
            <span class="tracking-metric-value">${plan.fundTarget ? formatCOP(plan.fundTarget) : '—'}</span></div>
          <div class="tracking-metric"><span class="tracking-metric-label">¿Presupuesto cumplido?</span>
            <input class="tracking-input" data-key="budgetOk" value="${data.budgetOk||''}" placeholder="Sí / No" /></div>
          <div class="tracking-metric"><span class="tracking-metric-label">Gastos extra (COP)</span>
            <input class="tracking-input" type="number" data-key="extraSpend" value="${data.extraSpend||''}" placeholder="0" /></div>
        </div>
        <div class="tracking-section">
          <div class="tracking-section-title">💪 Físico — ${month}</div>
          <div class="tracking-metric"><span class="tracking-metric-label">Peso final (kg)</span>
            <input class="tracking-input" type="number" data-key="weightEnd" value="${data.weightEnd||''}" placeholder="72" /></div>
          <div class="tracking-metric"><span class="tracking-metric-label">Proteína promedio (g/día)</span>
            <input class="tracking-input" type="number" data-key="avgProtein" value="${data.avgProtein||''}" placeholder="100" /></div>
          <div class="tracking-metric"><span class="tracking-metric-label">Sesiones de gym</span>
            <input class="tracking-input" type="number" data-key="gymSessions" value="${data.gymSessions||''}" placeholder="0" /></div>
          <div class="tracking-metric"><span class="tracking-metric-label">Sesiones abdominales</span>
            <input class="tracking-input" type="number" data-key="abSessions" value="${data.abSessions||''}" placeholder="0" /></div>
        </div>
        <div class="tracking-section">
          <div class="tracking-section-title">⚡ Disciplina — ${month}</div>
          <div class="tracking-metric"><span class="tracking-metric-label">Nivel disciplina (%)</span>
            <input class="tracking-input" type="number" data-key="discipline" value="${data.discipline||''}" placeholder="0–100" /></div>
          <div class="tracking-metric"><span class="tracking-metric-label">Horas sueño promedio</span>
            <input class="tracking-input" type="number" data-key="avgSleep" value="${data.avgSleep||''}" placeholder="7" /></div>
          <div class="tracking-metric"><span class="tracking-metric-label">Estudios bíblicos</span>
            <input class="tracking-input" type="number" data-key="bibleStudy" value="${data.bibleStudy||''}" placeholder="0" /></div>
          <div class="tracking-metric"><span class="tracking-metric-label">Notas del mes</span></div>
          <textarea class="review-textarea" data-key="notes" style="margin-top:6px"
            placeholder="Reflexión mensual...">${data.notes||''}</textarea>
        </div>
        <div style="padding:16px 0 4px;display:flex;align-items:center;gap:12px;justify-content:flex-end;">
          <span id="trackingDirtyMsg" style="font-size:11px;color:var(--orange);display:none;">Cambios sin guardar</span>
          <button id="saveTrackingBtn" class="btn" onclick="saveTrackingMonth('${month}')">Guardar mes</button>
        </div>
      </div>`;

    el.querySelectorAll('[data-key]').forEach(inp => {
      inp.addEventListener('input', () => {
        const msg = document.getElementById('trackingDirtyMsg');
        const btn = document.getElementById('saveTrackingBtn');
        if (msg) msg.style.display = 'inline';
        if (btn) { btn.style.background = 'var(--orange)'; btn.textContent = 'Guardar mes'; }
      });
    });
  } catch(e) {
    el.innerHTML = '<div style="padding:20px;color:var(--red);font-size:12px;">Error al cargar datos</div>';
  }
}

async function saveTrackingMonth(month) {
  const btn = document.getElementById('saveTrackingBtn');
  const msg = document.getElementById('trackingDirtyMsg');
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; btn.style.background = ''; }
  try {
    const saves = [];
    document.querySelectorAll('#trackingContent [data-key]').forEach(inp => {
      saves.push(api.post('/api/tracking', { month, key: inp.dataset.key, value: inp.value }));
    });
    await Promise.all(saves);
    if (msg) msg.style.display = 'none';
    if (btn) { btn.disabled = false; btn.textContent = 'Guardado ✓'; btn.style.background = 'var(--green)'; }
    showToast('Seguimiento de ' + month + ' guardado', 'success');
    setTimeout(() => { if (btn) { btn.textContent = 'Guardar mes'; btn.style.background = ''; } }, 2500);
  } catch(e) {
    if (btn) { btn.disabled = false; btn.textContent = 'Guardar mes'; }
    showToast('Error al guardar', 'error');
  }
}

// ============================================================
// SUNDAY REVIEW
// ============================================================
function renderSundayPanel() {
  document.querySelectorAll('.radio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      radioSelections[key] = btn.dataset.val;
      document.querySelectorAll(`[data-key="${key}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

function adjustCounter(id, delta) {
  counters[id] = Math.max(0, (counters[id] || 0) + delta);
  const el = document.getElementById(id);
  if (el) el.textContent = counters[id];
}

function updateDisciplineDisplay(val) {
  const el = document.getElementById('disciplineDisplay');
  if (el) el.textContent = val + '%';
}

async function saveWeeklyReview() {
  const weekKey = getWeekKey();
  const review = {
    week_key:     weekKey,
    budget:       radioSelections.budget,
    relationship: radioSelections.relationship,
    gym_sessions: counters.gymSessions,
    ab_sessions:  counters.abSessions,
    bible_study:  counters.bibleStudy,
    avg_protein:  document.getElementById('avgProtein')?.value,
    discipline:   document.getElementById('disciplineSlider')?.value,
    avg_sleep:    document.getElementById('avgSleep')?.value,
    extra_spend:  document.getElementById('extraSpend')?.value,
    reflection:   document.getElementById('weekReflection')?.value,
    next_week:    document.getElementById('nextWeekFocus')?.value,
  };
  try {
    await api.post('/api/reviews', review);

    // Actualizar radar scores
    const d = parseInt(review.discipline) / 10;
    const newRadar = {
      rel:      radioSelections.relationship === 'great' ? 9 : radioSelections.relationship === 'ok' ? 6 : 4,
      spirit:   Math.min(10, (counters.bibleStudy / 3) * 10),
      physical: Math.min(10, (counters.gymSessions / 5) * 10),
      work:     d, pos: Math.round(d * 0.8), leisure: 6,
    };
    state.radarScores = newRadar;
    await api.post('/api/settings', { key: 'radarScores', value: newRadar });

    // Actualizar historial de disciplina
    const discVal = parseInt(review.discipline) || 0;
    state.disciplineHistory = [...(state.disciplineHistory || []), discVal];
    await api.post('/api/settings', { key: 'disciplineHistory', value: state.disciplineHistory });

    updateDisciplineBadge();
    renderRadarChart();
    showToast('Revisión dominical guardada ✓', 'success');
  } catch(e) { showToast(e.message, 'error'); }
}

function updateDisciplineBadge() {
  const hist = state.disciplineHistory || [];
  const last = hist[hist.length - 1];
  const el   = document.getElementById('disciplineValue');
  if (el) el.textContent = last != null ? last + '%' : '—';
}

// ============================================================
// HELPERS
// ============================================================
function formatCOP(n) {
  if (!n && n !== 0) return '—';
  return '$' + Math.round(n).toLocaleString('es-CO');
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getWeekKey() {
  const d   = new Date();
  const year = d.getFullYear();
  const start = new Date(year, 0, 1);
  const week  = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2,'0')}`;
}

function getTodayProtein() {
  return (state.protein?.today || []).reduce((s, e) => s + (parseInt(e.grams) || 0), 0);
}

function calcGymStreak() {
  const all = state.workouts?.all || [];
  if (!all.length) return 0;
  let streak = 0;
  const now  = new Date();
  for (let w = 0; w < 20; w++) {
    const wStart = new Date(now);
    wStart.setDate(now.getDate() - 7*w - now.getDay() + 1);
    wStart.setHours(0,0,0,0);
    const wEnd = new Date(wStart);
    wEnd.setDate(wEnd.getDate() + 7);
    const count = all.filter(e => { const d = new Date(e.created_at); return d >= wStart && d < wEnd; }).length;
    if (count >= 4) streak++;
    else if (w > 0) break;
  }
  return streak;
}

// ── TOAST ─────────────────────────────────────────────────────
function createToastContainer() {
  const div = document.createElement('div');
  div.id = 'toast-container';
  document.body.appendChild(div);
}

function showToast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.cssText += 'opacity:0;transition:opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
}
