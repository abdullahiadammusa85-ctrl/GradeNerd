export default function Navbar({ tabs, tab, setTab, dark, setDark }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: dark ? 'rgba(10,13,20,0.85)' : 'rgba(244,246,251,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 60,
    }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
        Grade<span style={{ color: 'var(--accent2)' }}>Nerd</span>
      </div>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '0.4rem 0.9rem', borderRadius: 8, cursor: 'pointer',
            fontSize: '0.8rem', fontWeight: 500,
            color: tab === t.id ? 'var(--text)' : 'var(--muted)',
            background: tab === t.id ? 'var(--surface2)' : 'transparent',
            border: 'none', transition: 'all 0.15s'
          }}>{t.label}</button>
        ))}
      </div>
      <button onClick={() => setDark(d => !d)} style={{
        width: 32, height: 32, borderRadius: 8,
        border: '1px solid var(--border)', background: 'var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: '0.9rem'
      }}>{dark ? '☀️' : '🌙'}</button>
    </nav>
  )
}