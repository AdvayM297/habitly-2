import { useApp } from '../context/AppContext'
import { navigate } from '../hooks/useHash'
import { today } from '../utils/dates'
import { FIELD_SECTIONS, GOALS } from '../utils/profileFields'

function Field({ field, profile }) {
  const [id, label, type, a, b] = field
  const v = profile[id] ?? ''
  const required = (type === 't' || type === 'date' || type === 'n') && a === 1
  let input
  if (type === 's') {
    input = (
      <select name={id} defaultValue={v}>
        <option value="">Skip</option>
        {a.split(',').map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    )
  } else if (type === 'a') {
    input = <textarea name={id} placeholder="Optional" defaultValue={v}></textarea>
  } else {
    const extra = type === 'n' ? { step: 'any', min: (b || [0])[0], max: (b || [0, 1e6])[1] } : type === 'date' ? { max: today() } : {}
    input = <input name={id} type={type === 'n' ? 'number' : type === 'date' ? 'date' : 'text'} defaultValue={v} required={required} {...extra} />
  }
  return <label className={type === 'a' ? 'w' : ''}>{label}{required ? ' *' : ''}{input}</label>
}

export default function Profile() {
  const { db, update, toast, wipe } = useApp()
  const p = db.profile || {}

  function save(e) {
    e.preventDefault()
    const f = e.currentTarget
    if (!f.reportValidity()) return
    const prof = {}
    FIELD_SECTIONS.forEach((s) => s[1].forEach((x) => { prof[x[0]] = f.elements[x[0]].value.trim() }))
    prof.goals = GOALS.filter((g, i) => f.elements['g' + i].checked)
    update((d) => {
      d.profile = prof
      d.weights = d.weights.filter((x) => x.d !== today())
      d.weights.push({ d: today(), w: +prof.weight })
    })
    toast('Health profile saved')
    navigate('dashboard')
  }

  return (
    <>
      <h2>Health profile</h2>
      <p className="mut">Only you can see this information. It is stored on this device. Skip any optional question and update it whenever you need.</p>
      <form onSubmit={save} noValidate>
        {FIELD_SECTIONS.map((s) => (
          <div className="card" key={s[0]}>
            <h3>{s[0]}</h3>
            <div className="fg">{s[1].map((x) => <Field key={x[0]} field={x} profile={p} />)}</div>
          </div>
        ))}
        <div className="card">
          <h3>Health goals</h3>
          {GOALS.map((g, i) => (
            <label className="chk" key={g}>
              <input type="checkbox" name={'g' + i} defaultChecked={(p.goals || []).includes(g)} />{g}
            </label>
          ))}
        </div>
        <button className="btn big m">Save profile</button>
      </form>
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Privacy</h3>
        <p className="mut">You gave consent on {db.consent ? new Date(db.consent).toLocaleDateString() : 'signup'}. Your data is never shown publicly.</p>
        <button className="btn r" onClick={wipe}>Delete my account and data</button>
      </div>
    </>
  )
}
