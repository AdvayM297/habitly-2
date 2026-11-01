import { useEffect } from 'react'
import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import { navigate, useHash } from './hooks/useHash'
import Landing from './components/Landing'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import Dashboard from './components/Dashboard'
import Habits from './components/Habits'
import Profile from './components/Profile'
import Analytics from './components/Analytics'
import Reports from './components/Reports'

const VIEWS = { dashboard: Dashboard, habits: Habits, profile: Profile, analytics: Analytics, reports: Reports }

function Shell() {
  const { db } = useApp()
  const route = useHash() || 'dashboard'
  const needsProfile = db.session && !db.profile && route !== 'profile'

  // Until the health profile is filled in, send the user to it.
  useEffect(() => {
    if (needsProfile) navigate('profile')
  }, [needsProfile])

  if (!db.session) return <Landing />
  if (needsProfile) return null

  const view = VIEWS[route] ? route : 'dashboard'
  const View = VIEWS[view]
  return (
    <div className="app">
      <Sidebar view={view} />
      <main><View /></main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
      <Toast />
    </AppProvider>
  )
}
