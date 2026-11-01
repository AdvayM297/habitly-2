import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { clearDb, emptyDb, loadDb, saveDb } from '../utils/storage'
import { ds } from '../utils/dates'

const AppContext = createContext(null)

export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [db, setDb] = useState(loadDb)
  const [msg, setMsg] = useState('')
  const timer = useRef(null)
  const dbRef = useRef(db)
  dbRef.current = db

  const toast = useCallback((m) => {
    setMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(''), 2200)
  }, [])

  // Apply a mutation to a copy of the state, save it, and re-render.
  const update = useCallback(
    (fn) => {
      const next = structuredClone(dbRef.current)
      fn(next)
      dbRef.current = next
      setDb(next)
      if (!saveDb(next)) toast('Could not save on this device')
    },
    [toast],
  )

  const logout = () => {
    update((d) => {
      d.session = 0
    })
    location.hash = ''
  }

  const wipe = () => {
    if (confirm('Delete your account and all health data from this device? This cannot be undone.')) {
      clearDb()
      dbRef.current = emptyDb()
      setDb(dbRef.current)
      location.hash = ''
    }
  }

  // Habit reminders: check every 20 seconds whether a habit's reminder time has arrived.
  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date()
      const t = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0')
      dbRef.current.habits.forEach((h) => {
        if (h.time === t && h.fired !== ds(n) + t) {
          h.fired = ds(n) + t
          toast('Reminder: ' + h.name)
          try {
            if (Notification.permission === 'granted') new Notification('Habitly', { body: h.name })
          } catch {
            /* notifications unavailable */
          }
        }
      })
    }, 20000)
    return () => clearInterval(id)
  }, [toast])

  return <AppContext.Provider value={{ db, update, toast, msg, logout, wipe }}>{children}</AppContext.Provider>
}
