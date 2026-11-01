import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ensureLog } from '../utils/storage'
import { ds, today } from '../utils/dates'
import { habitPct } from '../utils/metrics'

function HabitCard({ h }) {
  const { db, update } = useApp()
  const v = (db.logs[today()] || {}).h?.[h.id] || 0
  const p = Math.min(1, v / h.t)

  const adjust = (dir) => update((d) => {
    const l = ensureLog(d, today())
    l.h[h.id] = Math.max(0, (l.h[h.id] || 0) + dir)
  })
  const edit = () => {
    const name = prompt('Habit name', h.name)
    if (!name) return
    const t = +prompt('Daily target', h.t)
    if (t >= 1) update((d) => {
      const x = d.habits.find((y) => y.id === h.id)
      x.name = name
      x.t = t
    })
  }
  const remove = () => {
    if (confirm('Remove this habit and its history?')) update((d) => { d.habits = d.habits.filter((x) => x.id !== h.id) })
  }

  return (
    <div className="card">
      <div className="row sp"><b>{h.name}</b>{v >= h.t ? <span className="pill">Done</span> : null}</div>
      <div className="mut">{h.desc}{h.time ? ' · reminder ' + h.time : ''}</div>
      <div className="bar"><i className={p >= 1 ? 'ok' : ''} style={{ width: `${p * 100}%` }}></i></div>
      <div className="row sp">
        <span>{v} / {h.t} {h.unit}</span>
        <span className="row">
          <button className="step" onClick={() => adjust(-1)} aria-label="Decrease">−</button>
          <button className="step" onClick={() => adjust(1)} aria-label="Increase">+</button>
          <button className="btn g" onClick={edit}>Edit</button>
          <button className="btn r" onClick={remove}>Remove</button>
        </span>
      </div>
    </div>
  )
}

export default function Habits() {
  const { db, update, toast } = useApp()
  const [cm, setCm] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const mv = (n) => setCm(new Date(cm.getFullYear(), cm.getMonth() + n, 1))

  function addHabit(e) {
    e.preventDefault()
    const f = e.currentTarget
    const n = f.elements.n.value.trim()
    const t = +f.elements.t.value
    if (!n || !(t >= 1)) return toast('Add a habit name and a target of 1 or more')
    const habit = {
      id: Date.now().toString(36),
      name: n,
      desc: f.elements.d.value.trim(),
      t,
      unit: f.elements.u.value.trim() || 'times',
      time: f.elements.r.value,
    }
    update((d) => { d.habits.push(habit) })
    f.reset()
    toast('Habit added')
  }

  const askNotifications = () => {
    if (!('Notification' in window)) return toast('Reminders are not supported in this browser')
    Notification.requestPermission().then((p) => toast(p === 'granted' ? 'Reminders on while this tab is open' : 'Reminders blocked'))
  }

  const y = cm.getFullYear()
  const m = cm.getMonth()
  const count = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < cm.getDay(); i++) cells.push(<i key={'b' + i}></i>)
  for (let d = 1; d <= count; d++) {
    const k = ds(new Date(y, m, d))
    const p = habitPct(db, k)
    const cls = p == null ? '' : p >= 1 ? 'full' : p > 0 ? 'part' : k < today() ? 'miss' : ''
    cells.push(<div key={k} className={`day ${cls}`}>{d}</div>)
  }

  return (
    <>
      <h2>My habits</h2>
      <form className="card" onSubmit={addHabit}>
        <div className="fg">
          <label>Habit name *<input name="n" maxLength={40} placeholder="Read for 20 minutes" /></label>
          <label>Description<input name="d" maxLength={80} /></label>
          <label>Daily target *<input name="t" type="number" min="1" defaultValue="1" /></label>
          <label>Unit<input name="u" placeholder="pages, glasses…" /></label>
          <label>Daily reminder<input name="r" type="time" /></label>
        </div>
        <div className="row">
          <button className="btn m">Add habit</button>
          <button type="button" className="btn g" onClick={askNotifications}>Enable reminders</button>
        </div>
      </form>

      {db.habits.map((h) => <HabitCard key={h.id} h={h} />)}
      {!db.habits.length && <div className="card mut">No habits yet. Add one above to start your streak.</div>}

      <div className="card">
        <div className="row sp">
          <button className="btn g" onClick={() => mv(-1)} aria-label="Previous month">‹</button>
          <b>{cm.toLocaleString('en', { month: 'long', year: 'numeric' })}</b>
          <button className="btn g" onClick={() => mv(1)} aria-label="Next month">›</button>
        </div>
        <div className="cal">
          {[...'SMTWTFS'].map((x, i) => <span key={i}>{x}</span>)}
          {cells}
        </div>
        <p className="mut" style={{ fontSize: '.8rem' }}>Green: all habits done · Yellow: some done · Red outline: missed</p>
      </div>
    </>
  )
}
