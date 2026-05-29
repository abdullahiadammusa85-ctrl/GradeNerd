import { useCallback } from 'react'
import SemesterBlock from '../components/SemesterBlock'
import { calcCGPA, getDegreeClass, emptySemester } from '../utils/gradeUtils'

export default function Calculator({ semesters, setSemesters }) {
  const cgpa       = calcCGPA(semesters)
  const degClass   = getDegreeClass(cgpa)
  const totalUnits = semesters.reduce((s, sem) => s + sem.courses.reduce((a, c) => a + (parseFloat(c.units)||0), 0), 0)

  const addSemester    = () => setSemesters(s => [...s, emptySemester(s.length)])
  const updateSemester = useCallback((id, updated) => setSemesters(s => s.map(sem => sem.id===id ? updated : sem)), [setSemesters])
  const removeSemester = useCallback((id) => setSemesters(s => s.filter(sem => sem.id!==id)), [setSemesters])

  return (
    <div>
      {semesters.length > 0 && (
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16,
          padding:'1rem 1.5rem', marginBottom:'1.5rem'
        }}>
          <div>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Cumulative CGPA</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2.5rem', fontWeight:800, color:degClass.color, lineHeight:1, letterSpacing:'-0.04em' }}>{cgpa.toFixed(2)}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ background:degClass.bg, color:degClass.color, padding:'0.3rem 0.9rem', borderRadius:10, fontWeight:700, fontSize:'0.85rem', marginBottom:'0.25rem' }}>{degClass.label}</div>
            <div style={{ fontSize:'0.75rem', color:'var(--muted)' }}>{totalUnits} credit units · {semesters.length} semester{semesters.length!==1?'s':''}</div>
          </div>
        </div>
      )}

      {semesters.map((sem, i) => (
        <SemesterBlock key={sem.id} semester={sem} index={i}
          onChange={updated => updateSemester(sem.id, updated)}
          onRemove={() => removeSemester(sem.id)} />
      ))}

      <button onClick={addSemester} style={{
        width:'100%', background:'var(--accent)', color:'#fff',
        border:'none', borderRadius:9, padding:'0.75rem',
        fontFamily:'DM Sans,sans-serif', fontSize:'0.9rem', fontWeight:600,
        cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem'
      }}>+ Add Semester</button>

      {semesters.length===0 && (
        <div style={{ textAlign:'center', padding:'3rem 1rem', color:'var(--muted)' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>📚</div>
          <div style={{ fontSize:'0.9rem' }}>Add your first semester to start tracking</div>
        </div>
      )}
    </div>
  )
}