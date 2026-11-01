// localStorage persistence for the whole app state.
const KEY = 'hh'

export const emptyDb = () => ({ habits: [], logs: {}, weights: [] })

export function loadDb() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || emptyDb()
  } catch {
    return emptyDb()
  }
}

export function saveDb(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
    return true
  } catch {
    return false
  }
}

export function clearDb() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

// Returns today's (or any day's) log, creating it if missing. Mutates the db it is given.
export function ensureLog(db, d) {
  const l = db.logs[d] || (db.logs[d] = {})
  l.h = l.h || {}
  return l
}
