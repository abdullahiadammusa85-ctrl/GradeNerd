import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts'
import { calcCGPA, calcSemesterGPA, getDegreeClass } from '../utils/gradeUtils'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', padding:'0.6rem 0.9rem', borderRadius:10, fontSize:'0.8rem' }}>
      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, marginBottom:2 }}>{label}</div>
      <div style={{ color:'var(--accent2)' }}>GPA: <strong>{Number(payload[0]?.value).toFixed(2)}</strong></div>
    </div>
  )
}

export default function Dashboard({ semesters }) {
  const cgpa       = calcCGPA(semesters)
  const degClass   = getDegreeClass(cgpa)
  const totalUnits = semesters.reduce((s,sem) => s + sem.courses.reduce((a,c) => a+(parseFloat(c.units)||0),0),0)
  const totalCourses = semesters.reduce((s,sem) => s + sem.courses.filter(c=>c.title||c.code).length, 0)
  const gpas = semesters.map(s => calcSemesterGPA(s.courses))
  const bestGPA = gpas.length ? Math.max(...gpas) : 0
  const lowestGPA = gpas.length ? Math.min(...gpas) : 0
  const bestSem = semesters[gpas.indexOf(bestGPA)]?.name || '—'
  const lowestSem = semesters[gpas.indexOf(lowestGPA)]?.name || '—'
  const trend = gpas.length>=2 ? gpas[gpas.length-1]>gpas[gpas.length-2]?'↑ Improving':gpas[gpas.length-1]<gpas[gpas.length-2]?'↓ Declining':'→ Stable' : '—'
  const chartData = semesters.map(sem => ({ name: sem.name.length>12?sem.name.slice(0,11)+'…':sem.name, gpa: parseFloat(calcSemesterGPA(sem.courses).toFixed(2)) }))
  const cgpaProgress = Math.min((cgpa/5)*100, 100)

  const insights = []
  if (cgpa>=4.5) insights.push({ icon:'🏆', text:<><strong>Excellent!</strong> You're maintaining First Class standing.</> })
  else if (cgpa>=3.5) insights.push({ icon:'⭐', text:<><strong>Great work!</strong> Consistently scoring 4.6+ will push you to First Class.</> })
  else if (cgpa>=2.4) insights.push({ icon:'📈', text:<><strong>You can do better.</strong> Reduce F/E grades — consistent B's will lift your class.</> })
  else insights.push({ icon:'⚠️', text:<><strong>Critical:</strong> Your CGPA needs urgent attention. Consider retakes and study planning.</> })
  if (gpas.length>=2 && gpas[gpas.length-1]<gpas[gpas.length-2]) insights.push({ icon:'📉', text:<><strong>Declining trend.</strong> Last semester GPA dropped. Review study habits and course load.</> })
  if (totalCourses===0) insights.push({ icon:'🎓', text:<><strong>Get started!</strong> Add courses in the Calculator tab to see your analysis.</> })

  if (semesters.length===0||totalCourses===0) return (
    <div style={{ textAlign:'center', padding:'4rem 1rem' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📊</div>
      <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.4rem', marginBottom:'0.5rem' }}>No Data Yet</h2>
      <p style={{ color:'var(--muted)', fontSize:'0.9rem' }}>Add your courses in the <strong>Calculator</strong> tab to see your academic dashboard.</p>
    </div>
  )

  const card = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem' }

  return (
    <div>
      <div style={{ ...card, background:degClass.bg, borderColor:degClass.color+'40', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginBottom:'0.25rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Current Standing</div>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:800, color:degClass.color }}>{degClass.label}</div>
          <div style={{ height:6, width:200, background:'var(--surface2)', borderRadius:10, overflow:'hidden', marginTop:'0.5rem' }}>
            <div style={{ height:'100%', width:`${cgpaProgress}%`, background:degClass.color, borderRadius:10, transition:'width 0.6s' }} />
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginBottom:'0.25rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>CGPA</div>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2.5rem', fontWeight:800, letterSpacing:'-0.04em', color:degClass.color }}>{cgpa.toFixed(2)}</div>
          <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>out of 5.00</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { label:'Total Semesters', value:semesters.length, sub:'recorded', color:'var(--accent)' },
          { label:'Total Units', value:totalUnits, sub:'credit units', color:'var(--blue)' },
          { label:'Best GPA', value:bestGPA.toFixed(2), sub:bestSem, color:'var(--green)' },
          { label:'Lowest GPA', value:lowestGPA.toFixed(2), sub:lowestSem, color:'var(--amber)' },
          { label:'Trend', value:trend.split(' ')[0], sub:trend.split(' ').slice(1).join(' '),
            color:trend.includes('↑')?'var(--green)':trend.includes('↓')?'var(--red)':'var(--muted)' },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:'1.25rem', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.color, borderRadius:'14px 14px 0 0' }} />
            <div style={{ fontSize:'0.72rem', color:'var(--muted)', fontWeight:600, marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.8rem', fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginTop:'0.3rem' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {chartData.length>=2 && (
        <div style={card}>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'1.25rem' }}>📈 GPA Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill:'var(--muted)', fontSize:11 }} />
              <YAxis domain={[0,5]} tick={{ fill:'var(--muted)', fontSize:11 }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={4.5} stroke="var(--green)" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value:'1st Class', fill:'var(--green)', fontSize:10 }} />
              <ReferenceLine y={3.5} stroke="var(--blue)" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value:'2nd Upper', fill:'var(--blue)', fontSize:10 }} />
              <Line type="monotone" dataKey="gpa" stroke="var(--accent2)" strokeWidth={2.5}
                dot={{ fill:'var(--accent)', r:4, strokeWidth:2, stroke:'var(--bg)' }} activeDot={{ r:6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={card}>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'1.25rem' }}>📊 GPA by Semester</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill:'var(--muted)', fontSize:11 }} />
            <YAxis domain={[0,5]} tick={{ fill:'var(--muted)', fontSize:11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="gpa" fill="var(--accent)" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={card}>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'1.25rem' }}>💡 Insights</div>
        {insights.map((ins,i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', background:'var(--surface2)',
            border:'1px solid var(--border)', borderRadius:12, padding:'1rem', marginBottom:'0.75rem' }}>
            <span style={{ fontSize:'1.1rem' }}>{ins.icon}</span>
            <div style={{ fontSize:'0.82rem', color:'var(--muted)', lineHeight:1.55 }}>{ins.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}