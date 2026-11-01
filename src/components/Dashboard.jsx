import { useApp } from '../context/AppContext'
import { ensureLog } from '../utils/storage'
import { today } from '../utils/dates'
import { M, isScale, pct, score } from '../utils/metrics'
import { getRecommendations } from '../utils/recommendations'
import { Ring } from './Charts'

function MetricCard({ m }) {
  const { db, update } = useApp()
  const [k, n, , u, t, step] = m
  const v = (db.logs[today()] || {})[k]
  const p = pct(k, v)

  const adjust = (dir) =>
    update((d) => {
      const l = ensureLog(d, today())
      l[k] = Math.max(0, Math.round(((l[k] ?? 0) + dir * step) * 10) / 10)
    })
  const setValue = (x) => update((d) => { ensureLog(d, today())[k] = x })

  return (
    <div className="card">
      <div className="row sp">
        <b className="lab">{n}</b>
        <span className="mut" style={{ fontSize: '.8rem' }}>
          {isScale(k) ? (k === 'mood' ? '1 low – 5 high' : '1 calm – 5 high') : `goal ${t} ${u}`}
        </span>
      </div>
      <div className="big-n">{v ?? '–'} <small>{isScale(k) ? '' : u}</small></div>
      <div className="bar"><i className={p >= 1 ? 'ok' : ''} style={{ width: `${(p || 0) * 100}%` }}></i></div>
      <div className="row">
        {isScale(k)
          ? [1, 2, 3, 4, 5].map((x) => (
              <button key={x} className={`dot ${v === x ? 'on' : ''}`} onClick={() => setValue(x)} aria-label={`${n} ${x}`}>{x}</button>
            ))
          : (
            <>
              <button className="step" onClick={() => adjust(-1)} aria-label={`Decrease ${n}`}>−</button>
              <button className="step" onClick={() => adjust(1)} aria-label={`Increase ${n}`}>+</button>
            </>
          )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { db } = useApp()
  const s = score(db, today())
  const done = db.habits.filter((h) => ((db.logs[today()] || {}).h || {})[h.id] >= h.t).length
  const first = (db.profile?.name || db.user.name).split(' ')[0]

  return (
    <>
      <h2>Hello, {first}</h2>
      <p className="mut">{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      <div className="card row" style={{ gap: 24 }}>
        <Ring p={s / 100} s={150} big={s} sub="health score" />
        <div>
          <h3>Today’s health score</h3>
          <p className="mut" style={{ margin: 0, maxWidth: '46ch' }}>
            {s
              ? `Built from the metrics you have logged today${db.habits.length ? ` and ${done} of ${db.habits.length} habits completed` : ''}.`
              : 'Log your first metric below to see your score.'}
          </p>
        </div>
      </div>
      <div className="grid">{M.map((m) => <MetricCard key={m[0]} m={m} />)}</div>
      <h3 style={{ marginTop: 22 }}>Wellness suggestions</h3>
      {getRecommendations(db).map((r) => (
        <div className="card" key={r[1]}>
          <h3>{r[1]}</h3>
          <p className="mut" style={{ margin: 0 }}>{r[2]}</p>
        </div>
      ))}
      <p className="mut" style={{ fontSize: '.85rem' }}>
        These suggestions are general wellness information, not medical advice, diagnosis or treatment. Speak with a qualified clinician about health concerns.
      </p>
    </>
  )
}
