import { days } from '../utils/dates'
import { metric } from '../utils/metrics'
import { useApp } from '../context/AppContext'

// Circular progress ring.
export function Ring({ p, s, big, sub }) {
  const r = s / 2 - 9
  const c = 2 * Math.PI * r
  const m = s / 2
  return (
    <svg width={s} height={s} role="img" aria-label={`${big} ${sub}`}>
      <circle cx={m} cy={m} r={r} fill="none" stroke="var(--line)" strokeWidth="10" />
      <circle
        className="arc"
        cx={m}
        cy={m}
        r={r}
        fill="none"
        stroke="var(--or)"
        strokeWidth="10"
        strokeDasharray={`${c * p} ${c}`}
        transform={`rotate(-90 ${m} ${m})`}
      />
      <text x={m} y={m + 4} textAnchor="middle" fontSize={s / 4} fontWeight="600" fontFamily="IBM Plex Mono,monospace" fill="var(--ink)">
        {big}
      </text>
      <text x={m} y={m + s / 6} textAnchor="middle" fontSize={s / 12} fill="var(--mut)">
        {sub}
      </text>
    </svg>
  )
}

// Vertical bar chart. D = dates, V = values, mx = axis max, col = bar colour, t = optional target line.
export function BarsV({ D, V, mx, col, t }) {
  const n = D.length
  const w = 300 / n
  return (
    <svg viewBox="0 0 300 140" className="ch">
      {t ? <line x1="0" x2="300" y1={120 - (t / mx) * 105} y2={120 - (t / mx) * 105} stroke="var(--ye)" strokeDasharray="4 3" /> : null}
      {V.map((v, i) => {
        const h = v ? (v / mx) * 105 : 0
        return (
          <rect key={D[i]} x={i * w + w * 0.15} y={120 - h} width={w * 0.7} height={h} rx="1" fill={col}>
            <title>{`${D[i]}: ${v ?? 'no entry'}`}</title>
          </rect>
        )
      })}
      <line x1="0" x2="300" y1="120" y2="120" stroke="var(--line)" />
      <text x="0" y="136">{D[0].slice(5)}</text>
      <text x="300" y="136" textAnchor="end">{D[n - 1].slice(5)}</text>
    </svg>
  )
}

// Bar chart for one logged metric over the last n days, with its goal as a dashed line.
export function MetricBars({ k, n, col }) {
  const { db } = useApp()
  const D = days(n)
  const V = D.map((d) => (db.logs[d] || {})[k] ?? null)
  const t = metric(k)[4]
  return <BarsV D={D} V={V} mx={Math.max(t, ...V.map((v) => v || 0))} col={col} t={t} />
}

// Line chart. sets = [{ c: colour, p: [[index, value], ...] }].
export function Line({ sets, n, lo, hi }) {
  const x = (i) => 10 + (i / Math.max(n - 1, 1)) * 280
  const y = (v) => 120 - ((v - lo) / (hi - lo || 1)) * 105
  return (
    <svg viewBox="0 0 300 140" className="ch">
      <line x1="0" x2="300" y1="120" y2="120" stroke="var(--line)" />
      {sets.map((s, si) => {
        const p = s.p.filter((q) => q[1] != null)
        return (
          <g key={si}>
            <polyline fill="none" stroke={s.c} strokeWidth="2.5" points={p.map((q) => x(q[0]) + ',' + y(q[1])).join(' ')} />
            {p.map((q) => (
              <circle key={q[0]} cx={x(q[0])} cy={y(q[1])} r="3" fill={s.c}>
                <title>{q[1]}</title>
              </circle>
            ))}
          </g>
        )
      })}
      <text x="0" y="136">{lo}</text>
      <text x="300" y="136" textAnchor="end">{hi}</text>
    </svg>
  )
}
