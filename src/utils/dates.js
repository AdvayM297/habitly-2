// Date helpers. All dates are stored as local "YYYY-MM-DD" strings.
export const ds = (d) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')

export const today = () => ds(new Date())

// The last n days ending today, shifted back by o days (o = 0 means "up to today").
export const days = (n, o = 0) =>
  [...Array(n)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i) - o)
    return ds(d)
  })
