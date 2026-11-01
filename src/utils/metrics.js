import { days } from './dates'

// Metric definition: [key, name, icon, unit, daily target, step, lowerIsBetter]
export const M = [
  ['water', 'Water', '💧', 'glasses', 8, 1],
  ['sleep', 'Sleep', '🌙', 'hrs', 8, 0.5],
  ['steps', 'Steps', '👟', 'steps', 8000, 500],
  ['exercise', 'Exercise', '🏃', 'min', 30, 5],
  ['meals', 'Meals', '🍽️', 'meals', 3, 1],
  ['screen', 'Screen time', '📱', 'hrs', 4, 0.5, 1],
  ['mood', 'Mood', '😊', 'of 5', 5, 1],
  ['stress', 'Stress', '🧘', 'of 5', 5, 1, 1],
]

export const isScale = (k) => k === 'mood' || k === 'stress'
export const metric = (k) => M.find((m) => m[0] === k)

// Fraction (0-1) of the daily goal reached for one metric value.
export function pct(k, v) {
  if (v == null) return null
  const t = metric(k)[4]
  return k === 'stress' ? (6 - v) / 5 : k === 'screen' ? (v <= t ? 1 : t / v) : Math.min(1, v / t)
}

export const habitPct = (db, d) => {
  if (!db.habits.length) return null
  const h = (db.logs[d] || {}).h || {}
  return db.habits.filter((x) => (h[x.id] || 0) >= x.t).length / db.habits.length
}

// Overall 0-100 health score for a day.
export function score(db, d) {
  const l = db.logs[d] || {}
  const p = M.map((m) => pct(m[0], l[m[0]])).filter((x) => x != null)
  const h = habitPct(db, d)
  if (h != null && (p.length || h > 0)) p.push(h)
  return p.length ? Math.round((p.reduce((a, b) => a + b) / p.length) * 100) : 0
}

// Average of one metric over a list of dates (null when there is no data).
export const avg = (db, k, D) => {
  const v = D.map((d) => (db.logs[d] || {})[k]).filter((x) => x != null)
  return v.length ? Math.round((v.reduce((a, b) => a + b) / v.length) * 10) / 10 : null
}

// 30 days of random sample data, used by the "Load sample data" button.
export function seedLogs(db) {
  days(30).forEach((d) => {
    if (db.logs[d]) return
    const r = (a, b) => Math.round((a + Math.random() * (b - a)) * 2) / 2
    db.logs[d] = {
      water: r(4, 10) | 0,
      sleep: r(5.5, 8.5),
      steps: Math.round(r(3000, 11000) / 500) * 500,
      exercise: Math.round(r(0, 50) / 5) * 5,
      meals: r(2, 4) | 0,
      screen: r(2, 8),
      mood: r(2, 5) | 0 || 3,
      stress: r(1, 5) | 0 || 2,
      h: Object.fromEntries(db.habits.map((h) => [h.id, Math.random() > 0.35 ? h.t : 0])),
    }
  })
}
