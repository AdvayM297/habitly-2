import { useApp } from '../context/AppContext'
import { days } from '../utils/dates'
import { avg } from '../utils/metrics'

const Kv = ({ k, v }) => (v ? <tr><th>{k}</th><td>{v}</td></tr> : null)

export default function Reports() {
  const { db } = useApp()
  const p = db.profile || {}
  const D = days(7)
  const a = (k) => avg(db, k, D) ?? 'no data'
  const w = db.weights.at(-1)
  const age = p.dob ? Math.floor((Date.now() - new Date(p.dob)) / 315576e5) : ''

  return (
    <>
      <div className="row sp noprint">
        <h2>Doctor’s health report</h2>
        <button className="btn m" onClick={() => window.print()}>Download as PDF</button>
      </div>
      <p className="mut noprint">Choose “Save as PDF” in the print window. Review the report before sharing it with your physician.</p>
      <div className="card">
        <h2>Health summary</h2>
        <p className="mut">Generated {new Date().toLocaleDateString()} by Habitly · self-reported, not a diagnosis</p>

        <h3>Personal information</h3>
        <table><tbody>
          <Kv k="Name" v={p.name} /><Kv k="Age" v={age} /><Kv k="Gender" v={p.gender} />
          <Kv k="Height / weight" v={p.height ? p.height + ' cm / ' + (w ? w.w : p.weight) + ' kg' : ''} />
          <Kv k="Blood group" v={p.blood} /><Kv k="Occupation" v={p.job} /><Kv k="Activity level" v={p.act} />
        </tbody></table>

        <h3 style={{ marginTop: 16 }}>Medical history</h3>
        <table><tbody>
          <Kv k="Conditions" v={p.cond} /><Kv k="Diabetes" v={p.diab} /><Kv k="Blood pressure issues" v={p.bp} />
          <Kv k="Heart conditions" v={p.heart} /><Kv k="Thyroid problems" v={p.thy} /><Kv k="Allergies" v={p.allergy} />
          <Kv k="Current medications" v={p.meds} /><Kv k="Surgeries" v={p.surg} /><Kv k="Family history" v={p.fam} />
        </tbody></table>

        <h3 style={{ marginTop: 16 }}>Lifestyle</h3>
        <table><tbody>
          <Kv k="Breakfast regularly" v={p.bfast} /><Kv k="Junk food" v={p.junk} /><Kv k="Fruit and vegetables" v={p.fv} />
          <Kv k="Caffeine" v={p.caff} /><Kv k="Tobacco" v={p.smoke} /><Kv k="Alcohol" v={p.alc} /><Kv k="Exercise" v={p.ex} />
          <Kv k="Stress / anxiety / mood" v={[p.stressLv, p.anx, p.moodLv].filter(Boolean).join(' / ')} />
          <Kv k="Sleep quality" v={p.sleepQ} />
        </tbody></table>

        <h3 style={{ marginTop: 16 }}>Last 7 days (averages from daily logs)</h3>
        <table><tbody>
          <tr><th>Sleep</th><td>{a('sleep')} hrs</td></tr>
          <tr><th>Water</th><td>{a('water')} glasses</td></tr>
          <tr><th>Steps</th><td>{a('steps')}</td></tr>
          <tr><th>Exercise</th><td>{a('exercise')} min</td></tr>
          <tr><th>Screen time</th><td>{a('screen')} hrs</td></tr>
          <tr><th>Mood / stress (1–5)</th><td>{a('mood')} / {a('stress')}</td></tr>
        </tbody></table>

        <h3 style={{ marginTop: 16 }}>Symptoms and goals</h3>
        <table><tbody>
          <Kv k="Reported symptoms" v={p.sym} />
          <Kv k="Health goals" v={(p.goals || []).join(', ')} />
        </tbody></table>
      </div>
    </>
  )
}
