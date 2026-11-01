import { useApp } from '../context/AppContext'

const NAV = [
  ['dashboard', '01', 'Dashboard'],
  ['habits', '02', 'My Habits'],
  ['profile', '03', 'Health Profile'],
  ['analytics', '04', 'Analytics'],
  ['reports', '05', 'Reports'],
]

export default function Sidebar({ view }) {
  const { logout } = useApp()
  return (
    <nav aria-label="Main">
      <b><i className="mk"></i>Habitly</b>
      {NAV.map(([id, num, label]) => (
        <a key={id} href={`#${id}`} className={id === view ? 'on' : ''}>
          <span>{num}</span>{label}
        </a>
      ))}
      <a href="#" onClick={(e) => { e.preventDefault(); logout() }} style={{ marginTop: 'auto' }}>
        <span>—</span>Log out
      </a>
    </nav>
  )
}
