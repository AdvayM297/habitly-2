import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { navigate } from '../hooks/useHash'
import { hashText } from '../utils/crypto'
import { Ring } from './Charts'

const FEATURES = [
  ['01', 'Patterns', 'Sleep, stress and activity move together. A few weeks of logs show how.'],
  ['02', 'Routines', 'Set a daily target for anything. Turn on a reminder if you want one.'],
  ['03', 'Progress', 'Weekly and monthly charts, kept plain and easy to read.'],
  ['04', 'Doctor visits', 'Print a summary of your history and your last seven days.'],
]

export default function Landing() {
  const { db, update, wipe } = useApp()
  const [auth, setAuth] = useState(null) // null | 'signup' | 'login'
  const [err, setErr] = useState('')
  const open = (mode) => { setErr(''); setAuth(mode) }

  async function onSubmit(e) {
    e.preventDefault()
    const f = e.currentTarget.elements
    const em = f.em.value.trim().toLowerCase()
    const pw = f.pw.value
    const name = f.nm ? f.nm.value.trim() : ''
    const consent = f.cn ? f.cn.checked : false
    const h = await hashText(em + pw)

    if (auth === 'signup') {
      if (db.user) return setErr('An account already exists on this device. Log in instead.')
      if (!consent) return setErr('Please give consent to continue.')
      update((d) => {
        d.user = { em, h, name }
        d.consent = new Date().toISOString()
        d.session = 1
      })
      navigate('profile')
    } else {
      if (!db.user || db.user.em !== em || db.user.h !== h) return setErr('Email or password does not match.')
      update((d) => { d.session = 1 })
      navigate('dashboard')
    }
  }

  return (
    <>
      <header className="top">
        <b><i className="mk"></i>Habitly</b>
        <span className="row">
          <button className="btn g" onClick={() => open('login')}>Log in</button>
          <button className="btn" onClick={() => open('signup')}>Sign up</button>
        </span>
      </header>

      <div className="hero">
        <div>
          <h1>Track the boring stuff.<em>See what it adds up to.</em></h1>
          <p className="mut" style={{ fontSize: '1.08rem', maxWidth: '46ch', margin: '0 0 26px' }}>
            Sleep, water, steps, mood, and the habits you keep dropping. Log them in under a minute a day, then look back at the pattern. Everything stays on your device.
          </p>
          <div className="row">
            <button className="btn big" onClick={() => open('signup')}>Get started</button>
            <span className="mut" style={{ fontSize: '.9rem' }}>Free. No email list.</span>
          </div>
        </div>
        <div className="card row" style={{ justifyContent: 'center', gap: 24 }}>
          <Ring p={0.82} s={140} big={82} sub="score" />
          <div style={{ font: '400 .9rem/1.9 var(--mono)' }}>
            <div className="lab mut" style={{ marginBottom: 4 }}>Sample day</div>
            Water <b>7/8</b><br />Sleep <b>7.5 h</b><br />Steps <b>8,200</b>
          </div>
        </div>
      </div>

      {auth && (
        <div className="land">
          <form key={auth} className="card" style={{ maxWidth: 420, margin: '0 auto' }} onSubmit={onSubmit}>
            <h3>{auth === 'signup' ? 'Create your account' : 'Welcome back'}</h3>
            {auth === 'signup' && <label>Your name<input name="nm" required /></label>}
            <label>Email<input name="em" type="email" required /></label>
            <label>Password<input name="pw" type="password" minLength={8} required /></label>
            {auth === 'signup' && (
              <label className="chk">
                <input type="checkbox" name="cn" />I consent to Habitly storing my health information on this device. It is private to me and never shown publicly.
              </label>
            )}
            <p className="err" role="alert">{err}</p>
            <button className="btn m">{auth === 'signup' ? 'Create account' : 'Log in'}</button>{' '}
            <button type="button" className="btn g" onClick={() => open(auth === 'signup' ? 'login' : 'signup')}>
              {auth === 'signup' ? 'I have an account' : 'Create account'}
            </button>
            {auth === 'login' && (
              <p><a href="#" className="mut" onClick={(e) => { e.preventDefault(); wipe() }}>Forgot password? Reset this device</a></p>
            )}
          </form>
        </div>
      )}

      <div className="land">
        <h2>What you get</h2>
        <div className="grid">
          {FEATURES.map(([n, t, d]) => (
            <div className="feat" key={n}>
              <div className="lab">{n}</div>
              <h3>{t}</h3>
              <p className="mut">{d}</p>
            </div>
          ))}
        </div>
        <p className="mut" style={{ marginTop: 28, fontSize: '.85rem' }}>
          Habitly offers general wellness information only. It does not diagnose conditions or recommend medication.
        </p>
      </div>
    </>
  )
}
