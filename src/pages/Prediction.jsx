import { useState, useMemo } from 'react'
import { GRADE_LABELS, GRADE_POINTS, calcCGPA, getDegreeClass } from '../utils/gradeUtils'

export default function Prediction({ semesters }) {
  const currentCGPA = calcCGPA(semesters)
  const totalUnits  = semesters.reduce((s,sem) => s+sem.courses.reduce((a,c)=>a+(parseFloat(c.units)||0),0),0)
  const [nextUnits, setNextUnits]   = useState(18)
  const [grades, setGrades]         = useState({ A:3,B:2,C:0,D:0,E:0,F:0 })
  const [targetCGPA, setTargetCGPA] = useState(4.5)

  const predictedGPA = useMemo(() => {
    const courses = Object.values(grades).reduce((a,b)=>a+b,0)
    if (!courses) return 0
    const upc = nextUnits/courses
    return Object.entries(grades).reduce((s,[g,n])=>s+n*upc*GRADE_POINTS[g],0)/nextUnits
  },[grades,nextUnits])

  const newCGPA = useMemo(()=>{
    return (currentCGPA*totalUnits + predictedGPA*nextUnits)/(totalUnits+nextUnits)
  },[currentCGPA,totalUnits,predictedGPA,nextUnits])

  const requiredGPA = useMemo(()=>{
    if (!totalUnits) return targetCGPA
    return Math.min(Math.max((targetCGPA*(totalUnits+nextUnits)-currentCGPA*totalUnits)/nextUnits,0),99)
  },[currentCGPA,totalUnits,targetCGPA,nextUnits])

  const newDeg = getDegreeClass(newCGPA)
  const improved = newCGPA > currentCGPA
  const card = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem', marginBottom:'1.25rem' }
  const inp  = { width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8,
    padding:'0.5rem 0.7rem', color:'var(--text)', fontFamily:'DM Sans,sans-serif', fontSize:'0.85rem', outline:'none' }

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginBottom:'1.25rem' }}>
        <div style={card}>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'1.25rem' }}>🔮 What-If Simulator</div>
          <div style={{ marginBottom:'1rem' }}>
            <div style={{ fontSize:'0.75rem', color:'var(--muted)', marginBottom:'0.4rem', fontWeight:600 }}>Next Semester Credit Units</div>
            <input type="range" min={6} max={30} step={1} value={nextUnits} onChange={e=>setNextUnits(+e.target.value)} style={{ width:'100%', accentColor:'var(--accent)' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.72rem', color:'var(--muted)' }}>
              <span>6</span><span style={{ color:'var(--accent2)', fontWeight:700 }}>{nextUnits} units</span><span>30</span>
            </div>
          </div>
          <div style={{ fontSize:'0.75rem', color:'var(--muted)', marginBottom:'0.75rem', fontWeight:600 }}>Expected Grade Distribution</div>
          {GRADE_LABELS.map(g=>(
            <div key={g} style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, width:20, color:'var(--accent2)' }}>{g}</span>
              <input type="range" min={0} max={10} step={1} value={grades[g]} onChange={e=>setGrades(p=>({...p,[g]:+e.target.value}))} style={{ flex:1, accentColor:'var(--accent)' }} />
              <span style={{ minWidth:20, textAlign:'right', fontSize:'0.8rem', fontWeight:600 }}>{grades[g]}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(129,140,248,0.08))', border:'1px solid rgba(99,102,241,0.3)', borderRadius:14, padding:'1.5rem', textAlign:'center', marginBottom:'1rem' }}>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginBottom:'0.25rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Predicted CGPA</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'3.5rem', fontWeight:800, color:newDeg.color, lineHeight:1, letterSpacing:'-0.04em' }}>{newCGPA.toFixed(2)}</div>
            <div style={{ color:newDeg.color, fontWeight:600, fontSize:'0.9rem', marginTop:'0.4rem' }}>{newDeg.label}</div>
            <div style={{ marginTop:'0.75rem', fontSize:'0.8rem', color:'var(--muted)' }}>
              Current: <strong>{currentCGPA.toFixed(2)}</strong> → <strong style={{ color:newDeg.color }}>{newCGPA.toFixed(2)}</strong>
              <span style={{ color:improved?'var(--green)':'var(--red)', marginLeft:'0.5rem' }}>{improved?'▲':'▼'} {Math.abs(newCGPA-currentCGPA).toFixed(2)}</span>
            </div>
          </div>
          <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:12, padding:'1.25rem', marginBottom:'1rem' }}>
            <div style={{ fontSize:'0.75rem', color:'var(--muted)', marginBottom:'0.5rem', fontWeight:600 }}>Next Semester Predicted GPA</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2rem', fontWeight:800 }}>{predictedGPA.toFixed(2)}</div>
          </div>
          <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:12, padding:'1.25rem' }}>
            <div style={{ fontSize:'0.75rem', color:'var(--muted)', marginBottom:'0.5rem', fontWeight:600 }}>GPA Needed for Target ({targetCGPA.toFixed(1)})</div>
            <input type="range" min={1.5} max={5.0} step={0.1} value={targetCGPA} onChange={e=>setTargetCGPA(+e.target.value)} style={{ width:'100%', accentColor:'var(--accent)', marginBottom:'0.5rem' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontFamily:'Syne,sans-serif', fontSize:'2rem', fontWeight:800, color:requiredGPA>5?'var(--red)':'var(--green)' }}>
                {requiredGPA>5?'Not achievable':requiredGPA.toFixed(2)}
              </span>
              <span style={{ fontSize:'0.75rem', color:'var(--muted)' }}>next semester</span>
            </div>
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'1.25rem' }}>🎯 Degree Class Roadmap</div>
        {[
          { label:'First Class', min:4.5, color:'#22c55e' },
          { label:'Second Class Upper', min:3.5, color:'#3b82f6' },
          { label:'Second Class Lower', min:2.4, color:'#f59e0b' },
          { label:'Third Class', min:1.5, color:'#ef4444' },
        ].map(dc=>{
          const needed = totalUnits>0 ? (dc.min*(totalUnits+nextUnits)-currentCGPA*totalUnits)/nextUnits : dc.min
          const already = currentCGPA>=dc.min
          return (
            <div key={dc.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.75rem 1rem', borderRadius:10, background:'var(--surface2)', border:`1px solid ${already?dc.color+'40':'var(--border)'}`, marginBottom:'0.75rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:dc.color }} />
                <span style={{ fontWeight:600, fontSize:'0.85rem' }}>{dc.label}</span>
                <span style={{ fontSize:'0.72rem', color:'var(--muted)' }}>≥ {dc.min}</span>
              </div>
              {already
                ? <span style={{ color:dc.color, fontSize:'0.8rem', fontWeight:600 }}>✓ Achieved</span>
                : needed<=5
                  ? <span style={{ fontSize:'0.8rem', color:'var(--muted)' }}>Need <strong style={{ color:dc.color }}>{needed.toFixed(2)}</strong> next sem</span>
                  : <span style={{ color:'var(--red)', fontSize:'0.8rem' }}>Not reachable in 1 sem</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}