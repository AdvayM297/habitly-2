import { useEffect, useState } from 'react'

// Tiny hash router: returns the current "#route" without the "#".
export function useHash() {
  const [hash, setHash] = useState(() => location.hash.slice(1))
  useEffect(() => {
    const on = () => setHash(location.hash.slice(1))
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return hash
}

export const navigate = (h) => {
  location.hash = h
}
