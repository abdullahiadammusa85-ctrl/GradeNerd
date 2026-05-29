import { useState } from 'react'
import { calcCGPA, getDegreeClass } from '../utils/gradeUtils'

export default function GoalTracker({ semesters }) {
  const cgpa = calcCGPA(semesters)
  const [targetClass, setTargetClass] = useState('4.5')
  const targetNum  = parseFloat(targetClass)
  const degClass   = getDegreeClass(cgpa)
  const targetDeg  = getDegreeClass(targetNum)
  const progress   = Math.min((cgpa/targetNum)*100,100)
  const totalUnits = semesters.reduce((s,sem)=>s+sem.courses.reduce((a,c)=>a+(parseFloat(c.units)||0),0),0)
  const remaining  = Math.max(120-totalUnits, 0)
  const gpuNeeded  = remaining>0 ? (targetNum*(totalUnits+remaining)-cgpa*totalUnits)/remaining : 0

  const card = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem', marginBottom:'1.25rem' }
  const inp  = { width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8,
    padding:'0.5rem 0.7rem', color:'var(--text)', fontFamily:'DM Sans,sans-serif', fontSize:'0.85rem', outline:'none', cursor:'pointer' }

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginBottom:'1.25rem' }}>
        <div style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.1),rgba(99,102,241,0.1))', border:'1px solid rgba(34,197,94,0.2)', borderRadius:16, padding:'1.5rem' }}>
          <div style={{ fontSize:'0.75rem', color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Current CGPA</div>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'3rem', fontWeight:800, color:degClass.color, lineHeight:1.1, marginTop:'0.25rem' }}>{cgpa.toFixed(2)}</div>
          <div style={{ color:degClass.color, fontWeight:600, fontSize:'0.85rem', marginTop:'0.25rem' }}>{degClass.label}</div>
        </div>
        <div style={{ ...card, background:'var(--surface2)', marginBottom:0 }}>
          <div style={{ fontSize:'0.75rem', color:'var(--muted)', fontWeight:600, marginBottom:'0.75rem' }}>Set Target</div>
          <select style={inp} value={targetClass} onChange={e=>setTargetClass(e.target.value)}>
            <option value="4.5">First Class (4.50 – 5.00)</option>
            <option value="3.5">Second Class Upper (3.50 – 4.49)</option>
            <option value="2.4">Second Class Lower (2.40 – 3.49)</option>
            <option value="1.5">Third Class (1.50 – 2.39)</option>
          </select>
          <div style={{ marginTop:'0.75rem', fontSize:'0.8rem', color:'var(--muted)' }}>
            Target: <strong style={{ color:targetDeg.color }}>{targetNum.toFixed(2)} — {targetDeg.label}</strong>
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'1.25rem' }}>📍 Progress Toward Goal</div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'var(--muted)', marginBottom:'0.4rem' }}>
          <span>0.00</span><span style={{ color:'var(--text)', fontWeight:600 }}>{progress.toFixed(0)}% there</span><span>{targetNum.toFixed(2)}</span>
        </div>
        <div style={{ height:12, background:'var(--surface2)', borderRadius:10, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:`linear-gradient(90deg,var(--accent),${targetDeg.color})`, borderRadius:10, transition:'width 0.8s' }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem', marginTop:'1rem' }}>
          {[
            { label:'Current CGPA', value:cgpa.toFixed(2), color:degClass.color },
            { label:'Target CGPA',  value:targetNum.toFixed(2), color:targetDeg.color },
            { label:'Gap', value:Math.max(targetNum-cgpa,0).toFixed(2), color:'var(--muted)' },
          ].map(s=>(
            <div key={s.label} style={{ textAlign:'center', padding:'0.75rem', background:'var(--surface2)', borderRadius:10 }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.4rem', fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:'0.7rem', color:'var(--muted)', marginTop:'0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {cgpa<targetNum ? (
        <div style={card}>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'1.25rem' }}>🗺️ Action Plan</div>
          {[
            { icon:'📋', text:<>Estimated remaining units: ~<strong>{remaining}</strong>. You need avg GPA of <strong style={{ color:gpuNeeded<=5?targetDeg.color:'var(--red)' }}>{gpuNeeded<=5?gpuNeeded.toFixed(2):'Not achievable'}</strong> per semester.</> },
            gpuNeeded<=5&&gpuNeeded>=4.5 && { icon:'💪', text:<><strong>Challenging but possible!</strong> Score mostly A's and focus on core technical units.</> },
            gpuNeeded<=5&&gpuNeeded<4.5  && { icon:'✅', text:<><strong>Achievable with focus.</strong> Maintain consistent B+ grades and avoid carryovers.</> },
            gpuNeeded>5 && { icon:'⚠️', text:<><strong>Target may not be reachable</strong> with remaining units. Adjust your target or explore extra credit units.</> },
          ].filter(Boolean).map((ins,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:12, padding:'1rem', marginBottom:'0.75rem' }}>
              <span style={{ fontSize:'1.1rem' }}>{ins.icon}</span>
              <div style={{ fontSize:'0.82rem', color:'var(--muted)', lineHeight:1.55 }}>{ins.text}</div>
            </div>
          ))}
        </div>
      ):(
        <div style={{ ...card, background:'rgba(34,197,94,0.08)', borderColor:'rgba(34,197,94,0.3)', textAlign:'center' }}>
          <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>🎉</div>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.1rem', color:'var(--green)' }}>Goal Achieved!</div>
          <div style={{ color:'var(--muted)', fontSize:'0.85rem', marginTop:'0.4rem' }}>
            Your CGPA of <strong>{cgpa.toFixed(2)}</strong> already meets your target of <strong>{targetNum.toFixed(2)}</strong>.
          </div>
        </div>
      )}
    </div>
  )
}