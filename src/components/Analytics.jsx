import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { days, today } from '../utils/dates'
import { M, avg, habitPct, seedLogs } from '../utils/metrics'
import { BarsV, Line, MetricBars } from './Charts'

const ChartCard = ({ title, children }) => <div className="card"><h3>{title}</h3>{children}</div>

export default function Analytics() {
  const { db, update, toast } = useApp()
  const [per, setPer] = useState(7)
  const D = days(per)
  const P = days(per, per)
  const has = D.some((d) => db.logs[d])

  const hp = D.map((d) => habitPct(db, d) || 0)
  const done = hp.length ? Math.round((hp.reduce((a, b) => a + b) / hp.length) * 100) : 0
  const W = db.weights.slice(-12)
  const wv = W.map((x) => x.w)
  const log = (k) => D.map((d, i) => [i, (db.logs[d] || {})[k] ?? null])

  const loadSample = () => { update((d) => seedLogs(d)); toast('Sample history added') }
  function addWeight(e) {
    e.preventDefault()
    const f = e.currentTarget
    const w = +f.elements.w.value
    if (!(w >= 20 && w <= 300)) return toast('Enter a weight between 20 and 300 kg')
    update((d) => {
      d.weights = d.weights.filter((x) => x.d !== today())
      d.weights.push({ d: today(), w })
    })
    f.reset()
  }

  return (
    <>
      <div className="row sp">
        <h2>Analytics</h2>
        <span className="row">
          <button className={`btn ${per === 7 ? '' : 'g'}`} onClick={() => setPer(7)}>Weekly</button>
          <button className={`btn ${per === 30 ? '' : 'g'}`} onClick={() => setPer(30)}>Monthly</button>
        </span>
      </div>
      {!has && (
        <div className="card row sp">
          <span className="mut">No data yet. Log a few days, or preview with sample data.</span>
          <button className="btn g" onClick={loadSample}>Load sample data</button>
        </div>
      )}
      <div className="card">
        <h3>This period vs previous {per} days</h3>
        <table>
          <tbody>
            <tr><th>Average</th><th>Now</th><th>Before</th><th>Change</th></tr>
            {M.map((m) => {
              const a = avg(db, m[0], D)
              const b = avg(db, m[0], P)
              const d = a != null && b != null ? Math.round((a - b) * 10) / 10 : null
              return (
                <tr key={m[0]}>
                  <th>{m[1]}</th><td>{a ?? '–'}</td><td>{b ?? '–'}</td><td>{d == null ? '–' : (d > 0 ? '+' : '') + d}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="grid g2">
        <ChartCard title="Sleep pattern (hrs)"><MetricBars k="sleep" n={per} col="var(--or)" /></ChartCard>
        <ChartCard title="Water (glasses)"><MetricBars k="water" n={per} col="var(--ye)" /></ChartCard>
        <ChartCard title="Exercise consistency (min)"><MetricBars k="exercise" n={per} col="var(--gr)" /></ChartCard>
        <ChartCard title={`Habit completion · ${done}% avg`}><BarsV D={D} V={hp} mx={1} col="var(--gr)" t={0} /></ChartCard>
        <ChartCard title="Mood (yellow) and stress (red)">
          <Line sets={[{ c: 'var(--ye)', p: log('mood') }, { c: 'var(--bad)', p: log('stress') }]} n={per} lo={1} hi={5} />
        </ChartCard>
        <ChartCard title="Weight history (kg)">
          {wv.length > 1
            ? <Line sets={[{ c: 'var(--or)', p: wv.map((v, i) => [i, v]) }]} n={wv.length} lo={Math.floor(Math.min(...wv) - 1)} hi={Math.ceil(Math.max(...wv) + 1)} />
            : <p className="mut">Log weight on two different days to see a trend.</p>}
          <form className="row" onSubmit={addWeight}>
            <input name="w" type="number" step="0.1" placeholder="Today’s weight" style={{ width: 150 }} />
            <button className="btn g">Log</button>
          </form>
        </ChartCard>
      </div>
    </>
  )
}
