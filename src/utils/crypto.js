// SHA-256 hash (hex) used to store a salted-by-email password hash on this device.
export async function hashText(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
}
