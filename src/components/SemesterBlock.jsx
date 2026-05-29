import { useState } from 'react'
import { GRADE_LABELS, GRADE_POINTS, calcSemesterGPA, getDegreeClass, emptyCourse } from '../utils/gradeUtils'

export default function SemesterBlock({ semester, onChange, onRemove }) {
  const [open, setOpen] = useState(true)
  const gpa        = calcSemesterGPA(semester.courses)
  const degClass   = getDegreeClass(gpa)
  const totalUnits = semester.courses.reduce((s, c) => s + (parseFloat(c.units) || 0), 0)

  const updateCourse = (id, field, value) =>
    onChange({ ...semester, courses: semester.courses.map(c => c.id === id ? { ...c, [field]: value } : c) })
  const addCourse    = () => onChange({ ...semester, courses: [...semester.courses, emptyCourse()] })
  const removeCourse = (id) => {
    if (semester.courses.length === 1) return
    onChange({ ...semester, courses: semester.courses.filter(c => c.id !== id) })
  }

  const inp = {
    width: '100%', background: 'var(--surface)',
    border: '1px solid var(--border)', borderRadius: 8,
    padding: '0.5rem 0.7rem', color: 'var(--text)',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none'
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: '1.25rem', overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{
        padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--surface2)', cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{open ? '▾' : '▸'}</span>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.9rem', fontWeight: 700 }}>{semester.name}</h3>
          {semester.session && <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>— {semester.session}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem',
            padding: '0.15rem 0.75rem', borderRadius: 10,
            background: degClass.bg, color: degClass.color }}>{gpa.toFixed(2)}</span>
          <button onClick={e => { e.stopPropagation(); onRemove() }} style={{
            background: 'rgba(239,68,68,0.12)', color: 'var(--red)',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8,
            padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem'
          }}>✕</button>
        </div>
      </div>

      {open && (
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <input style={{ ...inp, flex: 2 }} placeholder="Semester name"
              value={semester.name} onChange={e => onChange({ ...semester, name: e.target.value })} />
            <input style={{ ...inp, flex: 1 }} placeholder="Session (e.g. 2023/2024)"
              value={semester.session} onChange={e => onChange({ ...semester, session: e.target.value })} />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Course Title','Code','Units','Grade','Points',''].map((h,i) => (
                <th key={i} style={{
                  fontSize: '0.7rem', fontWeight: 600, color: 'var(--muted)',
                  textAlign: 'left', padding: '0 0.6rem 0.75rem',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  width: ['38%','20%','12%','12%','10%','6%'][i]
                }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {semester.courses.map(course => {
                const pts = (parseFloat(course.units) || 0) * (GRADE_POINTS[course.grade] ?? 0)
                return (
                  <tr key={course.id}>
                    {[
                      <input style={inp} placeholder="e.g. Engineering Mathematics" value={course.title} onChange={e => updateCourse(course.id,'title',e.target.value)} />,
                      <input style={inp} placeholder="e.g. MTH 201" value={course.code} onChange={e => updateCourse(course.id,'code',e.target.value)} />,
                      <select style={{ ...inp, cursor: 'pointer' }} value={course.units} onChange={e => updateCourse(course.id,'units',e.target.value)}>
                        <option value="">—</option>
                        {[1,2,3,4,5,6].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>,
                      <select style={{ ...inp, cursor: 'pointer' }} value={course.grade} onChange={e => updateCourse(course.id,'grade',e.target.value)}>
                        {GRADE_LABELS.map(g => <option key={g} value={g}>{g} ({GRADE_POINTS[g]})</option>)}
                      </select>,
                      <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.85rem', color: pts>0?'var(--accent2)':'var(--muted)' }}>{pts>0?pts:'—'}</span>,
                      <button onClick={() => removeCourse(course.id)} style={{
                        background: 'rgba(239,68,68,0.12)', color: 'var(--red)',
                        border: '1px solid rgba(239,68,68,0.2)', borderRadius:8,
                        padding:'0.3rem 0.5rem', cursor:'pointer', fontSize:'0.8rem'
                      }}>✕</button>
                    ].map((el, i) => <td key={i} style={{ padding: '0.4rem 0.6rem' }}>{el}</td>)}
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'1rem' }}>
            <button onClick={addCourse} style={{
              background:'transparent', color:'var(--muted)',
              border:'1px solid var(--border)', borderRadius:9,
              padding:'0.5rem 1.1rem', fontSize:'0.82rem', fontWeight:600, cursor:'pointer'
            }}>+ Add Course</button>
            <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', fontSize:'0.8rem', color:'var(--muted)' }}>
              <span>Units: <strong style={{ color:'var(--text)' }}>{totalUnits}</strong></span>
              <span>GPA: <strong style={{ fontFamily:'Syne,sans-serif', fontSize:'1rem', color:degClass.color }}>{gpa.toFixed(2)}</strong></span>
              <span style={{ background:degClass.bg, color:degClass.color, padding:'0.2rem 0.6rem', borderRadius:8, fontSize:'0.72rem', fontWeight:600 }}>{degClass.label}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}