import { useState, useCallback } from 'react'
import Landing from './pages/Landing'
import Calculator from './pages/Calculator'
import Dashboard from './pages/Dashboard'
import Prediction from './pages/Prediction'
import GoalTracker from './pages/GoalTracker'
import Navbar from './components/Navbar'
import { INITIAL_SEMESTERS } from './data/initialData'

export default function App() {
  const [dark, setDark] = useState(true)
  const [tab, setTab] = useState('home')
  const [semesters, setSemesters] = useState(INITIAL_SEMESTERS)

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'predict', label: 'Prediction' },
    { id: 'goal', label: 'Goal Tracker' },
  ]

  return (
    <div className={dark ? '' : 'light'} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Navbar tabs={tabs} tab={tab} setTab={setTab} dark={dark} setDark={setDark} />
      <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '2rem 1.5rem' }}>
        {tab === 'home'       && <Landing onGetStarted={() => setTab('calculator')} />}
        {tab === 'calculator' && <Calculator semesters={semesters} setSemesters={setSemesters} />}
        {tab === 'dashboard'  && <Dashboard semesters={semesters} />}
        {tab === 'predict'    && <Prediction semesters={semesters} />}
        {tab === 'goal'       && <GoalTracker semesters={semesters} />}
      </main>
    </div>
  )
}